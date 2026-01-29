# 🔄 ANTIGRAVITY_WORKFLOWS.md: STANDARD PROCEDURES

> **OPERATIONAL PLAYBOOK**
> How to execute tasks efficiently without breaking the system.
> Follow these steps for reliable results.

---

## 🟢 WORKFLOW 1: THE "ZERO TO ONE" (New Project/Module)

**When:** Building a new feature (e.g., "Add 3D Maps").

1. **🔍 DISCOVERY PHASE**
    * Read `PRD.md` to understand the vision.
    * Read `ARCHITECTURE.md` to see where it fits.
    * Check `SKILLS.md`: Do we have a tool for this? (e.g., `mcp-maps-3d`).

2. **🏗️ PLANNING PHASE**
    * Create a section in `implementation_plan.md`.
    * Draft the "File Tree" structure.
    * **User Check:** "Boss, I plan to add 3 files. Proceed?"

3. **⚡ EXECUTION PHASE**
    * **Step A:** Scaffold Types (`packages/types`).
    * **Step B:** Build Backend/Service (`apps/ai-gateway`).
    * **Step C:** Build Frontend UI (`apps/web`).
    * **Step D:** Connect them.

4. **✅ VERIFICATION PHASE**
    * Run `pnpm dev`.
    * Verify "No Console Errors".
    * Update `task.md` to `[x]`.

---

## 🔴 WORKFLOW 2: THE "SURGICAL FIX" (Bug Fixing)

**When:** Something is broken (e.g., "Gateway 1006 Error").

1. **🔍 DIAGNOSIS**
    * **Stop:** Do not change code yet.
    * **Read:** `read_terminal` or `read_file` logs.
    * **Think:** Use `sequential-thinking` to isolate variables.

2. **🧪 ISOLATION**
    * Create a minimal reproduction case.
    * Confirm it fails reliably.

3. **💉 REMEDIATION**
    * Apply the fix.
    * **Constraint:** Change appropriate file ONLY. Don't rewrite the whole app.

4. **🛡️ REGRESSION TEST**
    * Did it break something else?
    * Check related modules.

---

## 🔵 WORKFLOW 3: THE "SKILL INJECTION" (Adding AI Powers)

**When:** Migrating a generic Skill (e.g., `tapo-cctv`) to `niagaos`.

1. **📥 EXTRACTION**
    * Copy folder from `clawd/skills/tapo-cctv` to `packages/agent/skills/`.

2. **🔧 ADAPTATION**
    * Add `index.ts` with MCP Tool Definition.
    * Ensure input schema uses `zod`.
    * Remove legacy `require()` calls, switch to `import`.

3. **🔌 REGISTRATION**
    * Add tool to `apps/ai-gateway/src/registry.ts`.
    * Restart Gateway.

4. **🧪 TEST**
    * Ask NiagaBot: "Check the CCTV".

---

## 🟠 WORKFLOW 4: THE "REFRESH" (Daily Start)

**When:** You (AI) start a new session.

1. **CONTEXT SYNC**
    * `read_file AI_CONTEXT_MASTER.md`
    * `read_file task.md` (See what's pending)
    * `read_file ANTIGRAVITY_RULES.md` (Refresh memory)

2. **ENVIRONMENT CHECK**
    * Is `pnpm dev` running?
    * Are `.env` variables loaded?

3. **ACTION**
    * Pick the top uncompleted item in `task.md`.
    * "Boss, I'm resuming work on [Task X]. Ready?"

---

> **PRO TIP:**
> Efficient agents don't guess. They **Verify, Plan, then Act.**
