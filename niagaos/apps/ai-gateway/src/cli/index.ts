#!/usr/bin/env node
// =====================================================
// NiagaHub CLI - Main Entry Point
// Version 1.0 - Phase 4 Polish
// =====================================================

import { Command } from 'commander';
import { init } from './commands/init.js';
import { skillAdd, skillList, skillRemove } from './commands/skill.js';
import { status } from './commands/status.js';
import { deploy } from './commands/deploy.js';
import { analytics } from './commands/analytics.js';

const program = new Command();

program
    .name('niagahub')
    .description('NiagaHub SuperApp CLI - Manage MCP servers, skills, and deployments')
    .version('2.0.0');

// =====================================================
// Init Command
// =====================================================

program
    .command('init')
    .description('Initialize a new NiagaHub project')
    .option('-t, --template <template>', 'Project template (default, minimal, full)', 'default')
    .option('-n, --name <name>', 'Project name')
    .option('--skip-install', 'Skip npm install')
    .option('--force', 'Overwrite existing configuration')
    .action(init);

// =====================================================
// Skill Commands
// =====================================================

const skillCommand = program
    .command('skill')
    .description('Manage skills and plugins');

skillCommand
    .command('add <skillId>')
    .description('Add a skill from the registry')
    .option('-v, --version <version>', 'Specific version to install')
    .option('--dev', 'Install as dev dependency')
    .action(skillAdd);

skillCommand
    .command('list')
    .description('List available and installed skills')
    .option('-d, --domain <domain>', 'Filter by domain (research, content, automation)')
    .option('-i, --installed', 'Show only installed skills')
    .action(skillList);

skillCommand
    .command('remove <skillId>')
    .description('Remove an installed skill')
    .option('-f, --force', 'Force removal without confirmation')
    .action(skillRemove);

// =====================================================
// Status Command
// =====================================================

program
    .command('status')
    .description('Check system and connection status')
    .option('-v, --verbose', 'Show detailed status')
    .option('-j, --json', 'Output as JSON')
    .option('--health-check', 'Run full health check')
    .action(status);

// =====================================================
// Deploy Command
// =====================================================

program
    .command('deploy')
    .description('Deploy MCP server to production')
    .option('-e, --env <environment>', 'Target environment', 'production')
    .option('--dry-run', 'Preview deployment without executing')
    .option('--skip-tests', 'Skip running tests before deploy')
    .option('--rollback', 'Rollback to previous deployment')
    .action(deploy);

// =====================================================
// Analytics Command
// =====================================================

program
    .command('analytics')
    .description('View usage analytics and metrics')
    .option('-p, --period <period>', 'Time period (hour, day, week, month)', 'day')
    .option('--export <format>', 'Export data (csv, json)')
    .option('-o, --output <file>', 'Output file path')
    .action(analytics);

// =====================================================
// Run CLI
// =====================================================

program.parse();
