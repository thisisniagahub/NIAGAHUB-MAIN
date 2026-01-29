// =====================================================
// NotebookLLM Antigravity Bridge - Content Script v3.2
// Enhanced with MutationObserver, Pre-flight Checks, 
// Better Errors, and Configurable Timeouts
// =====================================================

console.log('[Antigravity] Content Bridge v3.2 Loaded - Enhanced Edition');

// =====================================================
// Configuration (Configurable via extension storage)
// =====================================================

const CONFIG = {
    WAIT_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    RESPONSE_POLL_INTERVAL: 300,  // Reduced for faster detection
    RESPONSE_MAX_WAIT: 90000,     // Increased to 90s for complex queries
    GENERATION_TIMEOUT: 300000,   // 5 minutes for content generation
    MUTATION_OBSERVER_TIMEOUT: 60000,  // MutationObserver timeout
    HEARTBEAT_INTERVAL: 5000,     // Faster heartbeat (5s)
    MIN_RESPONSE_LENGTH: 10,      // Minimum response length
    STREAMING_SETTLE_TIME: 1500,  // Wait for streaming to settle
};

// Error messages with actionable hints
const ERROR_MESSAGES = {
    NO_SOURCES: 'Notebook has no sources. Please add sources first using add_source_url or add_source_text.',
    CHAT_INPUT_NOT_FOUND: 'Chat input not found. The notebook page may not be fully loaded. Try refreshing the page.',
    EXTENSION_DISCONNECTED: 'Extension disconnected. Please refresh the NotebookLLM page or reload the extension.',
    QUERY_TIMEOUT: (seconds) => `No response after ${seconds}s. Check if NotebookLLM is responding in the browser.`,
    NOTEBOOK_NOT_OPEN: 'No notebook is currently open. Use open_notebook or navigate to a notebook first.',
    GENERATION_TIMEOUT: (feature) => `${feature} generation timed out. Try again or use a simpler request.`,
    SOURCES_REQUIRED: 'This operation requires at least one source in the notebook.',
};

