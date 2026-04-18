# Tofu Ray Commerce

A modern e-commerce platform built with a **pnpm monorepo**, featuring a Next.js storefront with shadcn/ui and a Medusa backend (coming soon).

## Monorepo Structure

```
tofu-ray-commerce/
├── apps/
│   ├── storefront/          # Next.js App Router storefront (shadcn/ui + Tailwind CSS)
│   └── backend/             # Medusa backend (placeholder — coming soon)
├── packages/
│   └── core/                # Shared types and mock product data
├── package.json             # Root workspace config + scripts
├── pnpm-workspace.yaml      # pnpm workspaces config
├── turbo.json               # Turborepo task config
├── .eslintrc.json           # Root ESLint config
└── .prettierrc              # Prettier config
```

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Storefront**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **State**: React Context + localStorage (cart)
- **Backend**: Medusa v2 (planned)

## Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9

```bash
npm install -g pnpm
```

### Install Dependencies

```bash
git clone https://github.com/junwonkim07/tofu-ray-commerce.git
cd tofu-ray-commerce
pnpm install
```

## Commands

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `pnpm dev`    | Start all apps in development mode |
| `pnpm build`  | Build all apps                     |
| `pnpm lint`   | Lint all packages                  |
| `pnpm format` | Format all files with Prettier     |

## Production Target (AMD64)

This project is intended to run in AMD64/x64 production environments.

- Recommended runtime: Node.js 20 LTS
- Recommended CI runner: `ubuntu-22.04` (GitHub-hosted x64)
- Backend native dependency (`sqlite3`) is validated in CI on x64

If you develop on ARM64 (for example Windows ARM), local runtime issues with native modules can happen even when AMD64 production is healthy.

## Runtime Ports

- Storefront: `3000`
- Admin: `3002`
- Backend API: `5000`

## CI/CD

Workflow file: [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

What it does:

- CI on push/PR: install, lint, build, and backend health check (`/health`)
- Package on `main`: uploads backend `dist` artifact

The deploy stage can be added after your production server details are fixed.

### Run only the storefront

```bash
pnpm --filter @tofu-ray/storefront dev
```

```bash
pnpm --filter @tofu-ray/admin dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Storefront Pages

| Route                  | Description             |
| ---------------------- | ----------------------- |
| `/`                  | Home page               |
| `/products`          | Product listing         |
| `/products/[handle]` | Product detail          |
| `/cart`              | Shopping cart           |
| `/checkout`          | Checkout form (UI only) |

## Features

- ✅ Responsive design with Tailwind CSS and shadcn/ui
- ✅ Product listing with categories
- ✅ Product detail with image gallery and add-to-cart
- ✅ Persistent shopping cart (localStorage)
- ✅ Checkout form UI (no payment processing yet)
- ✅ Shared types and mock data in `packages/core`

## Roadmap

- [ ] Medusa backend integration (`apps/backend`)
- [ ] Korean PG payment integration (Toss Payments / NicePay)
- [ ] User authentication and accounts
- [ ] Product search and filtering
- [ ] Order management and tracking
