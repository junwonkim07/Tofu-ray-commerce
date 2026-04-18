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

## Docker Deployment (Vultr Debian, AMD64)

This repository includes production Docker deployment files:

- [docker-compose.prod.yml](docker-compose.prod.yml)
- [docker/nginx.prod.conf](docker/nginx.prod.conf)
- [scripts/deploy/deploy-main.sh](scripts/deploy/deploy-main.sh)
- [.github/workflows/deploy-docker.yml](.github/workflows/deploy-docker.yml)

### 1) Server bootstrap (one time)

Create deploy user and prepare SSH:

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
```

Add your public key to `authorized_keys`:

```bash
echo 'ssh-ed25519 YOUR_PUBLIC_KEY github-actions-deploy' >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

Install Docker (if not installed):

```bash
curl -fsSL https://get.docker.com | sh
```

### 2) GitHub Secrets

Set these repository secrets:

- `DEPLOY_HOST`: `158.247.215.87`
- `DEPLOY_PORT`: `22`
- `DEPLOY_USER`: `deploy`
- `DEPLOY_SSH_KEY`: private key content used by GitHub Actions
- `DEPLOY_PATH`: example `/home/deploy/tofu-ray-commerce`
- `JWT_SECRET`: long random secret value
- `CORS_ORIGIN`: `http://158.247.215.87:3000,http://158.247.215.87:3002`

### 3) Deployment behavior

- Trigger: push to `main` via [deploy-docker workflow](.github/workflows/deploy-docker.yml)
- Script: [scripts/deploy/deploy-main.sh](scripts/deploy/deploy-main.sh)
- Rollback: automatic rollback to previous commit if health check fails

### 4) Network model

- Storefront public: `:3000`
- Admin public: `:3002`
- Backend internal-only in Docker network
- Browser uses same-origin `/api` through Nginx reverse proxy

### 5) Optional local production test

```bash
cp .env.production.example .env.production
docker compose -f docker-compose.prod.yml up -d --build
curl -fsS http://127.0.0.1:3000/health
```

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
