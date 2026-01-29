// =====================================================
// NotebookLLM Antigravity Bridge - Background Script
// Version 4.0 - Secure Storage & Advanced Features
// =====================================================

// Import SecureStorage (loaded via manifest)
// Note: In Manifest V3, we use importScripts or dynamic import

const ConnectionState = {
    DISCONNECTED: 'DISCONNECTED',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    RECONNECTING: 'RECONNECTING',
    ERROR: 'ERROR'
};

let ws = null;
let connectionState = ConnectionState.DISCONNECTED;
let reconnectTimer = null;
let pingInterval = null;
let reconnectAttempts = 0;
let currentSettings = null;
let discoveredPort = null;

// Default configuration (will be overridden by SecureStorage)
const DEFAULT_CONFIG = {
    serverUrl: 'ws://127.0.0.1:3000',
    portRange: [3000, 3001, 3002, 3003, 3004, 3005], // Ports to scan
    heartbeatInterval: 5000,
    maxReconnectAttempts: 10,
    enableNotifications: true,
    debugMode: false,
    autoReconnect: true,
    autoPortDiscovery: true, // Enable multi-port scanning
    connectionTimeout: 30000,
    initialReconnectDelay: 1000,
    maxReconnectDelay: 30000,
    backoffMultiplier: 2,
    maxQueueSize: 100
};

const messageQueue = [];

// Metrics tracking
const metrics = {
    connectedAt: null,
    messagesSent: 0,
    messagesReceived: 0,
    reconnectCount: 0,
    errors: 0,
    lastError: null
};

/**
 * Scan ports to find running MCP server
 * @returns {Promise<number|null>} The port number if found, null otherwise
 */
async function discoverServerPort() {
    const ports = currentSettings?.portRange || DEFAULT_CONFIG.portRange;
    const token = await chrome.storage.local.get('mcp_ws_token');

    if (!token.mcp_ws_token) {
        console.warn('[Discovery] No token, skipping port scan');
        return null;
    }

    log(`[Discovery] Scanning ports: ${ports.join(', ')}`);

    for (const port of ports) {
        try {
            const result = await testPort(port, token.mcp_ws_token);
            if (result) {
                log(`[Discovery] ✓ Found server on port ${port}`);
                discoveredPort = port;
                return port;
            }
        } catch (e) {
            // Port not available, continue
        }
    }

    log('[Discovery] No server found on any port');
    return null;
}

/**
 * Test if a port has the MCP server running
 */
function testPort(port, token) {
    return new Promise((resolve) => {
        const testWs = new WebSocket(`ws://127.0.0.1:${port}?token=${token}`);
        const timeout = setTimeout(() => {
            testWs.close();
            resolve(false);
        }, 2000);

        testWs.onopen = () => {
            clearTimeout(timeout);
            testWs.close();
            resolve(true);
        };

        testWs.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };
    });
}

// =====================================================
// SecureStorage Integration
// =====================================================

/**
 * Initialize settings from SecureStorage
 */
async function initializeSettings() {
    try {
        const result = await chrome.storage.local.get(['mcp_settings', 'mcp_ws_token']);
        currentSettings = { ...DEFAULT_CONFIG, ...(result.mcp_settings || {}) };

        // Check if token exists
        if (!result.mcp_ws_token) {
            console.warn('[Background] No token configured. Please set token in extension settings.');
            updateBadge(ConnectionState.ERROR);
            return false;
        }

        log('Settings loaded successfully');
        return true;
    } catch (error) {
        console.error('[Background] Failed to load settings:', error);
        currentSettings = DEFAULT_CONFIG;
        return false;
    }
}

/**
 * Get WebSocket URL with token
 * Uses discovered port if auto-discovery is enabled
 */
async function getWebSocketUrl() {
    const result = await chrome.storage.local.get(['mcp_ws_token', 'mcp_settings']);
    const token = result.mcp_ws_token;
    const settings = result.mcp_settings || {};

    if (!token) {
        throw new Error('No authentication token configured');
    }

    // Use discovered port if available, otherwise use settings
    let serverUrl = settings.serverUrl || DEFAULT_CONFIG.serverUrl;

    // Auto-discover port if enabled and no discovered port yet
    if ((settings.autoPortDiscovery !== false) && !discoveredPort) {
        const port = await discoverServerPort();
        if (port) {
            serverUrl = `ws://127.0.0.1:${port}`;
        }
    } else if (discoveredPort) {
        serverUrl = `ws://127.0.0.1:${discoveredPort}`;
    }

    // Append token as query parameter
    const url = new URL(serverUrl);
    url.searchParams.set('token', token);
    return url.toString();
}