// DOM Selectors for NotebookLLM UI
const SELECTORS = {
    // Notebooks
    notebookTitle: ['.notebook-title', '[role="heading"]', 'h1', '.title'],
    notebookItem: ['.notebook-item', 'mat-list-item', '[data-notebook-id]', 'a[href*="/notebook/"]'],
    createNotebookBtn: ['button[aria-label*="Create"]', 'button[aria-label*="New"]'],

    // Chat - Updated based on actual NotebookLLM UI screenshots
    chatInput: [
        // Bottom chat input bar
        'textarea[placeholder*="Upload a source"]',
        'textarea[placeholder*="Start typing"]',
        'textarea[placeholder*="sources"]',
        'textarea[placeholder*="Ask"]',
        'textarea[aria-label*="chat"]',
        'div[contenteditable="true"]',
        '[role="textbox"]',
        // More generic fallbacks
        'footer textarea',
        'form textarea',
        'textarea'
    ],
    sendButton: [
        // Arrow button next to input
        'button[aria-label="Send"]',
        'button[aria-label*="send"]',
        'button[aria-label*="Submit"]',
        'button[type="submit"]',
        // SVG arrow button visible in screenshot
        'button svg[class*="arrow"]',
        'button:has(svg)',
        'button.send-btn',
        // Circular button near input
        'button[class*="circle"]'
    ],
    response: [
        // Chat message responses
        '.response-container',
        '.model-response',
        '[data-message-author="model"]',
        '[data-message-role="model"]',
        '.chat-message:not(.user-message)',
        // Markdown rendered content
        '.markdown-content',
        '.message-content',
        // Generic class patterns
        '[class*="response"]',
        '[class*="model-message"]',
        '[class*="assistant"]',
        // Article elements often used for messages
        'article[class*="message"]',
        '[role="article"]'
    ],

    // Sources - Left panel from screenshot
    sourceItem: [
        '.source-item',
        '[data-source-id]',
        '.source-card',
        // "Saved sources will appear here" section items
        '[class*="source"]'
    ],
    addSourceBtn: [
        // "+ Add sources" button visible in screenshot
        'button:has-text("Add sources")',
        'button[aria-label*="Add source"]',
        'button[aria-label*="Add"]',
        'button:has-text("Add")',
        // Upload button in center
        'button:has-text("Upload a source")'
    ],
    sourceUrlInput: ['input[type="url"]', 'input[placeholder*="URL"]', 'input[placeholder*="Search the web"]'],
    sourceTextArea: ['textarea[aria-label*="paste"]', 'textarea[placeholder*="Paste"]', 'textarea[placeholder*="Copied text"]'],

    // === STUDIO DIALOG SELECTORS (Updated from actual UI screenshots) ===
    dialog: ['[role="dialog"]', '.modal', 'mat-dialog-container', '[class*="dialog"]'],
    dialogClose: ['button[aria-label="Close"]', 'button:has-text("×")', '[class*="close"]'],
    generateBtn: ['button:has-text("Generate")', 'button[class*="primary"]', 'button[color="primary"]'],

    // Audio Overview: Format cards (Deep Dive ✓, Brief, Critique, Debate)
    formatCard: ['[class*="format"]', '[class*="card"]', '[class*="option"]'],
    formatDeepDive: ['[class*="card"]:has-text("Deep Dive")'],
    formatBrief: ['[class*="card"]:has-text("Brief")'],
    formatCritique: ['[class*="card"]:has-text("Critique")'],
    formatDebate: ['[class*="card"]:has-text("Debate")'],
    formatExplainer: ['[class*="card"]:has-text("Explainer")'],

    // Language dropdown (shows "English" with dropdown arrow)
    languageDropdown: ['button:has-text("English")', '[class*="dropdown"]', 'mat-select', '[class*="language"]'],

    // Length options (button groups: Short, Default ✓, Long)
    lengthShort: ['button:has-text("Short")'],
    lengthDefault: ['button:has-text("Default")'],
    lengthLong: ['button:has-text("Long")'],

    // Video Overview: Visual style cards (Auto-select ✓, Custom, Classic, Whiteboard, Kawaii, Anime)
    visualStyleAuto: ['[class*="style"]:has-text("Auto-select")', '[class*="card"]:first-child'],
    visualStyleCustom: ['[class*="style"]:has-text("Custom")'],
    visualStyleClassic: ['[class*="style"]:has-text("Classic")'],
    visualStyleWhiteboard: ['[class*="style"]:has-text("Whiteboard")'],
    visualStyleKawaii: ['[class*="style"]:has-text("Kawaii")'],
    visualStyleAnime: ['[class*="style"]:has-text("Anime")'],

    // Reports: Format cards with edit icons
    reportCreateOwn: ['[class*="card"]:has-text("Create Your Own")'],
    reportBriefingDoc: ['[class*="card"]:has-text("Briefing Doc")'],
    reportStudyGuide: ['[class*="card"]:has-text("Study Guide")'],
    reportBlogPost: ['[class*="card"]:has-text("Blog Post")'],
    reportCaseStudy: ['[class*="card"]:has-text("Case Study")'],
    reportAnalysis: ['[class*="card"]:has-text("Analysis")'],
    reportNarrative: ['[class*="card"]:has-text("Narrative")'],
    reportProfile: ['[class*="card"]:has-text("Profile")'],
    // Suggested formats from Reports dialog
    reportStrategicPartnership: ['[class*="card"]:has-text("Strategic Partnership")'],
    reportProgramAnalysis: ['[class*="card"]:has-text("Program Analysis")'],
    reportProcessNarrative: ['[class*="card"]:has-text("Process Narrative")'],
    reportEntrepreneurial: ['[class*="card"]:has-text("Entrepreneurial")'],

    // Flashcards/Quiz: Number of Cards/Questions (Fewer, Standard (Default) ✓, More)
    countFewer: ['button:has-text("Fewer")'],
    countStandard: ['button:has-text("Standard")'],
    countMore: ['button:has-text("More")'],

    // Flashcards/Quiz: Level of Difficulty (Easy, Medium (Default) ✓, Hard)
    difficultyEasy: ['button:has-text("Easy")'],
    difficultyMedium: ['button:has-text("Medium")'],
    difficultyHard: ['button:has-text("Hard")'],

    // Infographic: Orientation (Landscape ✓, Portrait, Square)
    orientationLandscape: ['button:has-text("Landscape")'],
    orientationPortrait: ['button:has-text("Portrait")'],
    orientationSquare: ['button:has-text("Square")'],

    // Infographic: Level of Detail (Concise, Standard ✓, Detailed BETA)
    detailConcise: ['button:has-text("Concise")'],
    detailStandard: ['button:has-text("Standard")'],
    detailDetailed: ['button:has-text("Detailed")'],

    // Slide Deck: Format cards (Detailed Deck ✓, Presenter Slides)
    slideDeckDetailed: ['[class*="card"]:has-text("Detailed Deck")'],
    slideDeckPresenter: ['[class*="card"]:has-text("Presenter Slides")'],

    // Topic/Focus/Description textareas (from all dialogs)
    topicInput: [
        'textarea[placeholder*="topic"]',
        'textarea:has-text("Things to try")',
        '[class*="topic"] textarea'
    ],
    focusInput: [
        'textarea[placeholder*="focus"]',
        'textarea[placeholder*="What should the AI"]',
        '[class*="focus"] textarea'
    ],
    descriptionInput: [
        'textarea[placeholder*="Describe"]',
        'textarea[placeholder*="Guide the style"]',
        'textarea[placeholder*="Add a high-level"]',
        '[class*="description"] textarea'
    ],

    // Studio feature buttons - Right panel from screenshot shows: Audio, Video, Mind Map, Reports, Flashcards, Quiz, Infographic, Slide Deck, Data Table
    audioOverviewBtn: [
        'button[aria-label*="Audio"]',
        '[data-create="audio"]',
        // Match button/div with text "Audio"
        '[class*="studio"] button:first-child',
        'button:has-text("Audio")'
    ],
    videoOverviewBtn: ['button[aria-label*="Video"]', '[data-create="video"]', 'button:has-text("Video")'],
    mindMapBtn: ['button[aria-label*="Mind Map"]', '[data-create="mindmap"]', 'button:has-text("Mind Map")'],
    reportsBtn: ['button[aria-label*="Report"]', '[data-create="report"]', 'button:has-text("Reports")'],
    flashcardsBtn: ['button[aria-label*="Flashcard"]', '[data-create="flashcards"]', 'button:has-text("Flashcards")'],
    quizBtn: ['button[aria-label*="Quiz"]', '[data-create="quiz"]', 'button:has-text("Quiz")'],
    infographicBtn: ['button[aria-label*="Infograph"]', '[data-create="infographic"]', 'button:has-text("Infograph")'],
    slideDeckBtn: ['button[aria-label*="Slide"]', '[data-create="slides"]', 'button:has-text("Slide Deck")'],
    dataTableBtn: ['button[aria-label*="Table"]', '[data-create="table"]', 'button:has-text("Data Table")'],

    // Generated content
    audioPlayer: ['audio', '.audio-player'],
    videoPlayer: ['video', '.video-player'],
    generatedContent: ['.generated-content', '.output-content', '[data-generated]', '[class*="studio-output"]'],

    // Conversation - Chat panel messages
    userMessage: ['[data-message-author="user"]', '.user-message', '[class*="user-message"]'],

    // Loading indicators
    loadingIndicator: ['.loading', '.spinner', 'mat-progress-spinner', '.generating', '[class*="loading"]', '[class*="spinner"]'],

    // Download/Copy buttons
    downloadBtn: ['button[aria-label*="Download"]', 'a[download]'],
    copyBtn: ['button[aria-label*="Copy"]'],

    // Add note button visible in screenshot
    addNoteBtn: ['button:has-text("Add note")']
};

