// =====================================================
// NotebookLLM Antigravity Bridge - Popup Script
// Version 4.0 - Bento Framer UI with Toggle Switches
// =====================================================

// =====================================================
// UI Elements
// =====================================================

const elements = {
    statusBadge: document.getElementById('statusBadge'),
    statusText: document.getElementById('statusText'),
    serverUrl: document.getElementById('serverUrl'),
    sentCount: document.getElementById('sentCount'),
    receivedCount: document.getElementById('receivedCount'),
    queueCount: document.getElementById('queueCount'),
    reconnectCount: document.getElementById('reconnectCount'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    connectBtn: document.getElementById('connectBtn'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    tokenInput: document.getElementById('tokenInput'),
    serverInput: document.getElementById('serverInput'),
    heartbeatInput: document.getElementById('heartbeatInput'),
    maxRetriesInput: document.getElementById('maxRetriesInput'),
    debugModeToggle: document.getElementById('debugModeToggle'),
    autoReconnectToggle: document.getElementById('autoReconnectToggle'),
    autoPortToggle: document.getElementById('autoPortToggle'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    clearDataBtn: document.getElementById('clearDataBtn'),
    warningBox: document.getElementById('warningBox'),
    toast: document.getElementById('toast')
};

// =====================================================
// Status Mapping
// =====================================================

const statusConfig = {
    'CONNECTED': { class: 'connected', text: 'Connected', icon: '✓' },
    'CONNECTING': { class: 'connecting', text: 'Connecting...', icon: '↻' },
    'RECONNECTING': { class: 'connecting', text: 'Reconnecting...', icon: '↻' },
    'DISCONNECTED': { class: 'disconnected', text: 'Disconnected', icon: '✗' },
    'ERROR': { class: 'disconnected', text: 'Error', icon: '!' }
};

// =====================================================
// Toggle Helpers
// =====================================================

function setToggle(toggleElement, value) {
    if (value) {
        toggleElement?.classList.add('active');
    } else {
        toggleElement?.classList.remove('active');
    }
}

function getToggle(toggleElement) {
    return toggleElement?.classList.contains('active') || false;
}

function setupToggleListeners() {
    // Setup click handlers for all toggles
    [elements.debugModeToggle, elements.autoReconnectToggle, elements.autoPortToggle].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        }
    });
}

// =====================================================
// Toast Notifications
// =====================================================

function showToast(message, type = 'success') {
    const icon = type === 'success' ? '✓' : '✗';
    elements.toast.innerHTML = `${icon} ${message}`;
    elements.toast.className = `toast ${type} show`;
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// =====================================================
// Status Update
// =====================================================

async function updateStatus() {
    try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });

        if (!response) {
            updateStatusUI('DISCONNECTED', {});
            return;
        }

        updateStatusUI(response.connectionState, response.metrics);

        // Update server URL display
        if (response.settings?.serverUrl) {
            try {
                const url = new URL(response.settings.serverUrl);
                elements.serverUrl.textContent = `${url.hostname}:${url.port || '3000'}`;
            } catch {
                elements.serverUrl.textContent = response.settings.serverUrl;
            }
        }

    } catch (error) {
        console.error('Failed to get status:', error);
        updateStatusUI('ERROR', {});
    }
}

function updateStatusUI(state, metrics) {
    const config = statusConfig[state] || statusConfig['DISCONNECTED'];

    // Update status badge
    elements.statusBadge.className = `status-badge ${config.class}`;
    elements.statusText.textContent = config.text;

    // Update metrics
    elements.sentCount.textContent = metrics.messagesSent || 0;
    elements.receivedCount.textContent = metrics.messagesReceived || 0;
    elements.queueCount.textContent = metrics.queueSize || 0;
    elements.reconnectCount.textContent = metrics.reconnectCount || 0;

    // Update button states
    const isConnected = state === 'CONNECTED' || state === 'CONNECTING';
    elements.connectBtn.disabled = isConnected;
    elements.disconnectBtn.disabled = state === 'DISCONNECTED';

    // Visual feedback for button states
    elements.connectBtn.style.opacity = isConnected ? '0.5' : '1';
    elements.disconnectBtn.style.opacity = state === 'DISCONNECTED' ? '0.5' : '1';
}

// =====================================================
// Settings Management
// =====================================================

