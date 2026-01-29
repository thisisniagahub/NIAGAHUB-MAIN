# NIAGAOS

> The Operating System for Modern Business

A unified, AI-native business platform consolidating F&B operations, startup management, and intelligent automation into one monorepo.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build
```

## 📁 Structure

```
niagaos/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Express API server
├── packages/
│   ├── config/       # Shared ESLint, TypeScript configs
│   ├── database/     # Prisma schema + client
│   ├── types/        # Shared TypeScript types
│   └── ui/           # React UI components
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## 🏢 Verticals

| Vertical | Description | URL Pattern |
|----------|-------------|-------------|
| **F&B** | Restaurant management, kiosk, WhatsApp ordering | `/fnb/:tenant/:mode` |
| **Startup** | Founder OS with strategy, product, sales, HR, finance | `/startup/:tenant/:mode` |
| **Agent** | AI framework with memory, skills, and MCP tools | `/agent/:tenant/:mode` |

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Zustand
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **AI:** Google Gemini API, MCP Protocol
- **Infrastructure:** Turborepo, pnpm, Redis, PM2

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:studio` | Open Prisma Studio |

## 📄 License

MIT © 2026 NiagaHub Team
