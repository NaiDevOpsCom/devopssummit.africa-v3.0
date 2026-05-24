# Architecture Documentation

> **Africa DevOps Summit — `devopssummit.africa-v3`**
> Last reviewed: March 2026

This document explains how the application is structured, the decisions behind key choices, and what contributors need to understand before making changes. It is the authoritative reference for the technical shape of the project.

---

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [High-Level Architecture Diagram](#high-level-architecture-diagram)
- [Folder & Component Structure](#folder--component-structure)
- [Routing Structure](#routing-structure)
- [Design System](#design-system)
- [State Management](#state-management)
- [Content & Data Model](#content--data-model)
- [Security & Config Layer](#security--config-layer)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Integration Points](#integration-points)
- [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)

---

## System Overview

The Africa DevOps Summit website is a **client-side single-page application (SPA)** built with React and Vite. It has no backend server of its own. Content is a hybrid of:

- **Static TypeScript data files** — for content that rarely changes (FAQs, ticket tiers, team, benefits)
- **CMS-managed content** — for content that changes per edition (speakers, schedule, sponsors, past summit galleries)

The application is deployed as a compiled static bundle to **Cloudflare Pages**. Client-side routing is handled by React Router, with a `public/_redirects` rule that serves `index.html` for all paths so React Router can take over.

---

## Technology Stack

| Layer             | Technology                     | Version | Notes                                |
| ----------------- | ------------------------------ | ------- | ------------------------------------ |
| Framework         | React                          | 18.x    | UI component model                   |
| Language          | TypeScript                     | 5.x     | Strict mode enabled                  |
| Build Tool        | Vite                           | 5.x     | Dev server + production bundler      |
| Styling           | Tailwind CSS                   | 3.x     | Utility-first; tokens in `index.css` |
| UI Components     | shadcn/ui                      | Latest  | Built on Radix UI primitives         |
| Animations        | Framer Motion                  | Latest  | Page and scroll animations           |
| Routing           | React Router DOM               | v6      | Client-side SPA routing              |
| Icons             | Lucide React                   | Latest  | Icon library                         |
| Fonts             | Sora (headings) + Inter (body) | —       | Loaded via Google Fonts              |
| HTML Sanitization | DOMPurify                      | Latest  | XSS prevention for CMS content       |
| Image Hosting     | ImageKit                       | —       | CDN for gallery and speaker photos   |
| Env Validation    | Custom (`validateEnv.ts`)      | —       | Runtime startup validation           |
| Data Fetching     | TanStack React Query           | v5      | Installed; available for CMS/API use |
| Env Loading       | dotenv + Vite                  | —       | Scripts (dotenv) + runtime (Vite)    |

---

## High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                            │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  React   │  │ React Router │  │  Framer Motion   │   │
│  │  18.x    │  │     v6       │  │   (animations)   │   │
│  └──────────┘  └──────────────┘  └──────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Tailwind CSS + shadcn/ui               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────┐   ┌────────────────────────┐  │
│  │  Static TS Data Files │   │  CMS Client (React     │  │
│  │  (src/data/)          │   │  Query + CMS SDK)      │  │
│  └──────────────────────┘   └───────────┬────────────┘  │
└──────────────────────────────────────────┼───────────────┘
                                           │
              ┌────────────────────────────┼──────────────┐
              │                            │              │
              ▼                            ▼              ▼
   ┌──────────────────┐       ┌────────────────┐  ┌────────────┐
   │  Vite Build Tool  │       │   CMS API      │  │  ImageKit  │
   │  → dist/          │       │  (headless)    │  │  (images)  │
   └────────┬─────────┘       └────────────────┘  └────────────┘
            │
            ▼
   ┌────────────────────┐
   │  Cloudflare Pages   │
   │  (Git-connected CI) │
   │  _redirects → SPA   │
   └────────────────────┘
```

---

## Folder & Component Structure

```
src/
├── assets/                    # Bundled static images (e.g. hero-bg.jpg)
│
├── components/
│   ├── landing/               # Homepage-specific section components
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Speakers.tsx
│   │   ├── Schedule.tsx
│   │   ├── Tickets.tsx
│   │   ├── Sponsors.tsx
│   │   └── [other sections]
│   ├── layout/                # Global layout wrappers
│   │   ├── Navbar.tsx         # Navigation + hash scroll + route links
│   │   └── Footer.tsx
│   └── ui/                    # Reusable UI primitives
│       ├── SectionHeader.tsx  # Consistent section titles — use for all sections
│       ├── SpeakerCard.tsx    # Speaker display card
│       ├── TicketCard.tsx     # Ticket tier card
│       ├── BenefitCard.tsx    # Benefit display card
│       ├── StatBox.tsx        # Metric/stat display
│       ├── TeamCard.tsx       # Team member card
│       ├── SafeHtml.tsx       # DOMPurify wrapper — ONLY approved way to render raw HTML
│       └── [shadcn components] # accordion, button, dialog, tabs, etc. — do not edit manually
│
├── config/                    # Environment configuration
│   ├── env.ts                 # Centralized Env constant — use this, not import.meta.env directly
│   └── validateEnv.ts         # Startup validation: presence, format, secret detection
│
├── data/                      # Static TypeScript data files
│   ├── speakers.ts
│   ├── sponsors.ts
│   ├── tickets.ts
│   ├── benefits.ts
│   ├── faqs.ts
│   ├── stats.ts
│   ├── team.ts
│   └── pastSummits.ts
│
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx         # Responsive breakpoint detection
│   └── use-toast.ts           # Toast notification hook (shadcn)
│
├── lib/
│   └── utils.ts               # Utility functions — cn() class merger and misc helpers
│
├── pages/                     # Route-level page components (one per route)
│   ├── Index.tsx              # /
│   ├── AboutUs.tsx            # /about
│   ├── Schedule.tsx           # /schedule
│   ├── Sponsorship.tsx        # /sponsorship
│   ├── PastSummits.tsx        # /past-summits
│   ├── CodeOfConduct.tsx      # /code-of-conduct
│   ├── PrivacyPolicy.tsx      # /privacy-policy
│   ├── FAQs.tsx               # /faqs
│   └── NotFound.tsx           # * (404 fallback)
│
├── scripts/                   # Build-time scripts (not bundled into the app)
│   └── fetch-gallery.ts       # Pre-build: fetches gallery images from ImageKit
│
├── test/                      # Test files — see Testing section
│
├── types/
│   └── index.ts               # Shared TypeScript interfaces and enums
│
├── App.tsx                    # Root component — router config and layout
├── main.tsx                   # Entry point — mounts app, runs validateEnv()
└── index.css                  # Global styles + CSS design tokens (HSL variables)
```

> **Note for contributors:** `components/ui/` contains two categories — shadcn/ui generated files (do not edit manually) and custom primitives like `SafeHtml`, `SectionHeader`, `SpeakerCard`, etc. (these are fine to edit). If unsure, check whether the component was generated by the shadcn CLI or written by hand.

---

## Routing Structure

All routing is handled client-side by React Router DOM v6. The `public/_redirects` file (served by Cloudflare Pages) catches all server paths and serves `index.html`, allowing React Router to take over.

| Route              | Page Component  | Description                |
| ------------------ | --------------- | -------------------------- |
| `/`                | `Index`         | Landing page               |
| `/about`           | `AboutUs`       | About the summit           |
| `/schedule`        | `Schedule`      | Event programme            |
| `/sponsorship`     | `Sponsorship`   | Sponsor information        |
| `/past-summits`    | `PastSummits`   | Past editions showcase     |
| `/code-of-conduct` | `CodeOfConduct` | Community standards        |
| `/privacy-policy`  | `PrivacyPolicy` | Privacy policy             |
| `/faqs`            | `FAQs`          | Frequently asked questions |
| `*`                | `NotFound`      | 404 fallback               |

### Navbar navigation behaviour

The `Navbar` component handles two distinct navigation modes:

- **Hash-based scroll navigation** — used on the homepage (`/`) to scroll to sections (e.g. `#speakers`, `#tickets`)
- **Route-based navigation** — used for all other pages via React Router `<Link>`

When the user is on a non-home page and clicks a hash link, the Navbar navigates to `/#section-id` first, then scrolls.

---

## Design System

### CSS Variables (HSL-based)

All design tokens are defined as CSS custom properties in `src/index.css` under `:root`. Use these via Tailwind semantic tokens — never hardcode color values in components.

| CSS Variable         | Tailwind Token                    | Purpose                                  |
| -------------------- | --------------------------------- | ---------------------------------------- |
| `--background`       | `bg-background`                   | Page background                          |
| `--foreground`       | `text-foreground`                 | Primary text                             |
| `--primary`          | `bg-primary` / `text-primary`     | Brand blue (`217 91% 60%`)               |
| `--secondary`        | `bg-secondary` / `text-secondary` | Accent cyan (`199 89% 60%`)              |
| `--muted`            | `bg-muted`                        | Subtle backgrounds                       |
| `--muted-foreground` | `text-muted-foreground`           | Secondary / subdued text                 |
| `--dark-bg`          | `bg-dark-bg`                      | Dark section backgrounds (`222 47% 11%`) |
| `--card-dark`        | `bg-card-dark`                    | Dark card backgrounds                    |
| `--destructive`      | `bg-destructive`                  | Error and warning states                 |
| `--border`           | `border-border`                   | Border color                             |

### Typography

| Role     | Font      | Weight  | Class          |
| -------- | --------- | ------- | -------------- |
| Headings | **Sora**  | 600–800 | `font-heading` |
| Body     | **Inter** | 400–600 | `font-body`    |

Both fonts are loaded via Google Fonts in `index.html`. The `font-heading` and `font-body` Tailwind utilities are defined in `tailwind.config.ts`.

### Utility Classes

| Class             | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `section-padding` | Responsive horizontal padding applied to all page sections |
| `text-gradient`   | Primary-to-secondary gradient text effect for headings     |

### Component Patterns

All page components follow this consistent structure:

```tsx
// 1. Import layout wrappers
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// 2. Define Framer Motion animation variants
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// 3. Compose the page from section components
export default function MyPage() {
  return (
    <>
      <Navbar />
      <main>
        <SectionHeader title="..." subtitle="..." />
        {/* section components */}
      </main>
      <Footer />
    </>
  );
}
```

---

## State Management

This application uses **no global state library**. State is local to each component using React's built-in hooks.

| State type         | Approach                   | Examples                                               |
| ------------------ | -------------------------- | ------------------------------------------------------ |
| UI state           | `useState`                 | Tab selection, lightbox open/close, mobile menu toggle |
| Server/async state | TanStack React Query       | CMS data fetching (see note below)                     |
| Form state         | `useState` or uncontrolled | Contact forms                                          |

### React Query

TanStack React Query (`@tanstack/react-query`) is installed and configured. It is available for all CMS API data fetching — speakers, schedule, sponsors, past summit data. It is **not** used for static data files, which are imported directly at build time.

Do not remove React Query from the project. Use it when wiring up any CMS or external API calls.

---

## Content & Data Model

The site uses a **hybrid content model**:

### Static content (TypeScript files in `src/data/`)

Used for content that is tightly coupled to UI logic or changes infrequently:

| File          | Content                                        |
| ------------- | ---------------------------------------------- |
| `tickets.ts`  | Ticket tiers, pricing, benefits per tier       |
| `benefits.ts` | Attendance benefit items                       |
| `faqs.ts`     | FAQ questions and answers, grouped by category |
| `team.ts`     | Organising team members                        |
| `stats.ts`    | Summit metrics and statistics                  |

All static data exports must be typed via interfaces defined in `src/types/index.ts`.

### CMS-managed content

Used for content that changes per edition and should be editable without a code deployment:

| Content              | Notes                                                     |
| -------------------- | --------------------------------------------------------- |
| Speaker profiles     | Name, bio, photo (ImageKit URL), talk title, social links |
| Conference schedule  | Sessions, tracks, rooms, times                            |
| Sponsor profiles     | Logo (ImageKit URL), tier, website                        |
| Past summit data     | Recaps, highlights, testimonials, photo gallery           |
| Blog / announcements | Future — not yet implemented                              |

> `TODO: Document CMS provider, API client setup, and data fetching patterns once CMS is confirmed.`

### Gallery & Image Pipeline

Speaker photos and gallery images are hosted on **ImageKit**. A pre-build script (`src/scripts/fetch-gallery.ts`) can be run to sync gallery data:

- Uses `IMAGEKIT_PRIVATE_KEY` (build-time only, no `VITE_` prefix — never exposed to browser)
- Falls back gracefully to cached/placeholder data if the key is absent
- Outputs data that is then consumed by the `PastSummits` page component

---

## Security & Config Layer

See [SECURITY.md](../SECURITY.md) for the full security policy. The relevant architectural pieces are:

### Environment config (`src/config/env.ts`)

All `import.meta.env` access is centralised through the `Env` constant. Do not access `import.meta.env` directly anywhere else in the codebase.

```ts
// ✅ Correct
import { Env } from "@/config/env";
const apiUrl = Env.CMS_API_URL;

// ❌ Wrong — direct access bypasses validation
const apiUrl = import.meta.env.VITE_CMS_API_URL;
```

### Startup validation (`src/config/validateEnv.ts`)

`validateEnv()` is called in `main.tsx` before the React app mounts. It checks:

- Required variables are present
- URL formats are valid
- No `VITE_` prefixed variables contain secret-looking values

### HTML sanitization (`src/components/ui/SafeHtml.tsx`)

The `SafeHtml` component is the **only approved way** to render raw HTML strings (e.g. from CMS rich text fields). It wraps DOMPurify sanitization.

```tsx
// ✅ Correct
<SafeHtml content={speaker.bio} />

// ❌ Never do this — bypasses DOMPurify
<div dangerouslySetInnerHTML={{ __html: speaker.bio }} />
```

---

## Build & Deployment

### Build output

```sh
npm run build       # Compiles to dist/
npm run preview     # Serves dist/ locally for verification
```

The `dist/` directory contains the complete static site — one `index.html` and hashed JS/CSS bundles.

### Deploying to Cloudflare Pages

Deployment is Git-connected — pushing to the main branch triggers an automatic build and deploy on Cloudflare Pages.

**First-time setup:**

1. In the Cloudflare dashboard, create a new Pages project and connect it to this GitHub repository.
2. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** match `.nvmrc`
3. Add all required `VITE_` environment variables in the Cloudflare Pages dashboard under **Settings → Environment variables**.

**SPA routing:**

The `public/_redirects` file handles SPA fallback routing:

```
/*    /index.html    200
```

This is copied into `dist/` at build time by Vite and tells Cloudflare Pages to serve `index.html` for any path that doesn't match a real static asset — allowing React Router to handle navigation.

**Preview deployments:**

Cloudflare Pages automatically creates a unique preview URL for every pull request. Environment variables for preview builds can be configured separately under **Settings → Environment variables → Preview**.

### Environment variables at build time

All `VITE_` environment variables are inlined into the bundle at build time by Vite. Manage them in:

- **Local development:** `.env.local` (never committed — see `.gitignore`)
- **Production / Preview:** Cloudflare Pages dashboard → Settings → Environment variables

Cloudflare Pages also injects these read-only build variables automatically:

| Variable              | Description                         |
| --------------------- | ----------------------------------- |
| `CF_PAGES`            | Set to `1` during a Pages build     |
| `CF_PAGES_COMMIT_SHA` | Git commit SHA of the current build |
| `CF_PAGES_BRANCH`     | Branch name being built             |
| `CF_PAGES_URL`        | Deployment URL for this build       |

If you need to expose the commit SHA to the browser, forward it with a `VITE_` prefix in the dashboard: `VITE_CF_PAGES_COMMIT_SHA`.

---

## Testing

Test files live in `src/test/`. The testing setup uses:

> `TODO: Confirm testing framework (e.g. Vitest + React Testing Library) and document configuration here.`

### Current testing expectations

| Area                   | Status       | Notes                                                |
| ---------------------- | ------------ | ---------------------------------------------------- |
| Unit tests (utilities) | `TODO`       | `src/lib/utils.ts` helpers should be unit tested     |
| Component tests        | `TODO`       | Critical UI components (SafeHtml, SpeakerCard, etc.) |
| Integration tests      | `TODO`       | Key user flows (navigation, tab switching, lightbox) |
| E2E tests              | Not in scope | Out of scope for the current MVP phase               |

Contributors adding new utility functions or components are encouraged (not yet required) to add tests alongside them. The `npm run test` and `npm run test:watch` scripts are available.

---

## Integration Points

### Active

| Service         | Purpose                                                  | Auth method                                                               |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| **ImageKit**    | Image CDN for speaker photos, sponsor logos, and gallery | `IMAGEKIT_PRIVATE_KEY` (build-time), `VITE_IMAGEKIT_PUBLIC_KEY` (runtime) |
| **CMS** _(TBD)_ | Dynamic content for speakers, schedule, sponsors         | `TODO: confirm provider and auth`                                         |

### Planned

| Service                    | Purpose                         | Notes                                                |
| -------------------------- | ------------------------------- | ---------------------------------------------------- |
| **Stripe**                 | Online ticket purchasing        | Future roadmap — not in current scope                |
| **Mailchimp / ConvertKit** | Newsletter sign-up              | Short-term roadmap                                   |
| **Google Calendar API**    | Add-to-calendar for sessions    | Medium-term roadmap                                  |
| **YouTube embed**          | Past summit recap videos        | Can be done without API key via iframe               |
| **Analytics**              | Traffic and conversion tracking | `TODO: confirm provider — GA4, Plausible, or Fathom` |

---

## Architecture Decision Records (ADRs)

ADRs document _why_ key decisions were made, so future contributors don't unknowingly reverse them or repeat the same debates.

---

### ADR-001: SPA over SSR / Static Site Generator

**Decision:** Build as a client-side SPA with Vite, not a server-rendered framework (Next.js, Remix) or SSG (Astro, Gatsby).

**Context:** The site is a marketing/conference website with no user authentication, no personalised content, and no server-side logic requirements.

**Reasons:**

- Simpler deployment — output is a flat `dist/` folder uploadable to any static/shared host
- cPanel shared hosting does not support Node.js server processes needed for SSR
- The team is familiar with React + Vite; introducing Next.js would add framework overhead without meaningful benefit at current scale
- SEO requirements are moderate — the site can be crawled adequately as an SPA; full SSR is not required

**Trade-offs accepted:**

- First-load performance is slightly worse than SSG (no pre-rendered HTML)
- SEO is marginally less optimal than SSR — acceptable for a conference site

**Revisit when:** Traffic and SEO requirements grow significantly, or the project migrates to a platform with server-side rendering support (e.g. Cloudflare Workers + Pages Functions, Railway).

---

### ADR-002: Cloudflare Pages Hosting

**Decision:** Deploy to **Cloudflare Pages** instead of cPanel shared hosting or other cloud platforms (Vercel, Netlify, etc.).

**Context:** The project is community-run. Cloudflare Pages offers a generous free tier with Git-connected CI/CD, global CDN edge caching, automatic preview deployments per PR, and built-in environment variable management — all without requiring a paid plan.

**Reasons:**

- Free tier is sufficient for a conference marketing site
- Automatic Git-connected builds replace the previous manual FTP workflow
- Global CDN edge network improves performance for African and international attendees
- Per-PR preview deployments enable easier review of UI changes
- Built-in environment variable management in the dashboard (no bake-at-build manual step for CI)
- SPA routing handled via `public/_redirects` — simpler than `.htaccess` on cPanel

**Trade-offs accepted:**

- Cloudflare Pages free tier has build minute limits (500 builds/month) — sufficient for current contribution volume
- No Node.js server-side runtime (Workers would be needed) — not required for this SPA

**Revisit when:** The project adds server-side features (e.g. API routes, SSR) that require a runtime beyond static file serving.

---

### ADR-003: Hybrid Static + CMS Content Model

**Decision:** Use static TypeScript data files for stable content and a headless CMS for per-edition content.

**Context:** Some content (FAQs, ticket tiers, team bios) rarely changes and is tightly coupled to component logic. Other content (speakers, schedule, sponsors) changes every year and should be editable by non-developers.

**Reasons:**

- Static files for stable content keeps the build simple and avoids unnecessary API calls
- CMS for dynamic content empowers organizers to update speaker profiles and schedules without a code deployment
- Keeps developer experience fast — no CMS dependency for local development of static sections

**Trade-offs accepted:**

- Two content update paths (code PR vs CMS dashboard) can confuse new contributors — mitigated by clear documentation
- CMS content requires an internet connection during development if not cached

---

### ADR-004: No Global State Library

**Decision:** Use React's built-in `useState` and `useContext` for state. Do not add Redux, Zustand, Jotai, or similar.

**Context:** The application has minimal shared state — a few UI toggles (mobile menu, lightbox, tabs). There is no complex async state, no cross-page shared data, and no user session.

**Reasons:**

- No meaningful complexity that justifies a global state library
- Keeps the bundle smaller
- Reduces the learning curve for new contributors

**Trade-offs accepted:**

- If the app grows to include user authentication or a personalised schedule, local state will become insufficient — revisit at that point

---

### ADR-005: TanStack React Query Installed but Not Yet Active

**Decision:** Install React Query at setup time, but do not use it for static data imports.

**Context:** CMS integration is confirmed as part of the roadmap but not yet implemented. Static data files are used in the interim.

**Reasons:**

- Installing now avoids a larger refactor when CMS integration lands
- React Query is the established standard for server state in React applications
- `QueryClientProvider` is already in the app tree — adding queries requires only writing the query hooks

**Do not remove React Query.** It will be used when CMS data fetching is implemented.

---

_This document should be updated whenever a significant architectural change is made. Include a new ADR for any decision that would otherwise be debated by future contributors._
