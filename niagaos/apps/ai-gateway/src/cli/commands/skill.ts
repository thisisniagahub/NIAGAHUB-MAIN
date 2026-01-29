// =====================================================
// CLI Command: Skill Management
// Version 1.0 - Phase 4 Polish
// =====================================================

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// =====================================================
// Skill Registry (Mock - In production, fetch from API)
// =====================================================

const SKILL_REGISTRY: Record<string, SkillInfo> = {
    'research': {
        id: 'research',
        name: 'Deep Research',
        description: 'Multi-source research with semantic analysis',
        version: '1.0.0',
        domain: 'research',
        dependencies: ['@google/generative-ai'],
        tools: ['deep_research', 'fact_check', 'compare_documents']
    },
    'content': {
        id: 'content',
        name: 'Content Generation',
        description: 'Advanced content creation and transformation',
        version: '1.0.0',
        domain: 'content',
        dependencies: [],
        tools: ['generate_outline', 'expand_section', 'translate_content']
    },
    'automation': {
        id: 'automation',
        name: 'Workflow Automation',
        description: 'Task scheduling and workflow orchestration',
        version: '1.0.0',
        domain: 'automation',
        dependencies: ['cron-parser'],
        tools: ['schedule_generation', 'watch_sources', 'workflow_runner']
    },
    'analytics': {
        id: 'analytics',
        name: 'Usage Analytics',
        description: 'Comprehensive usage tracking and reporting',
        version: '1.0.0',
        domain: 'analytics',
        dependencies: [],
        tools: ['usage_analytics', 'cost_estimation', 'performance_metrics']
    },
    'memory': {
        id: 'memory',
        name: 'Long-Term Memory',
        description: 'Persistent memory with vector embeddings',
        version: '1.0.0',
        domain: 'core',
        dependencies: ['@supabase/supabase-js'],
        tools: ['store_memory', 'recall_memory', 'consolidate_memory']
    }
};

interface SkillInfo {
    id: string;
    name: string;
    description: string;
    version: string;
    domain: string;
    dependencies: string[];
    tools: string[];
}

interface SkillAddOptions {
    version?: string;
    dev?: boolean;
}

interface SkillListOptions {
    domain?: string;
    installed?: boolean;
}

interface SkillRemoveOptions {
    force?: boolean;
}

// =====================================================
// Skill Add
// =====================================================

export async function skillAdd(skillId: string, options: SkillAddOptions): Promise<void> {
    console.log(`\n📦 Adding skill: ${skillId}`);

    const skill = SKILL_REGISTRY[skillId];
    if (!skill) {
        console.error(`❌ Skill not found: ${skillId}`);
        console.log('\nAvailable skills:');
        Object.keys(SKILL_REGISTRY).forEach(id => {
            console.log(`  - ${id}: ${SKILL_REGISTRY[id].description}`);
        });
        process.exit(1);
    }

    const version = options.version || skill.version;
    console.log(`   Version: ${version}`);
    console.log(`   Tools: ${skill.tools.join(', ')}`);

    try {
        // Install dependencies
        if (skill.dependencies.length > 0) {
            console.log(`\n📥 Installing dependencies: ${skill.dependencies.join(', ')}`);
            const depFlag = options.dev ? '--save-dev' : '--save';
            execSync(`npm install ${depFlag} ${skill.dependencies.join(' ')}`, { stdio: 'inherit' });
        }

        // Update skills config
        updateSkillsConfig(skillId, skill);

        // Copy skill files (in production, download from registry)
        console.log('📝 Installing skill files...');
        installSkillFiles(skillId, skill);

        console.log(`\n✅ Skill '${skill.name}' installed successfully!`);
        console.log(`\nNew tools available:`);
        skill.tools.forEach(tool => {
            console.log(`  - ${tool}`);
        });

    } catch (error) {
        console.error('❌ Failed to install skill:', error);
        process.exit(1);
    }
}

