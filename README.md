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

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start all apps in development mode   |
| `pnpm build`   | Build all apps                       |
| `pnpm lint`    | Lint all packages                    |
| `pnpm format`  | Format all files with Prettier       |

### Run only the storefront

```bash
pnpm --filter @tofu-ray/storefront dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Storefront Pages

| Route                     | Description              |
| ------------------------- | ------------------------ |
| `/`                       | Home page                |
| `/products`               | Product listing          |
| `/products/[handle]`      | Product detail           |
| `/cart`                   | Shopping cart            |
| `/checkout`               | Checkout form (UI only)  |

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
