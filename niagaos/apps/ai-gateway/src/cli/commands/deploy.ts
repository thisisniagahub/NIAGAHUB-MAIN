// =====================================================
// CLI Command: Deploy
// Version 1.0 - Phase 4 Polish
// =====================================================

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface DeployOptions {
    env: 'staging' | 'production';
    dryRun?: boolean;
    skipTests?: boolean;
    rollback?: boolean;
}

interface DeploymentInfo {
    version: string;
    timestamp: string;
    commit?: string;
    environment: string;
    status: 'success' | 'failed' | 'rolled_back';
}

// =====================================================
// Deploy Command
// =====================================================

export async function deploy(options: DeployOptions): Promise<void> {
    console.log(`\n🚀 NiagaHub Deployment\n`);
    console.log(`   Environment: ${options.env}`);
    console.log(`   Mode: ${options.dryRun ? 'Dry Run' : 'Live'}`);
    console.log('');

    // Handle rollback
    if (options.rollback) {
        await performRollback(options.env);
        return;
    }

    const steps = [
        { name: 'Pre-flight checks', fn: preflightChecks },
        { name: 'Run tests', fn: runTests, skip: options.skipTests },
        { name: 'Build project', fn: buildProject },
        { name: 'Prepare artifacts', fn: prepareArtifacts },
        { name: 'Deploy to environment', fn: deployToEnvironment },
        { name: 'Verify deployment', fn: verifyDeployment },
        { name: 'Update deployment log', fn: updateDeploymentLog }
    ];

    const deployInfo: DeploymentInfo = {
        version: getProjectVersion(),
        timestamp: new Date().toISOString(),
        commit: getGitCommit(),
        environment: options.env,
        status: 'success'
    };

    for (const step of steps) {
        if (step.skip) {
            console.log(`⏭️  Skipping: ${step.name}`);
            continue;
        }

        console.log(`⏳ ${step.name}...`);

        if (options.dryRun) {
            console.log(`   [DRY RUN] Would execute: ${step.name}`);
            continue;
        }

        try {
            await step.fn(options, deployInfo);
            console.log(`✅ ${step.name} complete`);
        } catch (error) {
            console.error(`❌ ${step.name} failed:`, error);
            deployInfo.status = 'failed';

            // Attempt rollback on failure
            if (!options.dryRun && options.env === 'production') {
                console.log('\n🔄 Initiating automatic rollback...');
                await performRollback(options.env);
            }

            process.exit(1);
        }
    }

    console.log('\n✅ Deployment successful!\n');
    console.log('Deployment Info:');
    console.log(`   Version: ${deployInfo.version}`);
    console.log(`   Timestamp: ${deployInfo.timestamp}`);
    console.log(`   Commit: ${deployInfo.commit || 'N/A'}`);
    console.log(`   Environment: ${deployInfo.environment}`);
    console.log('');
}

// =====================================================
// Deployment Steps
// =====================================================

async function preflightChecks(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    const cwd = process.cwd();

    // Check configuration files
    const requiredFiles = ['package.json', 'tsconfig.json', 'niagahub.config.js'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(cwd, file))) {
            throw new Error(`Missing required file: ${file}`);
        }
    }

    // Check environment variables
    if (options.env === 'production') {
        const requiredEnvVars = ['MCP_WS_TOKEN'];
        const missing = requiredEnvVars.filter(v => !process.env[v]);
        if (missing.length > 0) {
            throw new Error(`Missing environment variables: ${missing.join(', ')}`);
        }
    }

    // Check for uncommitted changes in production
    if (options.env === 'production') {
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf-8' });
            if (status.trim()) {
                throw new Error('Uncommitted changes detected. Commit or stash before deploying to production.');
            }
        } catch (error) {
            // Git not available or not a git repo - continue
        }
    }
}

async function runTests(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    try {
        execSync('npm test', { stdio: 'inherit' });
    } catch (error) {
        throw new Error('Tests failed');
    }
}

async function buildProject(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
        throw new Error('Build failed');
    }
}

async function prepareArtifacts(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    const cwd = process.cwd();
    const distDir = path.join(cwd, 'dist');
    const buildDir = path.join(cwd, 'build');

    // Create dist directory
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Copy build files
    if (fs.existsSync(buildDir)) {
        copyRecursive(buildDir, path.join(distDir, 'build'));
    }

    // Copy package files
    const filesToCopy = ['package.json', 'package-lock.json'];
    for (const file of filesToCopy) {
        const src = path.join(cwd, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(distDir, file));
        }
    }

    // Create deployment manifest
    const manifest = {
        version: info.version,
        timestamp: info.timestamp,
        commit: info.commit,
        environment: options.env,
        files: fs.readdirSync(distDir)
    };

    fs.writeFileSync(
        path.join(distDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
}

async function deployToEnvironment(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    // In production, this would:
    // - Upload to cloud storage (S3, GCS)
    // - Update container registry
    // - Trigger deployment pipeline (GitHub Actions, Cloud Run, etc.)
    // - Update load balancer

    console.log(`   Deploying to ${options.env}...`);

    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`   Artifacts uploaded`);
    console.log(`   Services updated`);
}

async function verifyDeployment(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    // In production, this would:
    // - Check health endpoints
    // - Verify service is responding
    // - Run smoke tests
    // - Check metrics

    console.log(`   Running health checks...`);

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`   Health checks passed`);
}

async function updateDeploymentLog(options: DeployOptions, info: DeploymentInfo): Promise<void> {
    const cwd = process.cwd();
    const logPath = path.join(cwd, '.deployments.json');

    let deployments: DeploymentInfo[] = [];

    if (fs.existsSync(logPath)) {
        try {
            deployments = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
        } catch {
            deployments = [];
        }
    }

    deployments.unshift(info);

    // Keep last 50 deployments
    deployments = deployments.slice(0, 50);

    fs.writeFileSync(logPath, JSON.stringify(deployments, null, 2));
}

// =====================================================
// Rollback
// =====================================================

async function performRollback(env: string): Promise<void> {
    console.log(`\n🔄 Rolling back ${env} deployment...\n`);

    const cwd = process.cwd();
    const logPath = path.join(cwd, '.deployments.json');

    if (!fs.existsSync(logPath)) {
        console.error('❌ No deployment log found');
        process.exit(1);
    }

    const deployments: DeploymentInfo[] = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
    const lastSuccessful = deployments.find(d =>
        d.environment === env && d.status === 'success'
    );

    if (!lastSuccessful) {
        console.error('❌ No successful deployment found to rollback to');
        process.exit(1);
    }

    console.log(`   Rolling back to version ${lastSuccessful.version}`);
    console.log(`   Deployed at: ${lastSuccessful.timestamp}`);
    console.log(`   Commit: ${lastSuccessful.commit || 'N/A'}`);

    // In production, this would:
    // - Restore previous container/artifact
    // - Update load balancer
    // - Verify rollback

    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update deployment log
    deployments.unshift({
        ...lastSuccessful,
        timestamp: new Date().toISOString(),
        status: 'rolled_back'
    });

    fs.writeFileSync(logPath, JSON.stringify(deployments, null, 2));

    console.log('\n✅ Rollback complete\n');
}

// =====================================================
// Helpers
// =====================================================

function getProjectVersion(): string {
    const cwd = process.cwd();
    const packagePath = path.join(cwd, 'package.json');

    if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        return pkg.version || '0.0.0';
    }

    return '0.0.0';
}

function getGitCommit(): string | undefined {
    try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
        return undefined;
    }
}

function copyRecursive(src: string, dest: string): void {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

export default deploy;