function updateSkillsConfig(skillId: string, skill: SkillInfo): void {
    const cwd = process.cwd();
    const configPath = path.join(cwd, 'niagahub.config.js');

    if (!fs.existsSync(configPath)) {
        console.warn('⚠️  No niagahub.config.js found, skipping config update');
        return;
    }

    // Read current config
    let configContent = fs.readFileSync(configPath, 'utf-8');

    // Add skill to skills array (simple string replacement)
    if (!configContent.includes(`'${skillId}'`)) {
        configContent = configContent.replace(
            /skills:\s*\[/,
            `skills: [\n    '${skillId}',`
        );
        fs.writeFileSync(configPath, configContent);
    }
}

function installSkillFiles(skillId: string, skill: SkillInfo): void {
    const cwd = process.cwd();
    const skillDir = path.join(cwd, 'src', 'skills', skillId);

    // Create skill directory
    if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
    }

    // Generate index file
    const indexContent = `// ${skill.name} Skill
// Auto-generated by NiagaHub CLI

export const SKILL_INFO = {
    id: '${skillId}',
    name: '${skill.name}',
    version: '${skill.version}',
    tools: ${JSON.stringify(skill.tools, null, 4)}
};

// Export tools
${skill.tools.map(tool => `export { ${toCamelCase(tool)} } from './${tool}.js';`).join('\n')}
`;

    fs.writeFileSync(path.join(skillDir, 'index.ts'), indexContent);

    // Generate stub files for each tool
    for (const tool of skill.tools) {
        const toolContent = `// ${tool} Tool
// TODO: Implement this tool

import { z } from 'zod';

export const ${toCamelCase(tool)}Schema = z.object({
    // Define input schema
});

export async function ${toCamelCase(tool)}(input: z.infer<typeof ${toCamelCase(tool)}Schema>) {
    throw new Error('Not implemented');
}
`;
        fs.writeFileSync(path.join(skillDir, `${tool}.ts`), toolContent);
    }
}

// =====================================================
// Skill List
// =====================================================

export async function skillList(options: SkillListOptions): Promise<void> {
    console.log('\n📋 Available Skills\n');

    const skills = Object.values(SKILL_REGISTRY);
    const filtered = options.domain
        ? skills.filter(s => s.domain === options.domain)
        : skills;

    // Check installed skills
    const installedSkills = getInstalledSkills();

    if (options.installed) {
        console.log('Installed skills:\n');
        for (const skillId of installedSkills) {
            const skill = SKILL_REGISTRY[skillId];
            if (skill) {
                printSkillInfo(skill, true);
            }
        }
        return;
    }

    // Group by domain
    const byDomain: Record<string, SkillInfo[]> = {};
    for (const skill of filtered) {
        if (!byDomain[skill.domain]) {
            byDomain[skill.domain] = [];
        }
        byDomain[skill.domain].push(skill);
    }

    for (const [domain, domainSkills] of Object.entries(byDomain)) {
        console.log(`${domain.toUpperCase()}`);
        console.log('─'.repeat(40));
        for (const skill of domainSkills) {
            const installed = installedSkills.includes(skill.id);
            printSkillInfo(skill, installed);
        }
        console.log('');
    }

    console.log(`Total: ${filtered.length} skills (${installedSkills.length} installed)\n`);
}

function printSkillInfo(skill: SkillInfo, installed: boolean): void {
    const status = installed ? '✓' : ' ';
    console.log(`  [${status}] ${skill.id} (v${skill.version})`);
    console.log(`      ${skill.description}`);
    console.log(`      Tools: ${skill.tools.join(', ')}`);
}

function getInstalledSkills(): string[] {
    const cwd = process.cwd();
    const skillsDir = path.join(cwd, 'src', 'skills');

    if (!fs.existsSync(skillsDir)) {
        return [];
    }

    return fs.readdirSync(skillsDir)
        .filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());
}

// =====================================================
// Skill Remove
// =====================================================

export async function skillRemove(skillId: string, options: SkillRemoveOptions): Promise<void> {
    console.log(`\n🗑️  Removing skill: ${skillId}`);

    const cwd = process.cwd();
    const skillDir = path.join(cwd, 'src', 'skills', skillId);

    if (!fs.existsSync(skillDir)) {
        console.error(`❌ Skill not installed: ${skillId}`);
        process.exit(1);
    }

    if (!options.force) {
        console.log('\n⚠️  This will remove the skill and all its files.');
        console.log('   Use --force to confirm removal.');
        process.exit(1);
    }

    try {
        // Remove skill directory
        fs.rmSync(skillDir, { recursive: true, force: true });

        // Update config
        const configPath = path.join(cwd, 'niagahub.config.js');
        if (fs.existsSync(configPath)) {
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(new RegExp(`\\s*'${skillId}',?`, 'g'), '');
            fs.writeFileSync(configPath, configContent);
        }

        console.log(`✅ Skill '${skillId}' removed successfully!`);

    } catch (error) {
        console.error('❌ Failed to remove skill:', error);
        process.exit(1);
    }
}

// =====================================================
// Helpers
// =====================================================

function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export default { skillAdd, skillList, skillRemove };
