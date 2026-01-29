---
name: web-search
description: Web search via browser automation - no API needed
---

# Web Search Skill (Browser-Based)

## Overview

Perform web searches using browser automation. No API key required - uses actual browser.

## When to Use

- User asks to search for something
- User wants latest information
- User asks "cari" or "search"
- Need real-time data

## How It Works

Uses PowerShell/browser to:

1. Open search URL
2. Scrape results (if needed)
3. Return to user

## Commands

### Search

- search [query]
- cari [query]
- google [query]
- find [query]
- lookup [query]

### Specific Sites

- search reddit [query]
- search youtube [query]
- search github [query]

## Browser Commands

### Open Google Search

```bash
powershell.exe -Command "Start-Process 'https://www.google.com/search?q=[QUERY]'"
```

### Open DuckDuckGo (Privacy)

```bash
powershell.exe -Command "Start-Process 'https://duckduckgo.com/?q=[QUERY]'"
```

### YouTube Search

```bash
powershell.exe -Command "Start-Process 'https://www.youtube.com/results?search_query=[QUERY]'"
```

### Reddit Search

```bash
powershell.exe -Command "Start-Process 'https://www.reddit.com/search/?q=[QUERY]'"
```

### GitHub Search

```bash
powershell.exe -Command "Start-Process 'https://github.com/search?q=[QUERY]'"
```

### Google News

```bash
powershell.exe -Command "Start-Process 'https://news.google.com/search?q=[QUERY]'"
```

## Advanced: Fetch Results via curl

### Get Search Results (text only)

```bash
curl -s "https://html.duckduckgo.com/html/?q=[QUERY]" | grep -oP '(?<=<a class="result__a" href=").*?(?=")'
```

### Get Page Content

```bash
curl -s "[URL]" | html2text
```

## Response Format

### Search Initiated

```
🔍 Searching: [query]
Opening browser dengan results...
```

### With Results Summary

```
🔍 Search Results: [query]

Top results:
1. [Title] - [URL]
2. [Title] - [URL]
3. [Title] - [URL]

Browser opened dengan full results.
```

## Integration with Clawdbot Browser

Clawdbot has built-in browser at port 18791:

```bash
# Use clawdbot browser for automation
clawdbot browser open "https://google.com/search?q=[QUERY]"
clawdbot browser screenshot
```

## Example Flow

User: cari cara install docker
NiagaBot:

1. Opens: <https://www.google.com/search?q=cara+install+docker>
2. Reports: "Dah buka Google dengan search results. Check browser."

User: search github niagahub
NiagaBot:

1. Opens: <https://github.com/search?q=niagahub>
2. Reports: "GitHub search opened."

## Notes

- No API key required
- Uses user's default browser
- Real-time results
- Respects browser settings/cookies
