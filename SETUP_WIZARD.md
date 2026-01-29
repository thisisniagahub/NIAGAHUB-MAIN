# ⚡ SETUP_WIZARD.md: ZERO TO HERO

> **AUTOMATED MIGRATION PROTOCOL**
> How to build the "Gempak" system in 5 Steps.
> Follow this exactly to hydrate the `niagaos` monorepo.

---

## 🏁 PRE-REQUISITES

- Node.js 22+
- PNPM (`npm i -g pnpm`)
- Access to Google Gemini API Key
- Supabase Project URL/Key

---

## 🚀 STEP 1: SCAFFOLD THE CORE

*Initialize the Neural Mesh.*

```bash
# 1. Create Directory
mkdir -p niagaos/apps niagaos/packages niagaos/services

# 2. Initialize Workspace
cd niagaos
pnpm init
# (Copy content of package.json from NIAGAOS_BLUEPRINT)
```

## 🚚 STEP 2: HARVEST THE ORGANS (Copy Modules)

*Transplant code from Reference Sources.*

**Copy these folders:**

1. **Skills:** `g:\NIAGAHUB-MAIN\clawd\skills\*` --> `niagaos/packages/agent/skills/`
2. **Labs:** `g:\NIAGAHUB-MAIN\NIAGA-HUB-APPS\labs\mcp-maps-3d` --> `niagaos/apps/web/src/components/maps`
3. **Modules:** `g:\NIAGAHUB-MAIN\niagahub-startupos\pages\*` --> `niagaos/apps/web/src/modules/`
4. **Backend:** `g:\NIAGAHUB-MAIN\NiagaHub-SuperApp\notebookllm-mcp\*` --> `niagaos/apps/ai-gateway/src/`

## 🧠 STEP 3: ACTIVATE THE BRAIN (Configure AI)

1. Create `niagaos/apps/ai-gateway/.env`
2. Add Keys:

    ```env
    GEMINI_API_KEY=your_key
    REDIS_URL=redis://localhost:6379
    DATABASE_URL=postgresql://...
    ```

3. Run `pnpm install` in root.

## 🛢️ STEP 4: HYDRATE THE DATABASE

1. Navigate to `packages/database`.
2. Run `npx prisma db push` (This creates the Schema from ERP.md).
3. Run `npx prisma db seed` (Creates Admin User & Default Org).

## 🔥 STEP 5: IGNITION

```bash
# In niagaos root
pnpm dev
```

**Result:**

- **Localhost:3000:** The Dashboard (StarupOS + Maps + Video Gen).
- **Localhost:3001:** The AI Gateway (MCP Server).
- **Localhost:3002:** The Kiosk (Voice Interface).

---

## 🛠️ TROUBLESHOOTING

- **Error:** "Missing Dependency"
  - **Fix:** Run `pnpm install` at root. Turborepo handles linking.
- **Error:** "Prisma Client not found"
  - **Fix:** Run `pnpm build` in `packages/database`.

---

> **READY?**
> Once files are copied, just run `pnpm dev`.
> The System will come alive.
