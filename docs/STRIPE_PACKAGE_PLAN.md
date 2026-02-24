# Stripe Package Implementation Plan

## Overview

Create a shared **Stripe** package for payments across the monorepo.

## Why a Stripe Package?

- Single source of truth for payment logic
- Full TypeScript support with shared types
- API keys managed in one place

---

## Implementation

### 1. Create Package

```
packages/stripe/
├── src/
│   ├── index.ts        # Main exports
│   ├── client.ts      # Stripe client singleton
│   ├── types.ts       # Shared types
│   ├── checkout.ts    # Checkout session builder
│   └── webhooks/      # Webhook handling
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {
    "stripe": "^17.0.0"
  },
  "devDependencies": {
    "@stripe/stripe-js": "^5.0.0"
  }
}
```

### 3. Client (`src/client.ts`)

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})
```

### 4. Types (`src/types.ts`)

```typescript
export interface Product {
  id: string
  name: string
  priceId: string
  priceAmount: number
  priceCurrency: string
}

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled'
```

### 5. Checkout (`src/checkout.ts`)

```typescript
import { stripe } from './client'

export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}
```

### 6. Integration

Add to `services/express-service/package.json`:

```json
{ "dependencies": { "stripe": "workspace:*" } }
```

Add webhook endpoint:

```typescript
app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  createWebhookHandler(handleStripeEvent)
)
```

---

## Environment

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- One-time payments (Payment Intents)
- Customer portal integration
- Multi-currency support
- Stripe Tax integration
