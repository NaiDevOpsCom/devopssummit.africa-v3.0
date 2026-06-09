# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do not open a public GitHub issue.**

Report it privately by emailing: **`nairobi@devopssummit.africa`**

Include as much detail as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- Any relevant screenshots, URLs, or proof-of-concept code

### What to expect after reporting

| Timeframe             | What happens                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| **Within 48 hours**   | We acknowledge receipt of your report                                   |
| **Within 7 days**     | We assess severity and share our initial findings with you              |
| **Within 30 days**    | We aim to ship a fix for confirmed vulnerabilities                      |
| **After fix is live** | We'll notify you and, with your permission, credit you in the changelog |

We treat all reports seriously. If you follow responsible disclosure practices, we will too.

---

## Scope

### In scope

- The Africa DevOps Summit website (`devopssummit.africa` and subdomains)
- This GitHub repository and its codebase
- Environment variable handling and configuration
- Client-side data handling and rendering

### Out of scope

The following are **not** in scope for this security policy:

- Third-party services (CMS provider, ticketing platform, image hosting) — report those to the respective vendor
- Social engineering attacks targeting the team
- Denial of service attacks
- Issues in dependencies — report those upstream via `npm audit` or the package maintainer

---

## Attack Surface Overview

This is a **frontend-only static SPA** with no backend server. Understanding the architecture helps scope what's actually at risk:

| Layer                 | Detail                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **Server-side**       | None — no backend, no database, no API server owned by this project                         |
| **Client-side**       | React SPA served as static files from cPanel shared hosting                                 |
| **Data storage**      | No user accounts, no server-side sessions, no cookies set by this app                       |
| **External services** | CMS (read-only public API), image hosting (ImageKit), ticketing (external redirect)         |
| **User input**        | Contact/inquiry forms POST to third-party services — no data is processed server-side by us |

The primary client-side risks are **XSS** and **sensitive data exposure via environment variables**, both of which are addressed below.

---

## Security Implementation

### 1. Environment Variable Security

#### Centralized Configuration (`src/config/env.ts`)

All environment variables are accessed through a single `Env` constant in `src/config/env.ts`. **Direct use of `import.meta.env` outside this file is prohibited.**

- Variables are strictly typed in `vite-env.d.ts`
- Helper functions (`requireEnv`, `optionalEnv`) ensure predictable, validated access
- `VITE_` prefixed variables are bundled into the client bundle and are **publicly visible** — treat them as public configuration, never as secrets

#### Runtime Validation (`src/config/validateEnv.ts`)

The app runs a validation check at startup (`main.tsx`):

- **Presence check** — confirms all required variables (e.g. ImageKit endpoints) are present
- **Format validation** — validates URL structure and other format requirements
- **Secret detection** — scans all `VITE_` prefixed variables for patterns that look like secrets (Stripe `sk_`, SendGrid `SG.`, AWS keys, GitHub tokens, etc.) and raises an error if found
- **Failure behaviour** — in development, violations throw immediately; in production, they surface as console errors

#### Build-Time Safety

- The `fetch-gallery.ts` script uses a graceful skip mechanism — if `IMAGEKIT_PRIVATE_KEY` is absent, it falls back to cached/placeholder data rather than failing the build or leaking the key
- `.env.local` is gitignored and must never be committed
- `.env.example` documents all required variables with dummy values and must be kept up to date

#### Rules for contributors

```
# ✅ Safe — public configuration
VITE_CMS_API_URL=https://api.example.com
VITE_IMAGEKIT_PUBLIC_KEY=public_abc123

# ❌ Never do this — private keys must not have VITE_ prefix
VITE_IMAGEKIT_PRIVATE_KEY=private_xyz789   # will be exposed in the browser bundle

# ✅ Correct — private keys without VITE_ prefix are build-time only
IMAGEKIT_PRIVATE_KEY=private_xyz789
```

---

### 2. XSS (Cross-Site Scripting) Prevention

#### Sanitization Strategy

