# Product Requirements Document (PRD) - NiagaOS Platform

## 1. Document Metadata

- **Product Name:** NiagaOS (Unified Operating System)
- **Version:** 5.0.0 (The "Singularity" Release)
- **Author:** NiagaHub AI Team
- **Status:** 🟢 **APPROVED FOR BUILD**
- **Last Updated:** 2026-01-29

---

## 2. Executive Summary

**NiagaOS** is the convergence of 4 distinct legacy projects (`clawd`, `startupos`, `brand-os`, `superapp`) into a single, specialized **"Self-Driving Business" Operating System**.

It is not just a dashboard. It is an **Autonomous Neural Mesh** that integrates:

1. **Retail Operations** (Kiosk/POS)
2. **Business Intelligence** (ERP/Finance)
3. **Agentic AI** (Proactive Workforce)
4. **Creative Studio** (Marketing Automation)

**The Promise:** A founder can run a RM10M/year business with 0 human back-office staff.

---

## 3. Problem Statement

**Current State:**

- F&B chains run on fragmented tools (POS for sales, Xero for accounts, WhatsApp for comms).
- Founders are "Data Janitors", manually moving data between CSVs.
- AI is a "Chatbot" toy, not a "Coworker" that does actual work.

**The NiagaOS Solution:**
A unified monolith where **Sales** instantly triggers **Inventory**, which triggers **Finance**, which triggers **Marketing**—all orchestrated by an AI that "Talks" (Voice) and "Sees" (Computer Vision).

---

## 4. User Personas

### A. Alex - The "Hands-Off" Founder

- **Role:** Owns 10 Kiosks. Wants freedom.
- **Goal:** "Check business health while driving."
- **Interaction:** Uses **Voice Mode** (Earbuds) to approve large decisions. "NiagaBot, approve the supplier payment."

### B. Nina - The AI Kiosk Agent

- **Role:** Front-line sales (Virtual Human).
- **Goal:** Upsell customers aggressively but politely.
- **Personality:** "Manglish", fun, high-energy. "Boss, tambah telur mata? Sedap gila!"

### C. System - The "DevOps" Sentinel

- **Role:** Self-healing infrastructure.
- **Goal:** 99.99% Uptime.
- **Action:** detect_crash -> restart_pod -> notify_admin.

---

## 5. Functional Requirements (The Core)

| ID | Module | Feature | Trigger | Expected Outcome |
|----|--------|---------|---------|------------------|
| **FR-01** | **Kiosk** | Voice Order | User speaks "Nasi Lemak satu" | AI recognizes intent, adds to cart, and suggests addon ("Sambal lebih?"). |
| **FR-02** | **ERP** | Auto-Restock | Stock < 10% | AI crawls supplier web, compares price, drafts PO for approval. |
| **FR-03** | **Finance** | Receipt OCR | Upload image | AI extracts Total, Date, Vendor -> Auto-Match with Bank Transaction. |
| **FR-04** | **Marketing** | Auto-Video | New Product Launch | AI generates 15s Teaser (Veo) + Caption -> Posts to TikTok. |
| **FR-05** | **Ops** | Staff Watch | CCTV Detection (Late) | AI logs timestamp -> deduction advice in Payroll (Draft). |

---

## 6. User Journeys (End-to-End)

### Happy Path: The "Zero-Click" Morning

1. **08:00 AM:** Founder wakes up. Phone notification: "Daily Briefing Ready."
2. **08:05 AM:** Founder taps notification. AI Voice Summary: "Sales yesterday RM4,500. 1 Staff late. Supplier Ali requesting payment RM500."
3. **08:06 AM:** Founder says: "Approve Ali. Warn the staff."
4. **08:07 AM:** System executes payment (via Bank API Integration) and sends WhatsApp warning to staff. **Done.**

### Failure Path: Network Down

1. **Scenario:** Kiosk internet cut off.
2. **System Action:** Switch to **Edge Mode**. Voice processing runs locally (Gemini Nano).
3. **Recovery:** Data syncs to Cloud when connection restores. No sales lost.

---

## 7. Technical Specifications

### A. The Stack (Elite Tier)

- **Frontend:** React 19 + Tailwind v4 + Framer Motion (60fps UI).
- **Backend:** Node.js 22 (Hono/Express) + Redis (Cache).
- **Brain:** Google Gemini 2.0 Pro (Thinking) + Flash (Speed).
- **Database:** Supabase (PostgreSQL + Vector Embeddings).

### B. Performance Targets

- **Voice Latency:** < 500ms (Human-level conversation).
- **Dashboard Load:** < 100ms (Optimistic UI).
- **AI Reasoning:** < 2s for complex financial analysis.

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| AI Hallucination | High (Ordering wrong stock) | **Sequential Thinking Protocol**. AI must "Double Check" Logic before drafting PO. |
| API Cost | Medium | **Model Routing**. Use Flash for chat, Pro for Strategy. Cache everything. |
| Privacy | High | **PII Redaction**. Scrub Customer IC/Phone from AI Logs. |

---

## 9. Success Metrics (KPIs)

- [ ] **Autonomy Level:** 80% of daily ops tasks handled without human input.
- [ ] **Speed:** Ordering via Voice Kiosk is 2x faster than Touch UI.
- [ ] **Revenue:** Upsell Engine increases Average Order Value (AOV) by 15%.

---

> **VERDICT:** This document serves as the **SINGLE SOURCE OF TRUTH** for the engineering build.
> *Approved by Antigravity AI, 2026*
