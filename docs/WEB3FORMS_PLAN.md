# Web3Forms Implementation Plan

## Overview

Add **Web3Forms** for form-to-email functionality without backend code.

## Why Web3Forms?

- Free, no backend required
- Works with static sites (React, Svelte, Astro)
- Email notifications on form submission
- Built-in spam protection (honeypot)

---

## Implementation

### 1. Create Package

```
packages/web3forms/
├── src/
│   ├── index.ts           # Main exports
│   ├── submit.ts         # Form submission handler
│   └── types.ts         # TypeScript types
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 2. Dependencies

```json
{
  "dependencies": {}
}
```

No runtime deps - uses fetch to POST to Web3Forms API.

### 3. Submit Handler (`src/submit.ts`)

```typescript
interface SubmitOptions {
  accessKey: string
  name: string
  email: string
  message: string
  subject?: string
  fromName?: string
}

export async function submitForm(options: SubmitOptions) {
  const { accessKey, ...data } = options

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      ...data,
    }),
  })

  return response.json()
}
```

### 4. React Component

```typescript
// In your app
import { submitForm } from 'web3forms'

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  const result = await submitForm({
    accessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    name: formData.name,
    email: formData.email,
    message: formData.message,
  })

  if (result.success) {
    // Show success message
  }
}
```

---

## Environment

```env
VITE_WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Get key from [web3forms.com](https://web3forms.com).

---

## Spam Protection

Add honeypot field (hidden from users):

```html
<input type="checkbox" name="botcheck" style="display: none;" />
```

---

## Usage in Apps

Add to each app's `package.json`:

```json
{
  "dependencies": {
    "web3forms": "workspace:*"
  }
}
```

---

## Validate

```bash
pnpm build && pnpm test && pnpm lint
```

---

## Future Enhancements

- Rate limiting handling
- Multiple recipients support
- File upload support
- Webhook integration for Slack/Notion
