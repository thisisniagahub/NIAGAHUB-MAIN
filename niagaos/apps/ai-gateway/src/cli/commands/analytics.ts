// =====================================================
// CLI Command: Analytics
// Version 1.0 - Phase 4 Polish
// =====================================================

import * as fs from 'fs';
import * as path from 'path';

interface AnalyticsOptions {
    period: 'hour' | 'day' | 'week' | 'month';
    export?: 'csv' | 'json';
    output?: string;
}

interface AnalyticsSummary {
    period: string;
    totalCalls: number;
    uniqueUsers: number;
    uniqueTools: number;
    successRate: number;
    avgLatencyMs: number;
    cacheHitRate: number;
    topTools: { name: string; calls: number }[];
    errorRate: number;
}

// =====================================================
// Analytics Command
// =====================================================

export async function analytics(options: AnalyticsOptions): Promise<void> {
    console.log(`\n📊 NiagaHub Analytics\n`);
    console.log(`   Period: Last ${options.period}`);
    console.log('');

    // Get analytics data (mock for now)
    const data = await getAnalyticsData(options.period);

    if (options.export) {
        await exportAnalytics(data, options.export, options.output);
        return;
    }

    // Display analytics
    displayAnalytics(data);
}

// =====================================================
// Data Retrieval
// =====================================================

async function getAnalyticsData(period: string): Promise<AnalyticsSummary> {
    // In production, fetch from database or analytics service

    // Generate mock data based on period
    const multiplier = {
        hour: 1,
        day: 24,
        week: 168,
        month: 720
    }[period] || 1;

    return {
        period,
        totalCalls: Math.round(125 * multiplier),
        uniqueUsers: Math.round(15 + multiplier / 10),
        uniqueTools: 12,
        successRate: 0.94,
        avgLatencyMs: 1250,
        cacheHitRate: 0.35,
        topTools: [
            { name: 'query_notebook', calls: Math.round(50 * multiplier) },
            { name: 'generate_summary', calls: Math.round(20 * multiplier) },
            { name: 'add_source_url', calls: Math.round(15 * multiplier) },
            { name: 'list_notebooks', calls: Math.round(12 * multiplier) },
            { name: 'generate_audio_overview', calls: Math.round(8 * multiplier) }
        ],
        errorRate: 0.06
    };
}

// =====================================================
// Display
// =====================================================

function displayAnalytics(data: AnalyticsSummary): void {
    // Summary box
    console.log('┌────────────────────────────────────────┐');
    console.log('│            📈 Summary                  │');
    console.log('├────────────────────────────────────────┤');
    console.log(`│ Total Calls:     ${padRight(data.totalCalls.toLocaleString(), 20)}│`);
    console.log(`│ Unique Users:    ${padRight(data.uniqueUsers.toString(), 20)}│`);
    console.log(`│ Unique Tools:    ${padRight(data.uniqueTools.toString(), 20)}│`);
    console.log(`│ Success Rate:    ${padRight((data.successRate * 100).toFixed(1) + '%', 20)}│`);
    console.log(`│ Avg Latency:     ${padRight(data.avgLatencyMs + 'ms', 20)}│`);
    console.log(`│ Cache Hit Rate:  ${padRight((data.cacheHitRate * 100).toFixed(1) + '%', 20)}│`);
    console.log('└────────────────────────────────────────┘');
    console.log('');

    // Top tools
    console.log('🔧 Top Tools');
    console.log('─'.repeat(40));

    const maxCalls = Math.max(...data.topTools.map(t => t.calls));

    for (const tool of data.topTools) {
        const barLength = Math.round((tool.calls / maxCalls) * 20);
        const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
        console.log(`   ${padRight(tool.name, 25)} ${bar} ${tool.calls}`);
    }
    console.log('');

    // Success vs Error chart
    console.log('📊 Success Rate');
    console.log('─'.repeat(40));

    const successWidth = Math.round(data.successRate * 30);
    const errorWidth = 30 - successWidth;

    console.log(`   Success: ${'🟢'.repeat(successWidth)} ${(data.successRate * 100).toFixed(1)}%`);
    console.log(`   Error:   ${'🔴'.repeat(errorWidth)} ${(data.errorRate * 100).toFixed(1)}%`);
    console.log('');

    // Time hint
    console.log(`💡 Use --export json to export detailed analytics`);
    console.log('');
}

// =====================================================
// Export
// =====================================================

async function exportAnalytics(
    data: AnalyticsSummary,
    format: 'csv' | 'json',
    outputPath?: string
): Promise<void> {
    let content: string;
    let fileName: string;

    if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        fileName = `analytics-${data.period}-${Date.now()}.json`;
    } else {
        content = convertToCsv(data);
        fileName = `analytics-${data.period}-${Date.now()}.csv`;
    }

    const filePath = outputPath || path.join(process.cwd(), fileName);

    fs.writeFileSync(filePath, content);
    console.log(`✅ Analytics exported to: ${filePath}`);
}

function convertToCsv(data: AnalyticsSummary): string {
    const lines: string[] = [
        'Metric,Value',
        `Period,${data.period}`,
        `Total Calls,${data.totalCalls}`,
        `Unique Users,${data.uniqueUsers}`,
        `Unique Tools,${data.uniqueTools}`,
        `Success Rate,${(data.successRate * 100).toFixed(1)}%`,
        `Average Latency,${data.avgLatencyMs}ms`,
        `Cache Hit Rate,${(data.cacheHitRate * 100).toFixed(1)}%`,
        `Error Rate,${(data.errorRate * 100).toFixed(1)}%`,
        '',
        'Top Tools',
        'Tool,Calls'
    ];

    for (const tool of data.topTools) {
        lines.push(`${tool.name},${tool.calls}`);
    }

    return lines.join('\n');
}

// =====================================================
// Helpers
// =====================================================

function padRight(str: string, length: number): string {
    return str + ' '.repeat(Math.max(0, length - str.length));
}

export default analytics;
