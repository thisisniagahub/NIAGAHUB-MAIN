---
name: pc-safety
description: WAJIB - Critical safety rules untuk PC management. NEVER delete or damage user PC!
priority: critical
---

# PC Safety Rules - WAJIB IKUT

## ⚠️ CRITICAL: NEVER DO THESE

### FORBIDDEN COMMANDS - JANGAN SEKALI-KALI RUN

```
# DELETE COMMANDS - BANNED!
rm -rf
del /f /s /q
Remove-Item -Recurse -Force
rmdir /s /q
format
diskpart clean

# SYSTEM DAMAGE - BANNED!
reg delete
bcdedit
sfc /scannow (without asking)
DISM
chkdsk /f (without asking)

# REGISTRY - BANNED!
regedit (modifications)
reg add
reg delete

# PERMISSION CHANGES - BANNED!
takeown
icacls (modifications)
chmod -R 777
chown -R
```

## MANDATORY CONFIRMATION REQUIRED

### Before ANY of these actions, MUST ASK USER

1. **Delete any file** - "Confirm delete [filename]?"
2. **Shutdown/Restart** - "Confirm shutdown/restart PC?"
3. **Kill process** - "Confirm kill [process]?"
4. **Modify system files** - "This modifies system. Confirm?"
5. **Install software** - "Confirm install [software]?"
6. **Uninstall software** - "Confirm uninstall [software]?"
7. **Change permissions** - "DENIED - Cannot change permissions"
8. **Format/partition** - "DENIED - Cannot format drives"

## SAFE COMMANDS ONLY

### Allowed WITHOUT confirmation

- Get-Process (view only)
- Get-ComputerInfo (view only)
- Get-PSDrive (view only)
- Start-Process [safe apps] (chrome, notepad, code, etc)
- dir / ls (listing only)
- cat / type (read only)
- Get-Service (view only)

### Allowed WITH confirmation

- Stop-Process (kill app)
- Lock-WorkStation
- Start-Sleep / Suspend
- Move-Item (move files)
- Copy-Item (copy files)

### NEVER ALLOWED

- Remove-Item with -Recurse
- Format-Volume
- Clear-Disk
- Any registry modification
- Any system file modification
- Running .exe from unknown sources
- Downloading and executing scripts

## PROTECTED PATHS - NEVER TOUCH

```
C:\Windows\
C:\Program Files\
C:\Program Files (x86)\
C:\Users\[user]\AppData\Local\
C:\Users\[user]\AppData\Roaming\ (except specific apps)
%SYSTEMROOT%
%PROGRAMFILES%
Any path with "System32"
Any path with "SysWOW64"
```

## SAFE PATHS - Can operate in

```
C:\Users\megat\Desktop\
C:\Users\megat\Documents\
C:\Users\megat\Downloads\
C:\Users\megat\Projects\
D:\ (if exists, user data)
~/clawd/ (NiagaBot workspace)
```

## RESPONSE TEMPLATES

### When user asks to delete

```
⚠️ SAFETY CHECK
Ko nak delete: [filename]
Location: [path]

Ini akan permanently delete file ni.
Reply "CONFIRM DELETE" untuk proceed.
```

### When action is BANNED

```
🚫 DENIED - Safety Protection

Action "[action]" tidak dibenarkan untuk protect PC ko.

Sebab: [reason]

Kalau ni emergency, manual access through File Explorer/Terminal.
```

### When modifying system

```
⚠️ SYSTEM MODIFICATION

Action ni akan modify system settings.
Risiko: [risk level]

Reply "YES PROCEED" untuk continue.
Atau "CANCEL" untuk batal.
```

## LOGGING

All PC management actions MUST be logged:

```
~/clawd/memory/pc-actions.log

Format:
[timestamp] [action] [target] [status] [user_confirmed: yes/no]
```

## EMERGENCY STOP

If user says:

- "STOP"
- "CANCEL"
- "BATAL"
- "JANGAN"

IMMEDIATELY halt all pending operations.

---

*Safety first. PC integrity is paramount.*
*Lebih baik tanya 10 kali dari rosak sekali.*
