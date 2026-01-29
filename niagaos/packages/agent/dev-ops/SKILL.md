---
name: dev-ops
description: DevOps automation - deployment, monitoring, CI/CD, server management, and infrastructure
---

# DevOps Skill

## Overview
Handle all DevOps tasks including deployments, server monitoring, CI/CD pipelines, and infrastructure management.

## When to Use
- User asks about deployment status
- User wants to deploy/rollback
- User needs server health check
- User asks about CI/CD
- User mentions production/staging

## Capabilities

### 1. Deployment Management
- Deploy to staging/production
- Rollback to previous version
- Blue-green deployments
- Feature flags

### 2. Server Monitoring
- Health checks
- Resource usage (CPU/RAM/Disk)
- Error log analysis
- Uptime monitoring

### 3. CI/CD Integration
- GitHub Actions status
- Build logs
- Test results
- Deployment history

### 4. Infrastructure
- Vercel/Railway/Fly.io management
- Database status
- CDN cache management
- SSL certificate status

## Commands

### Deploy
- deploy [project] to [staging/production]
- rollback [project] to [version]
- deployment status [project]
- deploy preview for PR #[number]

### Monitor
- server health / kesihatan server
- check [project] status
- show errors from last [time]
- resource usage

### CI/CD
- build status [project]
- run tests for [branch]
- workflow status
- last deployment

## Integration Points

### GitHub Actions
gh workflow list
gh run list --limit 5
gh run view [run-id]

### Vercel
vercel --prod
vercel logs [deployment-url]
vercel env ls

### Railway
railway status
railway logs
railway deploy

### Docker
docker ps
docker logs [container]
docker stats

## Output Format

### Deployment Status
## 🚀 Deployment Status: [Project]

**Environment:** Production
**Version:** v2.3.1
**Deployed:** 2h ago by @bo
**Status:** ✅ Healthy

**Instances:** 3/3 running
**Memory:** 245MB avg
**CPU:** 12% avg

**Recent Deploys:**
| Version | Time | Status |
|---------|------|--------|
| v2.3.1 | 2h ago | ✅ |
| v2.3.0 | 1d ago | ✅ |
| v2.2.9 | 3d ago | ✅ |

---

### Health Check
## 🏥 Server Health

**Overall:** ✅ Healthy

| Service | Status | Latency |
|---------|--------|---------|
| API | ✅ | 45ms |
| Database | ✅ | 12ms |
| Redis | ✅ | 3ms |
| CDN | ✅ | 8ms |

**Alerts:** None
**Last Incident:** 5 days ago

---

*Requires access to deployment platforms*
