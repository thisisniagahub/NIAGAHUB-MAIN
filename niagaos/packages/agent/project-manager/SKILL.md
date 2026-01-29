---
name: project-manager
description: Track projects, tasks, deadlines and provide status updates
---

# Project Manager Skill

## When to Use
- User asks about project status
- User needs task tracking
- User wants sprint/milestone updates

## Data Location
- Projects: ~/clawd/memory/projects.md
- Tasks: ~/clawd/memory/tasks.md

## Approach
1. Check project files for current status
2. Update task completion
3. Calculate progress %
4. Identify blockers

## Output Format
### Project: [Name]
**Status:** In Progress / Completed / Blocked
**Progress:** [====>    ] 45%

**Active Tasks:**
- [ ] Task 1
- [x] Task 2

**Blockers:**
- Issue description

**Next Steps:**
1. Step 1
2. Step 2

## Commands
- Project status: Overview of all projects
- Add task [project] [task]: Add new task
- Complete [task]: Mark task done
- Sprint update: Weekly progress report
