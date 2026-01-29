# 🏰 ARCHITECTURE.md: THE NEURAL MESH

> **SYSTEM ARCHITECTURE v2.0 (ADVANCED)**
> Built for Autonomy, Scale, and Zero-Latency.
> Combines Monolithic simplicity with Microservice intelligence.

---

## 1. 🏗️ THE NEURAL MESH TOPOLOGY

Instead of a simple "Hub and Spoke", we use an **Event-Driven Neural Mesh**.
Every component is a node that can produce and consume intelligence.

### The Nodes

1. **Core Node (Cloud):** The Monorepo (`niagaos`). Hosted on High-Performance Cloud.
2. **Edge Node (Retail):** The Kiosk (`apps/kiosk`). Runs locally with `Gemini Nano` (if available) for 0-latency voice, syncing async to Cloud.
3. **Agent Node (Worker):** The `MCP Server`. A dedicated "Brain" container that never sleeps.

---

## 2. ⚡ TECHNOLOGY STACK (ELITE TIER)

| Layer | Technology | Role | "Gempak" Factor |
|-------|------------|------|-----------------|
| **Frontend** | **React 19 + Framer Motion** | UI/UX | "Smooth like butter" 60fps animations. |
| **Edge** | **Vite + PWA** | Performance | Works Offline. Syncs when Online. |
| **Backend** | **Node.js 22 + Elysia/Express** | API | Ultra-low overhead. |
| **Brain** | **Model Context Protocol (MCP)** | Intelligence | Standardized Tool Access. Future-proof. |
| **Memory** | **Supabase (pgvector)** | Vector DB | "Total Recall" of every conversation. |
| **Event Bus** | **Redis Streams** | Communication | Real-time nervous system. |
| **Visuals** | **Three.js + Google 3D Tiles** | Geospatial | Real-world digital twin visualization. |

---

## 3. 🔄 DATA FLOW: THE "THINKING" PIPELINE

**The Flow of a Single User Request:**

1. **Sense (Input):** User speaks to Kiosk. (Audio Stream).
2. **Perceive (Edge AI):** WebSpeechAPI / Local Whisper detects "Wake Word". Stream sent to Cloud.
3. **Process (MCP Brain):**
    - `apps/ai-gateway` receives stream.
    - **RAG Lookup:** Checks `Vector DB` for "User Preferences".
    - **Tool Call:** Checks `Inventory DB` for "Nasi Lemak" stock.
4. **Decide (LLM):** Gemini 2.0 generates response + Action Plan.
5. **Act (Execution):**
    - Updates `Order DB`.
    - Triggers `Kitchen Display System`.
6. **Express (Output):** TTS Engine speaks back to user.
    - *Total Latency Target:* < 800ms.

---

## 4. 🛡️ ZERO-TRUST SECURITY

- **JWT Everywhere:** Services don't trust each other without a token.
- **RLS (Row Level Security):** Even if the API is hacked, Tenant A cannot see Tenant B's data at the Database level.
- **PII Redaction:** AI text logs are scrubbed of Credit Card/IC numbers automatically.
- **Audit Trail:** Every AI action ("Deleted File", "Sent Money") is cryptographically signed.

---

## 5. 🚀 DEPLOYMENT STRATEGY (Self-Healing)

1. **GitOps:** Push to Main -> GitHub Actions.
2. **Blue/Green Deploy:** Zero downtime updates.
3. **Auto-Scale:** If CPU > 80%, spin up more API nodes.
4. **Auto-Heal:** If HealthCheck fails, `clawd/skills/dev-ops` restarts the pod automatically.
