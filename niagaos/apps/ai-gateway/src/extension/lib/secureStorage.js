// =====================================================
// Secure Storage for Chrome Extension
// Version 1.0 - Secure Token & Settings Management
// =====================================================

/**
 * Settings interface for extension configuration
 */
interface Settings {
    serverUrl: string;
    heartbeatInterval: number;
    maxReconnectAttempts: number;
    enableNotifications: boolean;
    debugMode: boolean;
    autoReconnect: boolean;
    connectionTimeout: number;
}

/**
 * Default settings configuration
 */
const DEFAULT_SETTINGS: Settings = {
    serverUrl: 'ws://127.0.0.1:3000',
    heartbeatInterval: 5000,
    maxReconnectAttempts: 10,
    enableNotifications: true,
    debugMode: false,
    autoReconnect: true,
    connectionTimeout: 30000
};

/**
 * SecureStorage class for managing sensitive data
 * Uses chrome.storage.local for persistence
 */
class SecureStorage {
    private static readonly TOKEN_KEY = 'mcp_ws_token';
    private static readonly SETTINGS_KEY = 'mcp_settings';
    private static readonly METRICS_KEY = 'mcp_metrics';
    private static readonly CACHE_KEY = 'mcp_cache';

    // =====================================================
    // Token Management
    // =====================================================

    /**
     * Get the stored WebSocket token
     * @returns Token string or null if not set
     */
    static async getToken() {
        try {
            const result = await chrome.storage.local.get(this.TOKEN_KEY);
            return result[this.TOKEN_KEY] || null;
        } catch (error) {
            console.error('[SecureStorage] Failed to get token:', error);
            return null;
        }
    }

    /**
     * Store the WebSocket token securely
     * @param token - The token to store
     */
    static async setToken(token) {
        try {
            await chrome.storage.local.set({ [this.TOKEN_KEY]: token });
            console.log('[SecureStorage] Token saved successfully');
        } catch (error) {
            console.error('[SecureStorage] Failed to save token:', error);
            throw error;
        }
    }

    /**
     * Remove the stored token
     */
    static async clearToken() {
        try {
            await chrome.storage.local.remove(this.TOKEN_KEY);
            console.log('[SecureStorage] Token cleared');
        } catch (error) {
            console.error('[SecureStorage] Failed to clear token:', error);
        }
    }

    /**
     * Check if token is valid (exists and meets minimum length)
     * @param minLength - Minimum required token length (default: 32)
     */
    static async validateToken(minLength = 32) {
        const token = await this.getToken();
        if (!token) return { valid: false, reason: 'Token not set' };
        if (token.length < minLength) {
            return { valid: false, reason: `Token too short (min: ${minLength} chars)` };
        }
        return { valid: true, token };
    }

    // =====================================================
    // Settings Management
    // =====================================================

    /**
     * Get all settings with defaults applied
     * @returns Settings object
     */
    static async getSettings() {
        try {
            const result = await chrome.storage.local.get(this.SETTINGS_KEY);
            return { ...DEFAULT_SETTINGS, ...(result[this.SETTINGS_KEY] || {}) };
        } catch (error) {
            console.error('[SecureStorage] Failed to get settings:', error);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Update settings (merges with existing)
     * @param settings - Partial settings to update
     */
    static async updateSettings(settings) {
        try {
            const current = await this.getSettings();
            const updated = { ...current, ...settings };
            await chrome.storage.local.set({ [this.SETTINGS_KEY]: updated });
            console.log('[SecureStorage] Settings updated');
            return updated;
        } catch (error) {
            console.error('[SecureStorage] Failed to update settings:', error);
            throw error;
        }
    }

    /**
     * Reset settings to defaults
     */
    static async resetSettings() {
        try {
            await chrome.storage.local.set({ [this.SETTINGS_KEY]: DEFAULT_SETTINGS });
            console.log('[SecureStorage] Settings reset to defaults');
            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error('[SecureStorage] Failed to reset settings:', error);
            throw error;
        }
    }

    // =====================================================
    // Metrics Management
    // =====================================================

    /**
     * Get usage metrics
     */
    static async getMetrics() {
        try {
            const result = await chrome.storage.local.get(this.METRICS_KEY);
            return result[this.METRICS_KEY] || {
                totalConnections: 0,
                totalMessages: 0,
                totalErrors: 0,
                lastConnectedAt: null,
                sessionStartedAt: null
            };
        } catch (error) {
            console.error('[SecureStorage] Failed to get metrics:', error);
            return null;
        }
    }

    /**
     * Update metrics
     */
    static async updateMetrics(updates) {
        try {
            const current = await this.getMetrics();
            const updated = { ...current, ...updates };
            await chrome.storage.local.set({ [this.METRICS_KEY]: updated });
            return updated;
        } catch (error) {
            console.error('[SecureStorage] Failed to update metrics:', error);
        }
    }

    /**
     * Increment a specific metric counter
     */
    static async incrementMetric(key) {
        const metrics = await this.getMetrics();
        if (metrics && typeof metrics[key] === 'number') {
            metrics[key]++;
            await this.updateMetrics(metrics);
        }
    }

    // =====================================================
    // Cache Management
    // =====================================================

    /**
     * Get cached data
     * @param key - Cache key
     */
    static async getCache(key) {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache = result[this.CACHE_KEY] || {};
            const entry = cache[key];

            if (!entry) return null;

            // Check if expired
            if (entry.expiresAt && Date.now() > entry.expiresAt) {
                delete cache[key];
                await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
                return null;
            }

            return entry.value;
        } catch (error) {
            console.error('[SecureStorage] Cache get error:', error);
            return null;
        }
    }

    /**
     * Set cached data with optional TTL
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttlMs - Time to live in milliseconds (optional)
     */
    static async setCache(key, value, ttlMs = null) {
        try {
            const result = await chrome.storage.local.get(this.CACHE_KEY);
            const cache = result[this.CACHE_KEY] || {};

            cache[key] = {
                value,
                createdAt: Date.now(),
                expiresAt: ttlMs ? Date.now() + ttlMs : null
            };

            await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
        } catch (error) {
            console.error('[SecureStorage] Cache set error:', error);
        }
    }

    /**
     * Clear all cached data
     */
    static async clearCache() {
        try {
            await chrome.storage.local.remove(this.CACHE_KEY);
            console.log('[SecureStorage] Cache cleared');
        } catch (error) {
            console.error('[SecureStorage] Failed to clear cache:', error);
        }
    }

    // =====================================================
    // Utility Methods
    // =====================================================

    /**
     * Export all data (for backup)
     */
    static async exportAll() {
        const token = await this.getToken();
        const settings = await this.getSettings();
        const metrics = await this.getMetrics();

        return {
            token: token ? '***REDACTED***' : null, // Don't export actual token
            settings,
            metrics,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Clear all stored data
     */
    static async clearAll() {
        try {
            await chrome.storage.local.clear();
            console.log('[SecureStorage] All data cleared');
        } catch (error) {
            console.error('[SecureStorage] Failed to clear all data:', error);
            throw error;
        }
    }

    /**
     * Get storage usage stats
     */
    static async getStorageStats() {
        return new Promise((resolve) => {
            chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
                resolve({
                    bytesUsed: bytesInUse,
                    bytesAvailable: chrome.storage.local.QUOTA_BYTES - bytesInUse,
                    percentUsed: ((bytesInUse / chrome.storage.local.QUOTA_BYTES) * 100).toFixed(2)
                });
            });
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecureStorage, DEFAULT_SETTINGS };
}
