# Web3Forms Integration Guide

This document explains how to use [Web3Forms](https://web3forms.com) to receive contact form submissions via email—no backend required.

## Overview

Web3Forms is a free form backend service that forwards UI form submissions to your email. It works with static sites (Vite/React, Svelte, Astro, etc.) because it uses a third-party API endpoint instead of your own server.

---

## Quick Start

### 1. Get an Access Key

1. Go to [web3forms.com](https://web3forms.com/#start)
2. Enter the email address where you want to receive submissions
3. Submit the form—you’ll receive your **Access Key** by email
4. Copy the key (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2. Configure the Project

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and replace `your-access-key-here` with your actual key:
   ```
   VITE_WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. **Important:** `.env` is in `.gitignore`—never commit your access key.

### 3. Deploy (Vercel, Netlify, etc.)

Add the environment variable in your hosting dashboard:

- **Vercel:** Project → Settings → Environment Variables → Add `VITE_WEB3FORMS_ACCESS_KEY`
- **Netlify:** Site settings → Environment variables → Add `VITE_WEB3FORMS_ACCESS_KEY`

### 4. Test

Submit the contact form on your site. You should receive an email with the submitted data.

---

## Reserved Fields (Optional)

These field names have special behavior. Use them as needed:

| Field        | Type   | Description                                                               |
| ------------ | ------ | ------------------------------------------------------------------------- |
| `access_key` | string | **Required.** Your Web3Forms access key.                                  |
| `email`      | string | User email. Used as the Reply-To address in your notification email.      |
| `subject`    | string | Email subject. Can be user-filled or a hidden default.                    |
| `from_name`  | string | Name shown as sender (default: "Notifications").                          |
| `redirect`   | string | URL to redirect to after success (for non-JavaScript submissions).        |
| `botcheck`   | hidden | Honeypot for spam protection. Add as hidden checkbox with `display:none`. |
| `replyto`    | string | Override Reply-To if you don’t want to use the `email` field.             |
| `ccemail`    | string | _(PRO)_ CC another email address.                                         |
| `webhook`    | string | _(PRO)_ Webhook URL for integrations (Zapier, Notion, etc.).              |

Any other field names are sent through as custom data and appear in your email.

---

## Project Integration: ContactForm.tsx

The `ContactForm.tsx` component (React/Vite) is wired to Web3Forms. It:

- POSTs to `https://api.web3forms.com/submit` via `fetch`
- Reads `access_key` from `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY`
- Sends: `name`, `email`, `phone`, `inquiry_type`, `message`, `subject`, `from_name`
- Includes a honeypot (`botcheck`) for spam protection
- Shows success/error feedback and disables the submit button while sending

---

## Optional Enhancements

### Honeypot Spam Protection

Add a hidden checkbox that bots may fill out:

```html
<input type="checkbox" name="botcheck" style="display: none;" />
```

Web3Forms ignores submissions where this field is checked.

### Custom Subject Line

```html
<input type="hidden" name="subject" value="New Contact from Cardston Smiles" />
```

### Success Redirect (No JavaScript)

For plain HTML form posts (no JS):

```html
<input type="hidden" name="redirect" value="https://yoursite.com/thank-you" />
```

### Custom From Name

```html
<input type="hidden" name="from_name" value="Cardston Smiles Website" />
```

---

## API Reference

- **Endpoint:** `POST https://api.web3forms.com/submit`
- **Alternative:** `POST https://api.web3forms.com/submit/YOUR_ACCESS_KEY` (access key in URL, no hidden field needed)

### Response Codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | Success (JSON response)                  |
| 303  | Success with redirect                    |
| 400  | Client error (invalid data, missing key) |
| 429  | Too many requests (rate limit)           |
| 500  | Server error                             |

### Success Response (200)

```json
{
  "success": true,
  "body": {
    "data": { "name": "...", "email": "...", "message": "..." },
    "message": "Email sent successfully!"
  }
}
```

---

## Troubleshooting

| Issue                    | Possible cause / fix                                         |
| ------------------------ | ------------------------------------------------------------ |
| No email received        | Check spam folder; verify access key and recipient email.    |
| 400 error                | Ensure `access_key` is present and valid.                    |
| 429 error                | Rate limit hit; wait and retry.                              |
| Form submits but no JSON | Form may be doing a full-page POST; check `action`/`method`. |

---

## Resources

- [Web3Forms](https://web3forms.com)
- [Documentation](https://docs.web3forms.com)
- [API Reference](https://docs.web3forms.com/getting-started/api-reference)
