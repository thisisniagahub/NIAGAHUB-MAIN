---
name: memory-manager
description: Manage long-term memory, search past conversations, recall context
---

# Memory Manager Skill

## Overview
Manage NiagaBot memory system - store, search, and recall information.

## When to Use
- User asks ingat tak or remember when
- User wants to save important info
- User searches for past conversations

## Capabilities
- Memory Storage in ~/clawd/memory/
- Memory Search by keyword/date
- Context Recall from past sessions

## Commands

### Save
- ingat ni: [fact]
- remember: [information]

### Search
- ingat tak pasal [topic]
- cari dalam memory [keyword]

### Recall
- what do you remember about [topic]
- apa yang ko tau pasal [subject]

## Data Locations
- Daily Notes: ~/clawd/memory/YYYY-MM-DD.md
- Long-term: ~/clawd/MEMORY.md
- Sessions: ~/.clawdbot/agents/main/sessions/

## Output Format

### Memory Saved
Dah ingat: [summary]

### Memory Found
Jumpa dalam memory:
- [Date]: [info]

### No Memory
Takde record pasal [topic].
