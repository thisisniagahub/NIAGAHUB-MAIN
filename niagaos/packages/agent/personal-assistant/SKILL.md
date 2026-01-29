---
name: personal-assistant
description: Daily briefings, task management, smart reminders
---

# Personal Assistant Skill

## Overview
Manage your day with tasks, briefings, and proactive suggestions.

## When to Use
- User asks for daily briefing
- User mentions tasks, todos, reminders
- User asks what to focus on
- Morning/evening routines

## Capabilities
- Daily Briefing (weather, tasks, calendar)
- Task Management (add, complete, prioritize)
- Smart Reminders (time-based, follow-ups)
- Proactive Suggestions

## Commands

### Briefing
- morning briefing
- apa plan hari ini
- evening summary

### Tasks
- add task: [description]
- remind me to [action] [when]
- whats pending / apa pending
- done with [task]
- show urgent tasks

### Focus
- what should I focus on
- prioritize my day
- aku nak buat apa dulu

## Data Storage
~/clawd/memory/tasks.json

## Output Format

### Morning Briefing
Selamat Pagi!
Cuaca: [weather]
Hari Ini:
- [ ] Task 1
- [ ] Task 2

### Task Added
Task added: [description]
Due: [date]
Priority: [level]