Dynamic HTML from the CMS or external sources is sanitized using [DOMPurify](https://github.com/cure53/DOMPurify) before rendering. Our configuration:

- Strips dangerous tags: `<script>`, `<iframe>`, `<object>`, `<embed>`
- Strips dangerous attributes: `onerror`, `onload`, `onclick`, and all other event handlers
- Preserves safe structural elements: `<a>`, `<b>`, `<i>`, `<p>`, `<ul>`, `<li>`, etc.

#### SafeHtml Component

The `SafeHtml` component is the **only approved way** to render raw HTML strings in this codebase. It applies DOMPurify before injecting content into the DOM.

```tsx
// ✅ Correct — sanitized rendering
<SafeHtml content={speaker.bio} />

// ❌ Never do this — bypasses sanitization
<div dangerouslySetInnerHTML={{ __html: speaker.bio }} />
```

All components that render dynamic content from CMS fields (descriptions, bios, testimonials) **must** use `SafeHtml`. This is enforced in code review.

---

### 3. External Link Safety

All external links must include `rel="noopener noreferrer"` to prevent reverse tabnapping attacks:

```tsx
// ✅ Correct
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  Link
</a>

// ❌ Missing rel attribute — security risk
<a href="https://external.com" target="_blank">Link</a>
```

---

### 4. Third-Party Script Integrity

External analytics and marketing scripts are a significant attack surface. When a remote script is loaded from a third-party CDN, the safest practice is to pin the exact file with Subresource Integrity (SRI) and use `crossorigin="anonymous"`.

- The GTM loader file in `public/scripts/gtm.js` is intentionally implemented to support this pattern.
- If you can obtain a verified SRI hash for the Google Tag Manager script, set it at runtime using `window.GTM_SCRIPT_INTEGRITY` before the loader runs.
- If no hash is available, make sure the script source is trusted, use a strict CSP `script-src` policy, and prefer a versioned vendor URL.
- This file is excluded from Sonar scanning in `sonar-project.properties` because it is managed as a runtime loader for a trusted third-party analytics provider.

Example runtime configuration:

```html
<script>
  window.GTM_SCRIPT_INTEGRITY = "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC";
</script>
```

Then the loader in `public/scripts/gtm.js` will insert the GTM script with both `integrity` and `crossorigin="anonymous"`.

### 5. Content Security Policy (CSP)

A Content Security Policy restricts which resources the browser can load, significantly reducing XSS impact.

For cPanel hosting, add the following to your `.htaccess` file and adjust the `connect-src` and `img-src` directives to match your actual CMS and image hosting domains:

```apache
<IfModule mod_headers.c>
  Header set Content-Security-Policy "\
    default-src 'self'; \
    script-src 'self'; \
    style-src 'self' 'unsafe-inline'; \
    img-src 'self' data: https://ik.imagekit.io; \
    font-src 'self'; \
    connect-src 'self' https://TODO_CMS_API_DOMAIN; \
    frame-src 'none'; \
    object-src 'none'; \
    base-uri 'self'; \
    form-action 'self'; \
  "
</IfModule>
```

> `TODO: Confirm and finalise CSP directives once all third-party domains (CMS, ticketing, analytics) are confirmed. Test in report-only mode first using `Content-Security-Policy-Report-Only`  before enforcing.`

---

### 5. Dependency Management

Run the following regularly and before major releases:

```sh
# Check for known vulnerabilities
npm audit

# Auto-fix non-breaking vulnerabilities
npm audit fix

# Review and update outdated packages
npx npm-check-updates
```

Dependency updates should be done in a dedicated PR with the `chore` commit prefix. All PRs that update dependencies should verify `npm run build` still passes.

---

## Severity Reference

Use this guide when assessing or reporting a vulnerability:

| Severity          | Description                                   | Examples                                                       |
| ----------------- | --------------------------------------------- | -------------------------------------------------------------- |
| **Critical**      | Direct data exposure or remote code execution | Private key exposed in bundle, full XSS with data exfiltration |
| **High**          | Significant impact, likely exploitable        | Stored XSS, CSP bypass, sensitive config exposed               |
| **Medium**        | Moderate impact or requires user interaction  | Reflected XSS, open redirect, clickjacking                     |
| **Low**           | Minimal impact, unlikely to be exploited      | Missing security headers, verbose error messages               |
| **Informational** | Best practice improvement, no direct impact   | Missing `rel` attribute, suboptimal CSP directive              |

---

_This policy was last reviewed: March 2026_