// =====================================================
// Utility Functions
// =====================================================

const log = {
    info: (msg, ...args) => console.log(`[Antigravity] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[Antigravity] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[Antigravity] ${msg}`, ...args)
};

function querySelector(selectorList) {
    const selectors = Array.isArray(selectorList) ? selectorList : [selectorList];
    for (const selector of selectors) {
        try { const el = document.querySelector(selector); if (el) return el; } catch (e) { }
    }
    return null;
}

function querySelectorAll(selectorList) {
    const selectors = Array.isArray(selectorList) ? selectorList : [selectorList];
    for (const selector of selectors) {
        try { const els = document.querySelectorAll(selector); if (els.length > 0) return Array.from(els); } catch (e) { }
    }
    return [];
}

// Find element by text content
function findByText(text, container = document) {
    const xpath = `//*[contains(text(), '${text}')]`;
    const result = document.evaluate(xpath, container, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

// Find clickable element by text
function findButtonByText(text) {
    const allButtons = document.querySelectorAll('button, [role="button"], .clickable');
    for (const btn of allButtons) {
        if (btn.textContent?.toLowerCase().includes(text.toLowerCase())) return btn;
    }
    // Also check for cards/divs that are clickable
    const allDivs = document.querySelectorAll('[role="option"], .card, .format-card, .option');
    for (const div of allDivs) {
        if (div.textContent?.toLowerCase().includes(text.toLowerCase())) return div;
    }
    return null;
}

function waitFor(selectorList, timeout = CONFIG.WAIT_TIMEOUT) {
    return new Promise((resolve, reject) => {
        const selectors = Array.isArray(selectorList) ? selectorList : [selectorList];
        const el = querySelector(selectors);
        if (el) return resolve(el);
        const observer = new MutationObserver(() => {
            const el = querySelector(selectors);
            if (el) { observer.disconnect(); resolve(el); }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); reject(new Error(`Timeout`)); }, timeout);
    });
}

async function waitForGeneration(timeout = CONFIG.GENERATION_TIMEOUT) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        await sleep(2000);
        const loading = querySelector(SELECTORS.loadingIndicator);
        if (!loading) {
            await sleep(1000);
            const stillLoading = querySelector(SELECTORS.loadingIndicator);
            if (!stillLoading) return { success: true };
        }
    }
    return { success: false, error: 'Generation timeout' };
}

