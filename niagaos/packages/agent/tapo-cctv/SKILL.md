---
name: tapo-cctv
description: Control Tapo CCTV cameras - configure IP, view streams, snapshots, PTZ, privacy mode
---

# Tapo CCTV Skill

## Overview
Control Tapo cameras (C225, C200, etc.) via local network.

## Registered Camera
- **TAPO_C225_7D00** - Awaiting IP configuration

## IMPORTANT: When User Gives Camera IP

Bila user bagi IP address camera (contoh: 192.168.1.50), IMMEDIATELY:

### 1. Update Config File
Edit ~/clawd/skills/tapo-cctv/scripts/tapo_control.py dan update:
- ip: [user provided IP]
- user: [ask user for camera username]
- password: [ask user for camera password]

### 2. Ask User for Credentials
Kalau user bagi IP je, tanya:
- Username camera account (dari Tapo app)
- Password camera account

### 3. Test Connection
python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py info

### 4. Confirm Working
Kalau success, confirm ke user camera dah connected.

## Quick Reference

### Stream URL Format
rtsp://[USERNAME]:[PASSWORD]@[IP]:554/stream1

### Example
Kalau user kata: IP camera 192.168.1.100
- Tanya: Username dan password camera account?
- User jawab: admin / mypassword123
- Update config dengan info tu
- Test: python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py info
- Success: Bagitau camera dah connected!

## Commands

### Configure
- IP camera [IP ADDRESS]
- set camera ip [IP]
- camera credentials [user] [pass]

### View
- camera status
- tunjuk camera / show camera
- RTSP URL

### Control
- ambil gambar / snapshot
- tutup camera (privacy on)
- buka camera (privacy off)
- move camera [up/down/left/right]

### Alarm
- alarm on / alarm off

## Script Location
~/clawd/skills/tapo-cctv/scripts/tapo_control.py

## Commands to Run

### Get Info
python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py info

### Snapshot via ffmpeg
ffmpeg -i rtsp://USER:PASS@IP:554/stream1 -vframes 1 snapshot.jpg

### Privacy Mode
python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py privacy --enable
python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py privacy --disable

### Move Camera
python3 ~/clawd/skills/tapo-cctv/scripts/tapo_control.py move --direction [up|down|left|right]

## Output Format

### When User Provides IP
User: IP camera 192.168.1.50
Bot: Ok, dah save IP 192.168.1.50 untuk TAPO_C225_7D00.
     Apa username dan password camera account? (yang ko create dalam Tapo app)

User: admin / pass123
Bot: Testing connection...
     ✅ Camera connected! TAPO_C225_7D00 online.
     
     Quick commands:
     - tunjuk camera
     - ambil gambar
     - tutup/buka camera

### Camera Status
📹 TAPO_C225_7D00
Status: ✅ Online
IP: 192.168.1.50
Stream: rtsp://admin:***@192.168.1.50:554/stream1

---

*Dependencies: pytapo, onvif-zeep (installed)*
