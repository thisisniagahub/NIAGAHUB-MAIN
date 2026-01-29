---
name: usage-tracker
description: Track API usage per account, monitor quotas, and report statistics
priority: high
---

# Usage Tracker Skill

## Overview

Track and monitor API usage across all OAuth accounts to manage quotas efficiently.

## When to Use

- User asks "berapa usage"
- User asks "quota status"
- User asks "account mana paling banyak guna"
- Automatic daily summary

## Data Files

### Usage Log

~/clawd/memory/usage-log.json

Structure:

```json
{
  "accounts": {
    "bothugdd@gmail.com": {
      "requests_today": 45,
      "requests_total": 1234,
      "last_used": "2026-01-28T12:30:00Z",
      "errors": 2
    },
    "thisisniagabot@gmail.com": {
      "requests_today": 12,
      "requests_total": 567,
      "last_used": "2026-01-28T12:35:00Z",
      "errors": 0
    }
  },
  "daily_reset": "2026-01-28T00:00:00Z"
}
```

### Check Usage Command

```bash
clawdbot models status
```

## Google Cloud Console URLs

### Per Account Usage Dashboard

```
https://console.cloud.google.com/gemini-code-assist/overview
```

### API Quotas

```
https://console.cloud.google.com/iam-admin/quotas
```

## Commands

### Check Status

- usage status
- quota berapa
- check usage
- account status

### Per Account

- usage [email]
- berapa guna [email]

### Summary

- daily usage
- usage summary
- total requests

## Quota Limits (Estimated)

| Plan | Daily Limit | Per Minute |
|------|-------------|------------|
| Consumer (OAuth) | ~1000 | ~20 |
| Enterprise | Higher | Higher |

## Response Format

### Usage Summary

```
📊 Usage Summary (Today)

Account                      | Requests | %Used
-----------------------------|----------|------
bothugdd@gmail.com          |    45    |  4.5%
thisisniagabot@gmail.com    |    12    |  1.2%
-----------------------------|----------|------
Total                        |    57    |  2.9%

Daily Quota: ~2000 (2 accounts)
Rotation: Active ✅
```

### Single Account

```
📊 bothugdd@gmail.com

Today: 45 requests (4.5%)
Total: 1,234 requests
Last Used: 5 min ago
Errors: 2
Status: Active ✅
```

### Low Quota Warning

```
⚠️ Quota Warning!

Account bothugdd@gmail.com at 85% usage.
Switching to backup accounts.

Remaining accounts:
- thisisniagabot@gmail.com (12% used)
```

## Auto-Rotation Behavior

Clawdbot automatically:

1. Round-robins between accounts
2. Switches when rate limited
3. Retries with next account

## Track Usage Manually

### From Gateway Logs

```bash
grep "model:" /tmp/clawdbot/clawdbot-*.log | wc -l
```

### Per Account

```bash
grep "bothugdd" /tmp/clawdbot/clawdbot-*.log | wc -l
```

## Daily Reset

Usage counters reset at midnight local time (UTC+8).

## Integration

### Heartbeat Check

Add to cron for periodic usage check:

```
0 */6 * * * clawdbot message send --channel whatsapp --target "+601169416694" --message "$(clawdbot models status | grep -A5 'OAuth/token')"
```
