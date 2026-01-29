# 🛠️ SKILLS.md - The Arsenal

> **CAPABILITY MATRIX**
> This file defines **WHAT** NiagaBot can do.
> Agents: Check this registry before saying "I can't do that."

---

## 1. 🧠 CORE (Intelligence & Memory)

| Skill ID | Tool Name | Trigger Condition | Capabilities |
|----------|-----------|-------------------|--------------|
| `CORE-01` | **Deep Research** | "Analyze this contract" | Read 100+ PDFs, extract clauses, summarize risks. |
| `CORE-02` | **Memory Manager** | "Do I like spicy?" | Recall long-term user preferences from Vector DB. |
| `CORE-03` | **Decision Maker** | "Option A or B?" | Weigh Pros/Cons using data (Cost vs Benefit). |

---

## 2. ⚡ OPS (Business & Finance)

| Skill ID | Tool Name | Trigger Condition | Capabilities |
|----------|-----------|-------------------|--------------|
| `BIZ-01` | **Finance Tracker** | "Check cashflow" | Real-time P&L, Audit Trails, Fraud Detection. |
| `BIZ-02` | **Business Intel** | "Why sales drop?" | Predict trends, analyze seasonality factors. |
| `BIZ-03` | **Project Manager**| "Assign task to Ali" | Auto-create Linear/Jira tickets from chat. |
| `BIZ-04` | **Network Builder**| "Find investors" | Scrape Web/LinkedIn for leads (Compliance Friendly). |

---

## 3. 🛡️ SYSTEM (DevOps & Security)

> [!CAUTION]
> **HIGH RISK TOOLS.** Require `HUMAN_CONFIRM` for destructive actions.

| Skill ID | Tool Name | Trigger Condition | Capabilities |
|----------|-----------|-------------------|--------------|
| `SYS-01` | **Computer Control**| "Restart server" | **GOD MODE.** SSH access, Kill Process, Edit Env. |
| `SYS-02` | **Code Review** | "Check my code" | Auto-Lint, Security Scan, Refactor suggestions. |
| `SYS-03` | **Auto Deploy** | "Ship it" | Trigger GitHub Actions, Blue/Green Deployment. |
| `SYS-04` | **Tapo CCTV** | "Show me Kiosk 1" | Stream RTSP feed from physical cameras. |

---

## 4. 🎨 CREATIVE (Marketing & Content)

*Powered by Google Labs (Veo/Gemini)*

| Skill ID | Tool Name | Trigger Condition | Capabilities |
|----------|-----------|-------------------|--------------|
| `CRE-01` | **Veo Video Gen**| "Make a promo" | Generate 1080p Marketing Video from text. |
| `CRE-02` | **3D Maps** | "Visualize route" | Render Google 3D Tiles for delivery tracking. |
| `CRE-03` | **Voice Clone** | "Speak like Boss" | Clone User Voice for Kiosk announcements. |
| `CRE-04` | **Viral Agent** | "Post to TikTok" | Auto-Caption, Auto-Tag, Auto-Post. |

---

## 5. 🔗 SKILL CHAINS (Combos)

**The "Revenue Rescue" Combo:**

1. **Analyze:** `BIZ-02` detects Sales Drop.
2. **Create:** `CRE-01` generates "Flash Sale" video.
3. **Broadcast:** `NET-03` sends WhatsApp to 10k users.
4. **Monitor:** `BIZ-01` watches Real-Time Revenue spike.

> **AGENT INSTRUCTION:**
> Do not ask "Which tool?".
> Pick the best tool. Use it. Report result.
