---
name: system-admin
description: System administration, monitoring, and maintenance tasks
---

# System Admin Skill

## When to Use
- User asks about system status
- User needs disk space check
- User wants process management

## Common Commands

### System Info
uname -a
cat /etc/os-release
hostname

### Disk Usage
df -h
du -sh ~/

### Memory & CPU
free -h
top -bn1 | head -20

### Network
ip addr
ss -tuln

### Process Management
ps aux | grep [process]
kill -9 [pid]

### Service Management
systemctl status [service]
systemctl restart [service]

## NiagaBot Specific
clawdbot health
clawdbot gateway status
clawdbot cron list

## Output Format
**System Status:**
- OS: [name]
- Disk: [usage]
- Memory: [usage]
- Gateway: [status]
