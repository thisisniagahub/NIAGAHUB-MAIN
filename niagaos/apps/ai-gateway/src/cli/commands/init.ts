// =====================================================
// CLI Command: Init
// Version 1.0 - Phase 4 Polish
// =====================================================

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface InitOptions {
    template: 'default' | 'minimal' | 'full';
    name?: string;
    skipInstall?: boolean;
    force?: boolean;
}

const TEMPLATES = {
    minimal: {
        description: 'Basic MCP server setup',
        files: ['package.json', 'tsconfig.json', 'src/index.ts', '.env.example']
    },
    default: {
        description: 'Standard setup with common tools',
        files: ['package.json', 'tsconfig.json', 'src/index.ts', 'src/config.ts', 'src/tools/index.ts', '.env.example', 'README.md']
    },
    full: {
        description: 'Full setup with all features',
        files: ['package.json', 'tsconfig.json', 'src/index.ts', 'src/config.ts', 'src/tools/index.ts', 'src/agents/index.ts', 'src/middleware/index.ts', '.env.example', 'README.md', 'tests/setup.ts']
    }
};

export async function init(options: InitOptions): Promise<void> {
    const cwd = process.cwd();
    const projectName = options.name || path.basename(cwd);

    console.log(`\n🚀 Initializing NiagaHub project: ${projectName}`);
    console.log(`   Template: ${options.template}`);
    console.log(`   Directory: ${cwd}\n`);

    // Check for existing configuration
    const configPath = path.join(cwd, 'niagahub.config.js');
    if (fs.existsSync(configPath) && !options.force) {
        console.error('❌ Project already initialized. Use --force to overwrite.');
        process.exit(1);
    }

    try {
        // Create directory structure
        console.log('📁 Creating directory structure...');
        createDirectories(cwd, options.template);

        // Generate configuration files
        console.log('📝 Generating configuration files...');
        generateConfigs(cwd, projectName, options.template);

        // Generate source files
        console.log('💻 Generating source files...');
        generateSourceFiles(cwd, projectName, options.template);

        // Install dependencies
        if (!options.skipInstall) {
            console.log('📦 Installing dependencies...');
            installDependencies(cwd);
        }

        console.log('\n✅ Project initialized successfully!\n');
        console.log('Next steps:');
        console.log(`  1. cd ${projectName}`);
        console.log('  2. Copy .env.example to .env and configure');
        console.log('  3. npm run dev\n');

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
}

function createDirectories(cwd: string, template: string): void {
    const dirs = ['src', 'src/tools', 'build'];

    if (template === 'default' || template === 'full') {
        dirs.push('src/middleware', 'src/core');
    }

    if (template === 'full') {
        dirs.push('src/agents', 'tests', 'docs');
    }

    for (const dir of dirs) {
        const dirPath = path.join(cwd, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
}

function generateConfigs(cwd: string, projectName: string, template: string): void {
    // package.json
    const packageJson = {
        name: projectName,
        version: '1.0.0',
        description: 'NiagaHub MCP Server',
        main: 'build/index.js',
        scripts: {
            build: 'npx tsc',
            start: 'node build/index.js',
            dev: 'npx tsc && node build/index.js',
            test: 'npx tsc && node build/tests/index.js'
        },
        dependencies: {
            '@modelcontextprotocol/sdk': '^1.0.1',
            'dotenv': '^17.0.0',
            'zod': '^3.23.0'
        },
        devDependencies: {
            '@types/node': '^22.0.0',
            'typescript': '^5.6.0'
        }
    };

    fs.writeFileSync(
        path.join(cwd, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // tsconfig.json
    const tsconfig = {
        compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            outDir: './build',
            rootDir: './',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            declaration: true
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'build']
    };

    fs.writeFileSync(
        path.join(cwd, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 2)
    );

    // .env.example
    const envExample = `# NiagaHub MCP Server Configuration
WS_PORT=3000
WS_HOST=127.0.0.1
MCP_WS_TOKEN=your-secure-token-here

# Optional: Redis for caching
# REDIS_URL=redis://localhost:6379

# Optional: Supabase for persistence
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
`;

    fs.writeFileSync(path.join(cwd, '.env.example'), envExample);

    // niagahub.config.js
    const config = `// NiagaHub Project Configuration
module.exports = {
  name: '${projectName}',
  version: '1.0.0',
  template: '${template}',
  features: {
    rateLimit: true,
    caching: true,
    streaming: true,
    multiTenant: false
  },
  tools: [
    // Add your custom tools here
  ]
};
`;

    fs.writeFileSync(path.join(cwd, 'niagahub.config.js'), config);
}

function generateSourceFiles(cwd: string, projectName: string, template: string): void {
    // src/index.ts - Main entry point
    const indexTs = `// ${projectName} - MCP Server
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import 'dotenv/config';

// Tool definitions
const TOOLS = [
    {
        name: 'hello_world',
        description: 'A simple hello world tool',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name to greet' }
            },
            required: ['name']
        }
    }
];

// Create server
const server = new Server(
    { name: '${projectName}', version: '1.0.0' },
    { capabilities: { tools: {} } }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'hello_world':
            return {
                content: [{
                    type: 'text',
                    text: \`Hello, \${(args as any).name}!\`
                }]
            };
        default:
            throw new Error(\`Unknown tool: \${name}\`);
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[MCP] Server running');
}

main().catch(console.error);
`;

    fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), indexTs);

    // README.md
    const readme = `# ${projectName}

A NiagaHub MCP Server project.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy environment configuration:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Build and run:
   \`\`\`bash
   npm run dev
   \`\`\`

## Available Tools

- \`hello_world\` - A simple hello world tool

## Adding New Tools

Edit \`src/index.ts\` to add new tool definitions and handlers.

## License

MIT
`;

    fs.writeFileSync(path.join(cwd, 'README.md'), readme);
}

function installDependencies(cwd: string): void {
    try {
        execSync('npm install', { cwd, stdio: 'inherit' });
    } catch (error) {
        console.warn('⚠️  npm install failed, please run manually');
    }
}

export default init;