async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['mcp_settings', 'mcp_ws_token']);
        const settings = result.mcp_settings || {};

        // Populate form
        elements.tokenInput.value = result.mcp_ws_token ? '••••••••••••••••' : '';
        elements.serverInput.value = settings.serverUrl || 'ws://127.0.0.1:3000';
        elements.heartbeatInput.value = settings.heartbeatInterval || 5000;
        elements.maxRetriesInput.value = settings.maxReconnectAttempts || 10;

        // Set toggles
        setToggle(elements.debugModeToggle, settings.debugMode || false);
        setToggle(elements.autoReconnectToggle, settings.autoReconnect !== false);
        setToggle(elements.autoPortToggle, settings.autoPortDiscovery !== false);

        // Show warning if no token
        if (!result.mcp_ws_token) {
            elements.warningBox.classList.add('show');
        } else {
            elements.warningBox.classList.remove('show');
        }

    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

async function saveSettings() {
    try {
        const settings = {
            serverUrl: elements.serverInput.value || 'ws://127.0.0.1:3000',
            heartbeatInterval: parseInt(elements.heartbeatInput.value) || 5000,
            maxReconnectAttempts: parseInt(elements.maxRetriesInput.value) || 10,
            debugMode: getToggle(elements.debugModeToggle),
            autoReconnect: getToggle(elements.autoReconnectToggle),
            autoPortDiscovery: getToggle(elements.autoPortToggle)
        };

        // Save settings
        await chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings });

        // Save token if changed (not the masked value)
        const tokenValue = elements.tokenInput.value;
        if (tokenValue && !tokenValue.includes('•')) {
            if (tokenValue.length < 32) {
                showToast('Token must be at least 32 characters', 'error');
                return;
            }
            await chrome.runtime.sendMessage({ type: 'SET_TOKEN', token: tokenValue });
        }

        showToast('Settings saved!');
        elements.warningBox.classList.remove('show');

        // Reload settings
        await loadSettings();
        await updateStatus();

    } catch (error) {
        console.error('Failed to save settings:', error);
        showToast('Failed to save settings', 'error');
    }
}

async function clearAllData() {
    if (!confirm('Clear all data including your token?')) {
        return;
    }

    try {
        await chrome.storage.local.clear();
        await chrome.runtime.sendMessage({ type: 'DISCONNECT' });

        showToast('All data cleared');

        // Reset form
        elements.tokenInput.value = '';
        elements.serverInput.value = 'ws://127.0.0.1:3000';
        elements.heartbeatInput.value = '5000';
        elements.maxRetriesInput.value = '10';
        setToggle(elements.debugModeToggle, false);
        setToggle(elements.autoReconnectToggle, true);
        setToggle(elements.autoPortToggle, true);
        elements.warningBox.classList.add('show');

        await updateStatus();

    } catch (error) {
        console.error('Failed to clear data:', error);
        showToast('Failed to clear data', 'error');
    }
}

// =====================================================
// Event Handlers
// =====================================================

// Settings toggle
elements.settingsBtn?.addEventListener('click', () => {
    elements.settingsPanel.classList.toggle('active');
    loadSettings();
});

// Connect button
elements.connectBtn?.addEventListener('click', async () => {
    try {
        elements.connectBtn.disabled = true;
        elements.connectBtn.innerHTML = '⏳ Connecting...';
        await chrome.runtime.sendMessage({ type: 'CONNECT' });
        showToast('Connecting...');
        setTimeout(() => {
            updateStatus();
            elements.connectBtn.innerHTML = '🔌 Connect';
        }, 1500);
    } catch (error) {
        showToast('Failed to connect', 'error');
        elements.connectBtn.innerHTML = '🔌 Connect';
        elements.connectBtn.disabled = false;
    }
});

// Disconnect button
elements.disconnectBtn?.addEventListener('click', async () => {
    try {
        await chrome.runtime.sendMessage({ type: 'DISCONNECT' });
        showToast('Disconnected');
        updateStatus();
    } catch (error) {
        showToast('Failed to disconnect', 'error');
    }
});

// Save settings
elements.saveSettingsBtn?.addEventListener('click', saveSettings);

// Clear data
elements.clearDataBtn?.addEventListener('click', clearAllData);

// Token input - clear when focused if showing masked value
elements.tokenInput?.addEventListener('focus', function () {
    if (this.value.includes('•')) {
        this.value = '';
        this.type = 'text';
    }
});

elements.tokenInput?.addEventListener('blur', function () {
    this.type = 'password';
});

// =====================================================
// Initialization
// =====================================================

// Setup toggle listeners
setupToggleListeners();

// Initial load
updateStatus();
loadSettings();

// Auto-refresh status every 2 seconds
setInterval(updateStatus, 2000);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.settingsPanel.classList.contains('active')) {
        elements.settingsPanel.classList.remove('active');
    }
    if (e.key === 'Enter' && elements.settingsPanel.classList.contains('active')) {
        saveSettings();
    }
});