async function withRetry(operation, attempts = CONFIG.RETRY_ATTEMPTS) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
        try { return await operation(); }
        catch (err) { lastError = err; if (i < attempts - 1) await sleep(CONFIG.RETRY_DELAY); }
    }
    throw lastError;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function simulateInput(element, value) {
    if (!element) return;
    element.focus();
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = value;
    } else {
        element.textContent = value;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function clickElement(element) {
    if (!element) return false;
    element.click();
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
}

async function selectOption(optionText) {
    const option = findButtonByText(optionText);
    if (option) {
        clickElement(option);
        await sleep(300);
        return true;
    }
    return false;
}

async function clickGenerateButton() {
    await sleep(500);
    // Try multiple ways to find Generate button
    let generateBtn = findButtonByText('Generate');
    if (!generateBtn) generateBtn = querySelector(SELECTORS.generateBtn);
    if (!generateBtn) generateBtn = document.querySelector('button[color="primary"]');

    if (generateBtn) {
        clickElement(generateBtn);
        return true;
    }
    return false;
}

// =====================================================
// NOTEBOOK MANAGEMENT
// =====================================================

async function handleListNotebooks() {
    return withRetry(async () => {
        const items = querySelectorAll(SELECTORS.notebookItem);
        const notebooks = items.map((el, idx) => ({
            id: el.getAttribute('data-notebook-id') || el.href?.split('/').pop() || `notebook-${idx}`,
            name: el.textContent?.trim() || `Notebook ${idx + 1}`,
            url: el.href || null
        })).filter(n => n.name);
        const currentTitle = querySelector(SELECTORS.notebookTitle)?.textContent?.trim();
        return { notebooks, count: notebooks.length, currentNotebook: currentTitle, timestamp: new Date().toISOString() };
    });
}

async function handleCreateNotebook(name) {
    return withRetry(async () => {
        if (!name) throw new Error('Name required');
        const createBtn = await waitFor(SELECTORS.createNotebookBtn);
        clickElement(createBtn); await sleep(500);
        const input = await waitFor(['input', 'textarea']);
        simulateInput(input, name); await sleep(200);
        const confirmBtn = findButtonByText('Create') || findButtonByText('Confirm');
        clickElement(confirmBtn); await sleep(1000);
        return { success: true, name, timestamp: new Date().toISOString() };
    });
}

async function handleGetNotebookDetails() {
    const title = querySelector(SELECTORS.notebookTitle)?.textContent?.trim();
    const sources = querySelectorAll(SELECTORS.sourceItem);
    const conversations = querySelectorAll(SELECTORS.response);
    return { name: title || 'Unknown', sourceCount: sources.length, conversationCount: conversations.length, url: window.location.href, timestamp: new Date().toISOString() };
}

// =====================================================
// SOURCE MANAGEMENT
// =====================================================

async function handleListSources() {
    const sourceElements = querySelectorAll(SELECTORS.sourceItem);
    const sources = sourceElements.map((el, idx) => ({
        id: el.getAttribute('data-source-id') || `source-${idx}`,
        name: el.querySelector('.title, h3, h4')?.textContent?.trim() || el.textContent?.trim().substring(0, 50),
        type: el.getAttribute('data-type') || 'unknown'
    }));
    return { sources, count: sources.length, timestamp: new Date().toISOString() };
}

async function handleAddSourceUrl(url) {
    return withRetry(async () => {
        if (!url) throw new Error('URL required');
        const addBtn = await waitFor(SELECTORS.addSourceBtn);
        clickElement(addBtn); await sleep(500);
        // Look for URL option
        await selectOption('Website') || await selectOption('URL') || await selectOption('Link');
        await sleep(300);
        const urlInput = await waitFor(SELECTORS.sourceUrlInput);
        simulateInput(urlInput, url); await sleep(200);
        await clickGenerateButton() || clickElement(findButtonByText('Add'));
        await sleep(2000);
        return { success: true, url, timestamp: new Date().toISOString() };
    });
}

async function handleAddSourceText(text, title) {
    return withRetry(async () => {
        if (!text) throw new Error('Text required');
        const addBtn = await waitFor(SELECTORS.addSourceBtn);
        clickElement(addBtn); await sleep(500);
        await selectOption('Copied text') || await selectOption('Paste') || await selectOption('Text');
        await sleep(300);
        const textArea = await waitFor(SELECTORS.sourceTextArea);
        simulateInput(textArea, text); await sleep(200);
        clickElement(findButtonByText('Insert')); await sleep(1500);
        return { success: true, contentLength: text.length, timestamp: new Date().toISOString() };
    });
}

// =====================================================
// AI CHAT - Enhanced with Pre-flight Checks
// =====================================================

// Pre-flight check: Verify notebook has sources
async function checkSourcesExist() {
    const sources = querySelectorAll(SELECTORS.sourceItem);
    return sources.length > 0;
}

// Pre-flight check: Verify we're on a notebook page
function isNotebookOpen() {
    const url = window.location.href;
    return url.includes('notebooklm.google.com') &&
        (url.includes('/notebook/') || document.querySelector(SELECTORS.notebookTitle.join(',')));
}

// Get current notebook context
function getNotebookContext() {
    return {
        url: window.location.href,
        title: document.title,
        sourceCount: querySelectorAll(SELECTORS.sourceItem).length,
        isOpen: isNotebookOpen(),
        chatAvailable: !!querySelector(SELECTORS.chatInput)
    };
}

async function handleQueryNotebook(notebookId, query) {
    return withRetry(async () => {
        if (!query) throw new Error('Query required');

        // PRE-FLIGHT CHECK 1: Verify notebook is open
        if (!isNotebookOpen()) {
            log.warn('Pre-flight failed: No notebook open');
            throw new Error(ERROR_MESSAGES.NOTEBOOK_NOT_OPEN);
        }

        // PRE-FLIGHT CHECK 2: Verify sources exist
        const hasSources = await checkSourcesExist();
        if (!hasSources) {
            log.warn('Pre-flight failed: No sources');
            const context = getNotebookContext();
            return {
                error: ERROR_MESSAGES.NO_SOURCES,
                context,
                hint: 'Use add_source_url or add_source_text to add sources first.',
                timestamp: new Date().toISOString()
            };
        }

        log.info('Pre-flight checks passed. Looking for chat input...');
        const input = await waitFor(SELECTORS.chatInput).catch(() => null);

        if (!input) {
            throw new Error(ERROR_MESSAGES.CHAT_INPUT_NOT_FOUND);
        }

        log.info('Found input:', input?.tagName, input?.placeholder || input?.className);

        // Get current response state before sending
        const beforeResponses = querySelectorAll(SELECTORS.response);
        const beforeContent = beforeResponses[beforeResponses.length - 1]?.textContent || '';
        log.info('Current responses:', beforeResponses.length, 'sources:', querySelectorAll(SELECTORS.sourceItem).length);

        // Input the query
        simulateInput(input, query);
        await sleep(200);

        // Try multiple ways to send
        const sendBtn = querySelector(SELECTORS.sendButton);
        log.info('Send button found:', !!sendBtn, 'disabled:', sendBtn?.disabled);

        if (sendBtn && !sendBtn.disabled) {
            clickElement(sendBtn);
            log.info('Clicked send button');
        } else {
            // Try Enter key with all event types
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
            input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
            log.info('Sent Enter key events');
        }

        // Use MutationObserver for faster response detection
        log.info('Starting MutationObserver for response detection...');
        const response = await waitForResponseWithObserver(beforeResponses.length, beforeContent);
        return response;
    });
}

// NEW: MutationObserver-based response detection (much faster than polling)
async function waitForResponseWithObserver(previousCount = 0, previousContent = '') {
    return new Promise((resolve) => {
        const startTime = Date.now();
        let observer = null;
        let pollInterval = null;
        let resolved = false;

        const cleanup = () => {
            if (observer) observer.disconnect();
            if (pollInterval) clearInterval(pollInterval);
            resolved = true;
        };

        const checkForResponse = () => {
            const responses = querySelectorAll(SELECTORS.response);
            const elapsed = Math.round((Date.now() - startTime) / 1000);

            if (responses.length > previousCount) {
                const last = responses[responses.length - 1];
                const currentContent = last.textContent?.trim() || '';

                // Check if still typing
                const isTyping = last.querySelector('.typing, .loading, [class*="loading"], [class*="typing"], mat-progress-spinner, [class*="spinner"]');
                const hasStreamingCursor = currentContent.endsWith('|') || currentContent.endsWith('▍') || currentContent.endsWith('_');

                if (!isTyping && !hasStreamingCursor && currentContent.length > CONFIG.MIN_RESPONSE_LENGTH && currentContent !== previousContent) {
                    // Wait for streaming to settle
                    setTimeout(() => {
                        if (resolved) return;
                        const finalContent = last.textContent?.trim();
                        log.info(`Got response after ${elapsed}s:`, finalContent?.substring(0, 100) + '...');
                        cleanup();
                        resolve({
                            answer: finalContent,
                            responseCount: responses.length,
                            responseTime: elapsed,
                            timestamp: new Date().toISOString()
                        });
                    }, CONFIG.STREAMING_SETTLE_TIME);
                    return true;
                }
            }
            return false;
        };

        // Set up MutationObserver for instant detection
        const chatContainer = document.querySelector('[class*="chat"], [class*="conversation"], main, [role="main"]');
        if (chatContainer) {
            observer = new MutationObserver((mutations) => {
                if (resolved) return;

                // Check if any mutation added new content
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
                        if (checkForResponse()) return;
                    }
                }
            });

            observer.observe(chatContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
            log.info('MutationObserver active on chat container');
        } else {
            log.warn('Chat container not found, falling back to polling only');
        }

        // Backup polling (less frequent since we have MutationObserver)
        pollInterval = setInterval(() => {
            if (resolved) return;

            const elapsed = Date.now() - startTime;

            // Progress logging every 10 seconds
            if (elapsed % 10000 < CONFIG.RESPONSE_POLL_INTERVAL * 2) {
                log.info(`Still waiting... ${Math.round(elapsed / 1000)}s elapsed`);
            }

            checkForResponse();

            // Timeout check
            if (elapsed >= CONFIG.RESPONSE_MAX_WAIT) {
                cleanup();

                // Try to get partial response
                const finalResponses = querySelectorAll(SELECTORS.response);
                if (finalResponses.length > previousCount) {
                    const last = finalResponses[finalResponses.length - 1];
                    resolve({
                        answer: last.textContent?.trim() || 'Response found but may be incomplete',
                        partial: true,
                        responseTime: Math.round(elapsed / 1000),
                        timestamp: new Date().toISOString()
                    });
                } else {
                    resolve({
                        error: ERROR_MESSAGES.QUERY_TIMEOUT(Math.round(CONFIG.RESPONSE_MAX_WAIT / 1000)),
                        context: getNotebookContext(),
                        hint: 'The AI may still be processing. Check the NotebookLLM page directly.',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }, CONFIG.RESPONSE_POLL_INTERVAL * 2);  // Poll less frequently with observer

        // Initial check in case response is already there
        setTimeout(() => checkForResponse(), 500);
    });
}

// Legacy polling function (kept as fallback)
async function pollForResponse(previousCount = 0, previousContent = '') {
    // Redirect to MutationObserver version
    return waitForResponseWithObserver(previousCount, previousContent);
}

// =====================================================
// STUDIO: AUDIO OVERVIEW (with full options)
// =====================================================

async function handleGenerateAudioOverview(options = {}) {
    const { format = 'deep_dive', language = 'English', length = 'default', focus = '' } = options;

    return withRetry(async () => {
        // Click Audio Overview button
        const audioBtn = await waitFor(SELECTORS.audioOverviewBtn);
        clickElement(audioBtn);
        await sleep(1000);

        // Wait for dialog
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select format
        const formatMap = { 'deep_dive': 'Deep Dive', 'brief': 'Brief', 'critique': 'Critique', 'debate': 'Debate' };
        await selectOption(formatMap[format] || 'Deep Dive');
        await sleep(300);

        // Select length
        const lengthMap = { 'short': 'Short', 'default': 'Default', 'long': 'Long' };
        await selectOption(lengthMap[length] || 'Default');
        await sleep(300);

        // Set focus if provided
        if (focus) {
            const focusInput = querySelector(SELECTORS.focusInput) || querySelector(SELECTORS.topicInput);
            if (focusInput) simulateInput(focusInput, focus);
            await sleep(200);
        }

        // Click Generate
        await clickGenerateButton();

        return {
            success: true,
            feature: 'audio_overview',
            options: { format, language, length, focus },
            message: 'Audio generation started',
            timestamp: new Date().toISOString()
        };
    });
}

async function handleGetAudioStatus() {
    const player = querySelector(SELECTORS.audioPlayer);
    if (player && player.src) {
        return { status: 'ready', audioUrl: player.src, duration: player.duration, timestamp: new Date().toISOString() };
    }
    const loading = querySelector(SELECTORS.loadingIndicator);
    if (loading) return { status: 'generating', timestamp: new Date().toISOString() };
    return { status: 'not_started', timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: VIDEO OVERVIEW (with full options)
// =====================================================

async function handleGenerateVideoOverview(options = {}) {
    const { format = 'explainer', language = 'English', visualStyle = 'auto', focus = '' } = options;

    return withRetry(async () => {
        const videoBtn = await waitFor(SELECTORS.videoOverviewBtn);
        clickElement(videoBtn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select format
        const formatMap = { 'explainer': 'Explainer', 'brief': 'Brief' };
        await selectOption(formatMap[format] || 'Explainer');
        await sleep(300);

        // Select visual style
        const styleMap = { 'auto': 'Auto-select', 'custom': 'Custom', 'classic': 'Classic', 'whiteboard': 'Whiteboard', 'kawaii': 'Kawaii', 'anime': 'Anime' };
        await selectOption(styleMap[visualStyle] || 'Auto-select');
        await sleep(300);

        if (focus) {
            const focusInput = querySelector(SELECTORS.focusInput) || querySelector(SELECTORS.topicInput);
            if (focusInput) simulateInput(focusInput, focus);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'video_overview', options: { format, language, visualStyle, focus }, message: 'Video generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetVideoStatus() {
    const player = querySelector(SELECTORS.videoPlayer);
    if (player && player.src) return { status: 'ready', videoUrl: player.src, duration: player.duration, timestamp: new Date().toISOString() };
    const loading = querySelector(SELECTORS.loadingIndicator);
    if (loading) return { status: 'generating', timestamp: new Date().toISOString() };
    return { status: 'not_started', timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: MIND MAP
// =====================================================

async function handleGenerateMindMap() {
    return withRetry(async () => {
        const btn = await waitFor(SELECTORS.mindMapBtn);
        clickElement(btn);
        await sleep(1000);
        const genStatus = await waitForGeneration();
        return { success: true, feature: 'mind_map', status: genStatus.success ? 'completed' : 'generating', timestamp: new Date().toISOString() };
    });
}

// =====================================================
// STUDIO: REPORTS (with full options)
// =====================================================

async function handleGenerateReport(options = {}) {
    const { reportType = 'briefing_doc', customPrompt = '' } = options;

    return withRetry(async () => {
        const reportsBtn = await waitFor(SELECTORS.reportsBtn);
        clickElement(reportsBtn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select report type
        const typeMap = {
            'create_own': 'Create Your Own',
            'briefing_doc': 'Briefing Doc',
            'study_guide': 'Study Guide',
            'blog_post': 'Blog Post',
            'case_study': 'Case Study',
            'analysis': 'Analysis',
            'narrative': 'Narrative',
            'profile': 'Profile'
        };
        await selectOption(typeMap[reportType] || 'Briefing Doc');
        await sleep(300);

        if (customPrompt && reportType === 'create_own') {
            const promptInput = querySelector(SELECTORS.topicInput);
            if (promptInput) simulateInput(promptInput, customPrompt);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'report', options: { reportType, customPrompt }, message: 'Report generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetReport() {
    const content = querySelector(SELECTORS.generatedContent);
    if (content) return { status: 'ready', content: content.textContent?.trim().substring(0, 2000), timestamp: new Date().toISOString() };
    return { status: 'not_generated', timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: FLASHCARDS (with full options)
// =====================================================

async function handleGenerateFlashcards(options = {}) {
    const { count = 'standard', difficulty = 'medium', topic = '' } = options;

    return withRetry(async () => {
        const flashcardsBtn = await waitFor(SELECTORS.flashcardsBtn);
        clickElement(flashcardsBtn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select count
        const countMap = { 'fewer': 'Fewer', 'standard': 'Standard', 'more': 'More' };
        await selectOption(countMap[count] || 'Standard');
        await sleep(300);

        // Select difficulty
        const diffMap = { 'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard' };
        await selectOption(diffMap[difficulty] || 'Medium');
        await sleep(300);

        // Set topic
        if (topic) {
            const topicInput = querySelector(SELECTORS.topicInput);
            if (topicInput) simulateInput(topicInput, topic);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'flashcards', options: { count, difficulty, topic }, message: 'Flashcard generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetFlashcards() {
    const cards = querySelectorAll('.flashcard, [data-flashcard]');
    const flashcards = cards.map((card, idx) => ({
        id: idx,
        front: card.querySelector('.front, .question')?.textContent?.trim() || 'Q',
        back: card.querySelector('.back, .answer')?.textContent?.trim() || 'A'
    }));
    return { status: flashcards.length > 0 ? 'ready' : 'not_generated', flashcards, count: flashcards.length, timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: QUIZ (with full options)
// =====================================================

async function handleGenerateQuiz(options = {}) {
    const { questionCount = 'standard', difficulty = 'medium', topic = '' } = options;

    return withRetry(async () => {
        const quizBtn = await waitFor(SELECTORS.quizBtn);
        clickElement(quizBtn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select question count
        const countMap = { 'fewer': 'Fewer', 'standard': 'Standard', 'more': 'More' };
        await selectOption(countMap[questionCount] || 'Standard');
        await sleep(300);

        // Select difficulty
        const diffMap = { 'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard' };
        await selectOption(diffMap[difficulty] || 'Medium');
        await sleep(300);

        // Set topic
        if (topic) {
            const topicInput = querySelector(SELECTORS.topicInput);
            if (topicInput) simulateInput(topicInput, topic);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'quiz', options: { questionCount, difficulty, topic }, message: 'Quiz generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetQuiz() {
    const questions = querySelectorAll('.quiz-question, [data-question]');
    const quiz = questions.map((q, idx) => ({
        id: idx,
        question: q.textContent?.trim(),
        options: Array.from(q.parentElement?.querySelectorAll('.answer, [data-answer]') || []).map(a => a.textContent?.trim())
    }));
    return { status: quiz.length > 0 ? 'ready' : 'not_generated', questions: quiz, count: quiz.length, timestamp: new Date().toISOString() };
}

async function handleAnswerQuiz(questionId, answerId) {
    const questions = querySelectorAll('.quiz-question, [data-question]');
    if (questions[questionId]) {
        const answers = questions[questionId].parentElement?.querySelectorAll('.answer, [data-answer], button');
        if (answers && answers[answerId]) {
            clickElement(answers[answerId]);
            await sleep(500);
            return { success: true, questionId, answerId, timestamp: new Date().toISOString() };
        }
    }
    return { success: false, error: 'Not found', timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: INFOGRAPHIC (with full options)
// =====================================================

async function handleGenerateInfographic(options = {}) {
    const { language = 'English', orientation = 'landscape', detailLevel = 'standard', description = '' } = options;

    return withRetry(async () => {
        const btn = await waitFor(SELECTORS.infographicBtn);
        clickElement(btn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select orientation
        const orientMap = { 'landscape': 'Landscape', 'portrait': 'Portrait', 'square': 'Square' };
        await selectOption(orientMap[orientation] || 'Landscape');
        await sleep(300);

        // Select detail level
        const detailMap = { 'concise': 'Concise', 'standard': 'Standard', 'detailed': 'Detailed' };
        await selectOption(detailMap[detailLevel] || 'Standard');
        await sleep(300);

        // Set description
        if (description) {
            const descInput = querySelector(SELECTORS.topicInput);
            if (descInput) simulateInput(descInput, description);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'infographic', options: { language, orientation, detailLevel, description }, message: 'Infographic generation started', timestamp: new Date().toISOString() };
    });
}

// =====================================================
// STUDIO: SLIDE DECK (with full options)
// =====================================================

async function handleGenerateSlideDeck(options = {}) {
    const { format = 'detailed_deck', language = 'English', length = 'default', description = '' } = options;

    return withRetry(async () => {
        const btn = await waitFor(SELECTORS.slideDeckBtn);
        clickElement(btn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Select format
        const formatMap = { 'detailed_deck': 'Detailed Deck', 'presenter_slides': 'Presenter Slides' };
        await selectOption(formatMap[format] || 'Detailed Deck');
        await sleep(300);

        // Select length
        const lengthMap = { 'short': 'Short', 'default': 'Default' };
        await selectOption(lengthMap[length] || 'Default');
        await sleep(300);

        // Set description
        if (description) {
            const descInput = querySelector(SELECTORS.topicInput);
            if (descInput) simulateInput(descInput, description);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'slide_deck', options: { format, language, length, description }, message: 'Slide deck generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetSlideDeck() {
    const slides = querySelectorAll('.slide, [data-slide]');
    const slideData = slides.map((s, idx) => ({
        id: idx,
        title: s.querySelector('h1, h2, .title')?.textContent?.trim() || `Slide ${idx + 1}`,
        content: s.textContent?.trim().substring(0, 200)
    }));
    return { status: slideData.length > 0 ? 'ready' : 'not_generated', slides: slideData, count: slideData.length, timestamp: new Date().toISOString() };
}

// =====================================================
// STUDIO: DATA TABLE (with full options)
// =====================================================

async function handleGenerateDataTable(options = {}) {
    const { language = 'English', description = '' } = options;

    return withRetry(async () => {
        const btn = await waitFor(SELECTORS.dataTableBtn);
        clickElement(btn);
        await sleep(1000);
        await waitFor(SELECTORS.dialog);
        await sleep(500);

        // Set description
        if (description) {
            const descInput = querySelector(SELECTORS.topicInput);
            if (descInput) simulateInput(descInput, description);
            await sleep(200);
        }

        await clickGenerateButton();

        return { success: true, feature: 'data_table', options: { language, description }, message: 'Data table generation started', timestamp: new Date().toISOString() };
    });
}

async function handleGetDataTable() {
    const table = querySelector('table, .data-table');
    if (table) {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim());
        const rows = Array.from(table.querySelectorAll('tr')).slice(1).map(row =>
            Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim())
        );
        return { status: 'ready', headers, rows, rowCount: rows.length, timestamp: new Date().toISOString() };
    }
    return { status: 'not_generated', timestamp: new Date().toISOString() };
}

// =====================================================
// EXPORT & UTILITIES
// =====================================================

async function handleExportMarkdown() {
    const title = querySelector(SELECTORS.notebookTitle)?.textContent?.trim() || 'Notebook';
    const sources = querySelectorAll(SELECTORS.sourceItem);
    const userMsgs = querySelectorAll(SELECTORS.userMessage);
    const modelMsgs = querySelectorAll(SELECTORS.response);

    let md = `# ${title}\n\n## Sources (${sources.length})\n\n`;
    sources.forEach((s, i) => { md += `${i + 1}. ${s.textContent?.trim().substring(0, 100)}\n`; });
    md += `\n## Conversations\n\n`;
    for (let i = 0; i < Math.max(userMsgs.length, modelMsgs.length); i++) {
        if (userMsgs[i]) md += `### Q: ${userMsgs[i].textContent?.trim()}\n\n`;
        if (modelMsgs[i]) md += `**A:** ${modelMsgs[i].textContent?.trim()}\n\n---\n\n`;
    }
    return { markdown: md, title, timestamp: new Date().toISOString() };
}

async function handleExportJson() {
    const title = querySelector(SELECTORS.notebookTitle)?.textContent?.trim() || 'Notebook';
    const sources = querySelectorAll(SELECTORS.sourceItem).map((el, i) => ({ id: i, name: el.textContent?.trim().substring(0, 100) }));
    const userMsgs = querySelectorAll(SELECTORS.userMessage);
    const modelMsgs = querySelectorAll(SELECTORS.response);
    const conversations = [];
    for (let i = 0; i < Math.max(userMsgs.length, modelMsgs.length); i++) {
        conversations.push({ question: userMsgs[i]?.textContent?.trim(), answer: modelMsgs[i]?.textContent?.trim() });
    }
    return { title, url: window.location.href, sources, conversations, exportedAt: new Date().toISOString() };
}

async function handleGetConversationHistory() {
    const userMsgs = querySelectorAll(SELECTORS.userMessage);
    const modelMsgs = querySelectorAll(SELECTORS.response);
    const history = [];
    for (let i = 0; i < Math.max(userMsgs.length, modelMsgs.length); i++) {
        if (userMsgs[i]) history.push({ role: 'user', content: userMsgs[i].textContent?.trim() });
        if (modelMsgs[i]) history.push({ role: 'model', content: modelMsgs[i].textContent?.trim() });
    }
    return { history, count: history.length, timestamp: new Date().toISOString() };
}

async function handleGetStatus() {
    return {
        status: 'connected',
        url: window.location.href,
        title: document.title,
        isNotebookPage: window.location.href.includes('notebooklm.google.com'),
        timestamp: new Date().toISOString()
    };
}

async function handleGetStudioFeatures() {
    return {
        features: [
            { name: 'audio_overview', available: !!querySelector(SELECTORS.audioOverviewBtn) },
            { name: 'video_overview', available: !!querySelector(SELECTORS.videoOverviewBtn) },
            { name: 'mind_map', available: !!querySelector(SELECTORS.mindMapBtn) },
            { name: 'report', available: !!querySelector(SELECTORS.reportsBtn) },
            { name: 'flashcards', available: !!querySelector(SELECTORS.flashcardsBtn) },
            { name: 'quiz', available: !!querySelector(SELECTORS.quizBtn) },
            { name: 'infographic', available: !!querySelector(SELECTORS.infographicBtn) },
            { name: 'slide_deck', available: !!querySelector(SELECTORS.slideDeckBtn) },
            { name: 'data_table', available: !!querySelector(SELECTORS.dataTableBtn) }
        ],
        timestamp: new Date().toISOString()
    };
}

async function handleDownloadContent(contentType) {
    const downloadBtn = querySelector(SELECTORS.downloadBtn);
    if (downloadBtn) {
        clickElement(downloadBtn);
        return { success: true, contentType, timestamp: new Date().toISOString() };
    }
    return { success: false, error: 'Download button not found', timestamp: new Date().toISOString() };
}

async function handleCopyContent() {
    const copyBtn = querySelector(SELECTORS.copyBtn);
    if (copyBtn) {
        clickElement(copyBtn);
        return { success: true, timestamp: new Date().toISOString() };
    }
    return { success: false, error: 'Copy button not found', timestamp: new Date().toISOString() };
}

// =====================================================
// MESSAGE ROUTER
// =====================================================

const COMMAND_HANDLERS = {
    // Notebook
    'list_notebooks': () => handleListNotebooks(),
    'create_notebook': (r) => handleCreateNotebook(r.name),
    'get_notebook_details': () => handleGetNotebookDetails(),

    // Sources
    'list_sources': () => handleListSources(),
    'add_source_url': (r) => handleAddSourceUrl(r.url),
    'add_source_text': (r) => handleAddSourceText(r.text, r.title),

    // Chat
    'query_notebook': (r) => handleQueryNotebook(r.notebookId, r.query),
    'generate_summary': () => handleQueryNotebook(null, 'Provide a comprehensive summary of all sources.'),
    'ask_followup': (r) => handleQueryNotebook(null, r.query),

    // STUDIO - Audio
    'generate_audio_overview': (r) => handleGenerateAudioOverview({ format: r.format, language: r.language, length: r.length, focus: r.focus }),
    'get_audio_status': () => handleGetAudioStatus(),

    // STUDIO - Video
    'generate_video_overview': (r) => handleGenerateVideoOverview({ format: r.format, language: r.language, visualStyle: r.visualStyle, focus: r.focus }),
    'get_video_status': () => handleGetVideoStatus(),

    // STUDIO - Mind Map
    'generate_mind_map': () => handleGenerateMindMap(),

    // STUDIO - Reports
    'generate_report': (r) => handleGenerateReport({ reportType: r.reportType, customPrompt: r.customPrompt }),
    'get_report': () => handleGetReport(),

    // STUDIO - Flashcards
    'generate_flashcards': (r) => handleGenerateFlashcards({ count: r.count, difficulty: r.difficulty, topic: r.topic }),
    'get_flashcards': () => handleGetFlashcards(),

    // STUDIO - Quiz
    'generate_quiz': (r) => handleGenerateQuiz({ questionCount: r.questionCount, difficulty: r.difficulty, topic: r.topic }),
    'get_quiz': () => handleGetQuiz(),
    'answer_quiz': (r) => handleAnswerQuiz(r.questionId, r.answerId),

    // STUDIO - Infographic
    'generate_infographic': (r) => handleGenerateInfographic({ language: r.language, orientation: r.orientation, detailLevel: r.detailLevel, description: r.description }),
    'get_infographic': () => handleGetInfographic(),

    // STUDIO - Slide Deck
    'generate_slide_deck': (r) => handleGenerateSlideDeck({ format: r.format, language: r.language, length: r.length, description: r.description }),
    'get_slide_deck': () => handleGetSlideDeck(),

    // STUDIO - Data Table
    'generate_data_table': (r) => handleGenerateDataTable({ language: r.language, description: r.description }),
    'get_data_table': () => handleGetDataTable(),

    // Export
    'export_notebook_markdown': () => handleExportMarkdown(),
    'export_notebook_json': () => handleExportJson(),
    'get_conversation_history': () => handleGetConversationHistory(),

    // Utilities
    'get_status': () => handleGetStatus(),
    'get_studio_features': () => handleGetStudioFeatures(),
    'download_content': (r) => handleDownloadContent(r.contentType),
    'copy_content': () => handleCopyContent()
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    log.info('Command:', request.command);
    const handler = COMMAND_HANDLERS[request.command];

    if (handler) {
        handler(request)
            .then(result => { log.info('✓', request.command); sendResponse(result); })
            .catch(err => { log.error('✗', request.command, err.message); sendResponse({ error: err.message }); });
        return true;
    }

    sendResponse({ error: `Unknown: ${request.command}` });
    return true;
});

log.info(`✓ v3.1 Ready | ${Object.keys(COMMAND_HANDLERS).length} commands`);
log.info('Studio: Audio, Video, Mind Map, Reports, Flashcards, Quiz, Infographic, Slides, Data Table');