/**
 * Save a setting
 */
async function saveSetting(key, value) {
    try {
        const result = await chrome.storage.local.get('mcp_settings');
        const settings = result.mcp_settings || {};
        settings[key] = value;
        await chrome.storage.local.set({ mcp_settings: settings });
        currentSettings = { ...currentSettings, [key]: value };
        log(`Setting saved: ${key}`);
    } catch (error) {
        console.error('[Background] Failed to save setting:', error);
    }
}

/**
 * Update metrics in storage
 */
async function updateStoredMetrics() {
    try {
        await chrome.storage.local.set({
            mcp_metrics: {
                ...metrics,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        // Silent fail - metrics are not critical
    }
}

// =====================================================
// Logging
// =====================================================

function log(message, ...args) {
    if (currentSettings?.debugMode) {
        console.log(`[Background] ${message}`, ...args);
    }
}

function logError(message, error) {
    console.error(`[Background] ${message}`, error);
    metrics.errors++;
    metrics.lastError = { message, error: error?.message, time: new Date().toISOString() };
}

// =====================================================
// Utility: Tab Targeting
// =====================================================

async function findTargetTab(notebookId) {
    // 1. Try to find exact notebook match if ID provided
    if (notebookId) {
        const specificTabs = await chrome.tabs.query({
            url: `*://notebooklm.google.com/notebook/${notebookId}*`
        });
        if (specificTabs.length > 0) {
            const activeSpecific = specificTabs.find(t => t.active);
            return activeSpecific || specificTabs[0];
        }
    }

    // 2. Try to find ANY active NotebookLLM tab
    const activeTabs = await chrome.tabs.query({
        active: true,
        url: "*://notebooklm.google.com/*"
    });
    if (activeTabs.length > 0) return activeTabs[0];

    // 3. Fallback: Any NotebookLLM tab (most recently used/last in list)
    const allTabs = await chrome.tabs.query({
        url: "*://notebooklm.google.com/*"
    });
    if (allTabs.length > 0) {
        return allTabs[allTabs.length - 1];
    }

    return null;
}

/**
 * Wake up a tab if it's been discarded
 */
async function ensureTabAwake(tab) {
    if (tab.discarded) {
        log(`Waking up discarded tab ${tab.id}`);
        await chrome.tabs.reload(tab.id);
        // Wait a bit for the page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return tab;
}

// =====================================================
// Badge & UI
// =====================================================

function updateBadge(state) {
    const badges = {
        [ConnectionState.CONNECTED]: { text: '✓', color: '#22c55e', title: 'Connected' },
        [ConnectionState.CONNECTING]: { text: '...', color: '#eab308', title: 'Connecting...' },
        [ConnectionState.RECONNECTING]: { text: '↻', color: '#f97316', title: 'Reconnecting...' },
        [ConnectionState.DISCONNECTED]: { text: '✗', color: '#ef4444', title: 'Disconnected' },
        [ConnectionState.ERROR]: { text: '!', color: '#dc2626', title: 'Error - Check Settings' }
    };
    const b = badges[state] || badges[ConnectionState.DISCONNECTED];

    chrome.action.setBadgeText({ text: b.text });
    chrome.action.setBadgeBackgroundColor({ color: b.color });
    chrome.action.setTitle({ title: `Antigravity Bridge: ${b.title}` });
}

/**
 * Show notification if enabled
 */
async function showNotification(title, message, type = 'basic') {
    if (!currentSettings?.enableNotifications) return;

    // Check if notifications API is available (may not be in all contexts)
    if (typeof chrome === 'undefined' || !chrome.notifications?.create) {
        console.log('[Notifications] API not available');
        return;
    }

    try {
        await chrome.notifications.create({
            type,
            iconUrl: 'icons/icon128.png',
            title,
            message,
            priority: 1
        });
    } catch (error) {
        // Notifications may not be available in service worker context
        console.log('[Notifications] Failed:', error.message);
    }
}

// =====================================================
// WebSocket Logic
// =====================================================

async function connect() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return;
    }

    // Initialize settings if not done
    if (!currentSettings) {
        const initialized = await initializeSettings();
        if (!initialized) {
            showNotification('Connection Error', 'Please configure your token in extension settings');
            return;
        }
    }

    connectionState = reconnectAttempts > 0 ? ConnectionState.RECONNECTING : ConnectionState.CONNECTING;
    updateBadge(connectionState);
    log(`Connecting... (Attempt ${reconnectAttempts + 1})`);

    try {
        const wsUrl = await getWebSocketUrl();
        ws = new WebSocket(wsUrl);

        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
            if (ws && ws.readyState === WebSocket.CONNECTING) {
                log('Connection timeout');
                ws.close();
            }
        }, currentSettings.connectionTimeout);

        ws.onopen = () => {
            clearTimeout(connectionTimeout);
            log('✓ Connected');
            connectionState = ConnectionState.CONNECTED;
            updateBadge(connectionState);
            reconnectAttempts = 0;

            metrics.connectedAt = new Date();
            metrics.reconnectCount++;
            updateStoredMetrics();

            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
            if (pingInterval) clearInterval(pingInterval);

            // Start heartbeat
            pingInterval = setInterval(() => {
                if (ws?.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
                }
            }, currentSettings.heartbeatInterval);

            flushQueue();

            // Notify on reconnection
            if (metrics.reconnectCount > 1) {
                showNotification('Reconnected', 'Connection to MCP server restored');
            }
        };

        ws.onmessage = async (event) => {
            metrics.messagesReceived++;

            try {
                const message = JSON.parse(event.data);

                // Handle PONG response
                if (message.type === 'PONG') {
                    log('Heartbeat PONG received');
                    return;
                }

                log('▶ Received:', message.command);

                // Find and wake target tab
                let targetTab = await findTargetTab(message.notebookId);

                if (!targetTab) {
                    console.warn('[Background] ✗ No NotebookLLM tab found');
                    sendResponse(message.id, null, 'No NotebookLLM tab found. Please open notebooklm.google.com');
                    return;
                }

                // Ensure tab is awake
                targetTab = await ensureTabAwake(targetTab);

                log(`→ Forwarding to Tab ${targetTab.id} (${targetTab.title})`);

                try {
                    const response = await chrome.tabs.sendMessage(targetTab.id, message);
                    sendResponse(message.id, response);
                } catch (err) {
                    logError('Tab Error:', err);
                    sendResponse(message.id, null, `Tab Error: ${err.message}. Try reloading the NotebookLLM page.`);
                }

            } catch (e) {
                logError('Message processing failed:', e);
            }
        };

        ws.onclose = (event) => {
            clearTimeout(connectionTimeout);
            connectionState = ConnectionState.DISCONNECTED;
            updateBadge(connectionState);
            ws = null;
            metrics.connectedAt = null;

            if (pingInterval) clearInterval(pingInterval);

            // Close codes: 1000=normal, 1001=going away - these are intentional closures
            const normalCloseCodes = [1000, 1001];
            const wasNormalClose = normalCloseCodes.includes(event.code);

            // Only reconnect if:
            // - auto-reconnect enabled
            // - not a normal/intentional close
            // - not max attempts reached
            if (currentSettings?.autoReconnect &&
                !wasNormalClose &&
                reconnectAttempts < currentSettings.maxReconnectAttempts) {

                const delay = Math.min(
                    currentSettings.initialReconnectDelay *
                    Math.pow(currentSettings.backoffMultiplier, reconnectAttempts),
                    currentSettings.maxReconnectDelay
                );

                reconnectAttempts++;
                log(`Disconnected (code: ${event.code}). Reconnecting in ${delay}ms...`);
                reconnectTimer = setTimeout(connect, delay);
            } else if (wasNormalClose) {
                log(`Connection closed normally (code: ${event.code}). No auto-reconnect.`);
            } else if (reconnectAttempts >= currentSettings?.maxReconnectAttempts) {
                logError('Max reconnect attempts reached', null);
                showNotification('Connection Failed', 'Max reconnection attempts reached. Click to retry.');
            }

            updateStoredMetrics();
        };

        ws.onerror = (e) => {
            clearTimeout(connectionTimeout);
            logError('WS Error:', e);
            ws?.close();
        };

    } catch (error) {
        logError('Connection failed:', error);
        connectionState = ConnectionState.ERROR;
        updateBadge(connectionState);
    }
}

function disconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
    }
    if (ws) {
        ws.close();
        ws = null;
    }
    connectionState = ConnectionState.DISCONNECTED;
    updateBadge(connectionState);
    log('Manually disconnected');
}

function sendResponse(id, result, error = null) {
    if (!id) return;
    const payload = error ? { id, error } : { id, result };

    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        metrics.messagesSent++;
    } else {
        queueMessage(payload);
    }
}

function queueMessage(msg) {
    const maxSize = currentSettings?.maxQueueSize || DEFAULT_CONFIG.maxQueueSize;
    if (messageQueue.length >= maxSize) messageQueue.shift();
    messageQueue.push(msg);
    log(`Message queued (queue size: ${messageQueue.length})`);
}

function flushQueue() {
    let flushed = 0;
    while (messageQueue.length > 0 && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(messageQueue.shift()));
        metrics.messagesSent++;
        flushed++;
    }
    if (flushed > 0) {
        log(`Flushed ${flushed} queued messages`);
    }
}

// =====================================================
// Message Handlers
// =====================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender).then(sendResponse);
    return true; // Keep channel open for async response
});

async function handleMessage(request, sender) {
    switch (request.type) {
        case 'GET_STATUS':
            return {
                connectionState,
                wsReadyState: ws?.readyState,
                settings: currentSettings,
                metrics: {
                    ...metrics,
                    queueSize: messageQueue.length,
                    reconnectAttempts
                }
            };

        case 'CONNECT':
            reconnectAttempts = 0;
            await connect();
            return { success: true };

        case 'DISCONNECT':
            disconnect();
            return { success: true };

        case 'SET_TOKEN':
            if (!request.token) return { success: false, error: 'Token required' };
            await chrome.storage.local.set({ mcp_ws_token: request.token });
            log('Token updated');
            // Reconnect with new token
            disconnect();
            await connect();
            return { success: true };

        case 'UPDATE_SETTINGS':
            if (request.settings) {
                const current = await chrome.storage.local.get('mcp_settings');
                const updated = { ...(current.mcp_settings || {}), ...request.settings };
                await chrome.storage.local.set({ mcp_settings: updated });
                currentSettings = { ...currentSettings, ...request.settings };
                log('Settings updated');
            }
            return { success: true, settings: currentSettings };

        case 'CLEAR_METRICS':
            Object.assign(metrics, {
                messagesSent: 0,
                messagesReceived: 0,
                errors: 0,
                lastError: null
            });
            await updateStoredMetrics();
            return { success: true };

        case 'GET_LOGS':
            // Return recent activity for debugging
            return {
                connectionState,
                reconnectAttempts,
                metrics,
                lastError: metrics.lastError
            };

        default:
            return { error: 'Unknown message type' };
    }
}

// =====================================================
// Storage Change Listener
// =====================================================

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;

    // React to settings changes
    if (changes.mcp_settings) {
        currentSettings = { ...DEFAULT_CONFIG, ...(changes.mcp_settings.newValue || {}) };
        log('Settings updated from storage');
    }

    // React to token changes
    if (changes.mcp_ws_token) {
        log('Token changed, reconnecting...');
        disconnect();
        connect();
    }
});

// =====================================================
// Startup
// =====================================================

async function initialize() {
    log('Initializing Antigravity Bridge v4.0');
    await initializeSettings();
    await connect();
}

// Start
initialize();

// Also connect on browser startup
chrome.runtime.onStartup.addListener(initialize);

// Handle extension install/update
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        log('Extension installed');
        // Open settings page for initial configuration
        chrome.runtime.openOptionsPage?.();
    } else if (details.reason === 'update') {
        log(`Extension updated from ${details.previousVersion}`);
    }
    await initialize();
});

// Keep service worker alive with periodic alarm
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        log('Keep-alive ping');
        // Reconnect if disconnected
        if (connectionState === ConnectionState.DISCONNECTED && currentSettings?.autoReconnect) {
            connect();
        }
    }
});
