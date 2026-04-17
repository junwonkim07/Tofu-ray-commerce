# Backend (Medusa)

> **Placeholder** — The Medusa backend will be added here in a future iteration.

## Planned Stack

- **Framework**: [Medusa v2](https://medusajs.com/)
- **Database**: PostgreSQL
- **File Storage**: Local / S3 (TBD)
- **Payment**: Korean PG (TBD)

## Planned Features

- Product catalog management
- Order management
- Customer accounts
- Inventory management
- Korean PG integration (e.g., Toss Payments, NicePay)

## Planned Structure

```
apps/backend/
├── src/
│   ├── api/          # Custom API routes
│   ├── modules/      # Custom Medusa modules
│   └── subscribers/  # Event subscribers
├── medusa-config.ts
└── package.json
```

## Development

Once implemented, start the backend with:

```bash
pnpm --filter @tofu-ray/backend dev
```

The storefront (`apps/storefront`) will connect to this backend via the Medusa Store API.
