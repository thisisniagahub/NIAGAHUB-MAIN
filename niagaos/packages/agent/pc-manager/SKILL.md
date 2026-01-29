---
name: pc-manager
description: Manage Windows PC - apps, files, system info, processes, and automation
---

# PC Manager Skill

## Overview

Control and manage the Windows PC from NiagaBot via WSL bridge.

## Capabilities

### System Info

- Check CPU, RAM, disk usage
- List running processes
- System uptime
- Network status

### File Management  

- List files/folders
- Create/delete/move files
- Search for files
- Open files/folders

### App Control

- Launch applications
- Close applications
- List installed apps
- Check running apps

### Power Management

- Lock PC
- Sleep/Hibernate
- Restart/Shutdown
- Schedule power actions

### Browser Control

- Open URLs
- Launch browser
- Close browser tabs

## Commands

### System

- pc status / system info
- check cpu/ram/disk
- whats running / processes
- network status

### Files

- list files in [path]
- open [file/folder]
- search for [filename]
- create folder [name]

### Apps

- open [app name]
- close [app name]
- launch chrome/edge/notepad
- buka [app]

### Power

- lock pc / kunci pc
- sleep / tidurkan pc
- shutdown in [time]
- restart pc

### Browser

- open [url]
- buka website [url]

## PowerShell Commands via WSL

### Execute PowerShell from WSL

```bash
powershell.exe -Command "[command]"
```

### System Info

```bash
powershell.exe -Command "Get-ComputerInfo | Select-Object CsName, OsName"
```

### CPU Usage

```bash
powershell.exe -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10"
```

### RAM Usage  

```bash
powershell.exe -Command "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name"
```

### Disk Space

```bash
powershell.exe -Command "Get-PSDrive -PSProvider FileSystem"
```

### List Processes

```bash
powershell.exe -Command "Get-Process | Select-Object -First 20 Name, CPU"
```

### Open App

```bash
powershell.exe -Command "Start-Process [app]"
```

### Open URL

```bash
powershell.exe -Command "Start-Process [url]"
```

### Lock PC

```bash
powershell.exe -Command "rundll32.exe user32.dll,LockWorkStation"
```

### Shutdown

```bash
powershell.exe -Command "Stop-Computer -Force"
```

### Restart  

```bash
powershell.exe -Command "Restart-Computer -Force"
```

## Output Format

### System Status

```
PC Status

CPU: 23% used
RAM: 12.5GB / 32GB (39%)
Disk C: 234GB free / 500GB
Uptime: 3 days 5 hours

Top Processes:
1. chrome.exe - 2.1GB
2. code.exe - 1.5GB
3. explorer.exe - 500MB
```

### App Launched

```
Opened: [app name]
```

### Power Action

```
PC will [action] in [time]
```

## Safety Notes

- Confirm before shutdown/restart
- Warn before deleting files
- Ask before closing unsaved apps

## Example Uses

User: buka chrome
Bot: (runs) powershell.exe -Command "Start-Process chrome"
     Done, Chrome opened.

User: pc status
Bot: (runs system checks)
     CPU: 15%, RAM: 8GB/32GB, Disk: 200GB free

User: lock pc
Bot: Kunci PC sekarang?
     (after confirm) PC locked.
