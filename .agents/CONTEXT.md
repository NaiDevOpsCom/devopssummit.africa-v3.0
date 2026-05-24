# Africa DevOps Summit — Agent Context

> **This is the single source of truth for all AI coding agents.**
> Read this entire file before generating any code, suggesting any changes,
> or answering any questions about this codebase.
> Last updated: March 2026

---

## 1. What This Project Is

The **Africa DevOps Summit** website (`devopssummit.africa`) is Africa's premier DevOps, Cloud & SRE conference website. It is the event's primary digital presence — handling marketing, speaker showcases, schedule, ticket information, sponsor engagement, and past summit archives.

**This is a frontend-only static SPA.** There is no backend server, no database, no server-side rendering, and no API owned by this project. Everything compiles to a flat `dist/` folder deployed to cPanel shared hosting.

**The community behind it:** The site is maintained by a mix of core organizers, volunteers, and open source contributors from the African DevOps community. Code quality, accessibility, and contributor experience matter as much as features.

---

## 2. Tech Stack — Exactly This, Nothing Else

| Layer          | Technology           | Version | Notes                                                                   |
| -------------- | -------------------- | ------- | ----------------------------------------------------------------------- |
| Framework      | React                | 18.x    | Functional components + hooks only. No class components.                |
| Language       | TypeScript           | 5.x     | Strict mode. No `any`. No type assertions unless unavoidable.           |
| Build Tool     | Vite                 | 5.x     | Dev server at `http://localhost:5173`                                   |
| Styling        | Tailwind CSS         | 3.x     | Utility-first. Semantic tokens only. No raw color values.               |
| UI Components  | shadcn/ui            | Latest  | Built on Radix UI. Generated into `src/components/ui/`.                 |
| Animations     | Framer Motion        | Latest  | `fadeUp` variant pattern. Respect `prefers-reduced-motion`.             |
| Routing        | React Router DOM     | v6      | Client-side SPA routing. `<Link>` and `useNavigate` only.               |
| Icons          | Lucide React         | Latest  | Import individually. Never import the entire library.                   |
| Fonts          | Sora + Inter         | —       | Via Google Fonts. `font-heading` = Sora. `font-body` = Inter.           |
| Sanitization   | DOMPurify            | Latest  | Via `SafeHtml` component. Never use `dangerouslySetInnerHTML` directly. |
| Image CDN      | Cloudinary           | —       | `nairobidevops` account. Full URLs in data files.                       |
| Server state   | TanStack React Query | v5      | Installed and configured. Use for all CMS/API calls. Do NOT remove.     |
| Env validation | Custom               | —       | `src/config/validateEnv.ts`. Runs at app boot in `main.tsx`.            |

### What is NOT in this project

Do not suggest, install, or reference any of the following — they are not used and should not be added without an explicit architectural decision:

- ❌ Next.js, Remix, Astro, Nuxt, SvelteKit — this is Vite + React, not a meta-framework
- ❌ Redux, Zustand, Jotai, MobX — no global state library; use React `useState`
- ❌ Axios — use native `fetch` or React Query
- ❌ Styled Components, CSS Modules, Emotion — Tailwind only
- ❌ Jest — confirm testing framework before generating test files (see Section 11)
- ❌ Express, Fastify, any server framework — there is no backend
- ❌ Prisma, Mongoose, any ORM — there is no database
- ❌ `next/image`, `next/link`, `next/router` — wrong framework
- ❌ Lovable, Supabase — legacy scaffolding references, not in use

---

## 3. Project Structure — Where Everything Lives

```
devopssummit.africa-v3/
├── agents/
│   └── CONTEXT.md               ← YOU ARE HERE — single source of truth for agents
│
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       ├── content_update.md
│       └── config.yml
│
├── docs/
│   ├── ARCHITECTURE.md          ← System design, ADRs, deployment
│   ├── CMS_SCHEMA.md            ← All content type schemas + known data issues
│   └── CONTENT_GUIDE.md         ← How to update data files (for non-developers)
│
├── public/                      ← Static assets served as-is (images, PDFs, favicons)
│   └── assets/
│
├── src/
│   ├── assets/                  ← Bundled static images (imported in components)
│   │
│   ├── components/
│   │   ├── landing/             ← Homepage-only section components
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Speakers.tsx
│   │   │   ├── Tickets.tsx
│   │   │   ├── Sponsors.tsx
│   │   │   └── [other sections]
│   │   ├── layout/              ← Global layout wrappers — used on every page
│   │   │   ├── Navbar.tsx       ← Dual-mode: hash scroll (homepage) + route nav
│   │   │   └── Footer.tsx
│   │   └── ui/                  ← TWO CATEGORIES — see note below
│   │       ├── SafeHtml.tsx     ← Custom — DOMPurify wrapper. Edit freely.
│   │       ├── SectionHeader.tsx ← Custom — consistent section titles. Edit freely.
│   │       ├── SpeakerCard.tsx  ← Custom — speaker display. Edit freely.
│   │       ├── TicketCard.tsx   ← Custom — ticket tier card. Edit freely.
│   │       ├── BenefitCard.tsx  ← Custom — benefit item. Edit freely.
│   │       ├── StatBox.tsx      ← Custom — metric display. Edit freely.
│   │       ├── TeamCard.tsx     ← Custom — team member card. Edit freely.
│   │       └── [accordion, button, dialog, tabs...] ← shadcn GENERATED — NEVER edit
│   │
│   ├── config/
│   │   ├── env.ts               ← Centralized env access — use Env.X, not import.meta.env
│   │   └── validateEnv.ts       ← Startup validation — runs before React mounts
│   │
│   ├── data/                    ← Static TypeScript content files
│   │   ├── speakers.ts          ← Record<number, Speaker[]> keyed by year
│   │   ├── sponsors.ts          ← Record<number, Sponsor[]> + sponsorTestimonials
│   │   ├── summitData.ts        ← Record<number, PastSummit> + GrowthMetric[]
│   │   ├── faqs.ts              ← FAQItem[] + faqCategories + homepageFaqs
│   │   ├── tickets.ts           ← Ticket[] — do not edit without developer review
│   │   ├── benefits.ts          ← Benefit[]
│   │   ├── stats.ts             ← Stat[]
│   │   └── team.ts              ← TeamMember[]
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx       ← Breakpoint detection
│   │   └── use-toast.ts         ← shadcn toast hook
│   │
│   ├── lib/
│   │   └── utils.ts             ← cn() class merger + misc helpers
│   │
│   ├── pages/                   ← One file per route
│   │   ├── Index.tsx            ← /
│   │   ├── AboutUs.tsx          ← /about
│   │   ├── Schedule.tsx         ← /schedule
│   │   ├── Sponsorship.tsx      ← /sponsorship
│   │   ├── PastSummits.tsx      ← /past-summits
│   │   ├── CodeOfConduct.tsx    ← /code-of-conduct
│   │   ├── PrivacyPolicy.tsx    ← /privacy-policy
│   │   ├── FAQs.tsx             ← /faqs
│   │   └── NotFound.tsx         ← * (404)
│   │
│   ├── scripts/
│   │   └── fetch-gallery.ts     ← Build-time ImageKit sync. Not bundled into app.
│   │
│   ├── test/                    ← Test files
│   │
│   ├── types/
│   │   └── index.ts             ← ALL shared TypeScript interfaces live here
│   │
│   ├── App.tsx                  ← Router config + QueryClientProvider
│   ├── main.tsx                 ← Entry point — calls validateEnv() before mounting
│   └── index.css                ← Global styles + CSS design tokens (HSL variables)
│
├── .env.example                 ← Committed — documents all required variables
├── .env.local                   ← NEVER committed — local secrets
├── tailwind.config.ts           ← Design tokens — add custom tokens here
├── tsconfig.json                ← TypeScript config — strict mode enabled
├── vite.config.ts               ← Vite config — includes @/ path alias
├── components.json              ← shadcn/ui config
├── PRD.md                       ← Product requirements document
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
└── LICENSE
```

---

## 4. Routing — All Routes

| Route              | Component           | Notes                                |
| ------------------ | ------------------- | ------------------------------------ |
| `/`                | `Index.tsx`         | Landing page — homepage sections     |
| `/about`           | `AboutUs.tsx`       | Mission, values, community, timeline |
| `/schedule`        | `Schedule.tsx`      | Two-day programme                    |
| `/sponsorship`     | `Sponsorship.tsx`   | Sponsor tiers and inquiry            |
| `/past-summits`    | `PastSummits.tsx`   | Year-tabbed past editions            |
| `/code-of-conduct` | `CodeOfConduct.tsx` | Static text page                     |
| `/privacy-policy`  | `PrivacyPolicy.tsx` | Static text page                     |
| `/faqs`            | `FAQs.tsx`          | Accordion by category                |
| `*`                | `NotFound.tsx`      | 404 fallback                         |

### Navbar navigation modes

The `Navbar` component operates in two modes:

- **On `/`** — hash-based scroll: `#speakers`, `#tickets`, `#schedule`, etc.
- **On all other routes** — React Router `<Link>` navigation

When linking from a non-home page to a homepage section, navigate to `/#section-id` not just `#section-id`.

---

## 5. Design System — Use These Exactly

### CSS Variables → Tailwind Tokens

All design tokens are HSL-based CSS variables defined in `src/index.css`. Always use Tailwind semantic tokens — never raw color values.

| CSS Variable         | Tailwind Usage                        | Purpose                                  |
| -------------------- | ------------------------------------- | ---------------------------------------- |
| `--background`       | `bg-background` / `text-background`   | Page background                          |
| `--foreground`       | `text-foreground`                     | Primary text                             |
| `--primary`          | `bg-primary` / `text-primary`         | Brand blue (`217 91% 60%`)               |
| `--secondary`        | `bg-secondary` / `text-secondary`     | Accent cyan (`199 89% 60%`)              |
| `--muted`            | `bg-muted`                            | Subtle backgrounds                       |
| `--muted-foreground` | `text-muted-foreground`               | Secondary / subdued text                 |
| `--dark-bg`          | `bg-dark-bg`                          | Dark section backgrounds (`222 47% 11%`) |
| `--card-dark`        | `bg-card-dark`                        | Dark card backgrounds                    |
| `--destructive`      | `bg-destructive` / `text-destructive` | Error and warning states                 |
| `--border`           | `border-border`                       | Borders                                  |

```tsx
// ✅ Always correct
<div className="bg-background text-foreground border-border">
<h2 className="text-primary font-heading">
<section className="bg-dark-bg">

// ❌ Never do this
<div className="bg-white text-gray-900 border-gray-200">
<div style={{ backgroundColor: '#1a1a2e' }}>
<div className="bg-[#FF6B00]">
```

### Typography

```tsx
// Headings — Sora font
<h1 className="font-heading font-bold text-4xl">
<h2 className="font-heading font-semibold text-2xl">

// Body — Inter font
<p className="font-body text-base">
```

### Utility Classes

```tsx
// Responsive horizontal padding — use on all page sections
<section className="section-padding">

// Gradient text — primary to secondary
<span className="text-gradient">Africa DevOps Summit</span>
```

### Responsive Breakpoints

Always test and implement at all three:

| Breakpoint | Width  | Tailwind prefix      |
| ---------- | ------ | -------------------- |
| Mobile     | 375px  | (default, no prefix) |
| Tablet     | 768px  | `md:`                |
| Desktop    | 1280px | `lg:` or `xl:`       |

---

## 6. Component Patterns — Replicate These Exactly

### Page component structure

Every page must follow this exact pattern (Navbar and Footer are managed globally in RootLayout):

```tsx
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

// Animation variants — define at module level, not inside component
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function MyPage() {
  return (
    <main>
      <section className="section-padding py-16">
        <div className="container mx-auto">
          <SectionHeader title="Section Title" subtitle="Supporting description here" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* content */}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
```

### Component declaration — plain function, never React.FC

```tsx
// ✅ Correct
interface SpeakerCardProps {
  name: string;
  designation: string | null;
  imageUrl: string | null;
}

export default function SpeakerCard({ name, designation, imageUrl }: SpeakerCardProps) {
  return ( /* ... */ );
}

// ❌ Never use React.FC
const SpeakerCard: React.FC<SpeakerCardProps> = ({ name }) => { ... }
```

### Section header — always use SectionHeader

```tsx
import SectionHeader from "@/components/ui/SectionHeader";

// Every section title uses this component — never raw h2
<SectionHeader
  title="Our Speakers"
  subtitle="Meet the practitioners shaping Africa's DevOps future"
/>;
```

### Rendering CMS / dynamic HTML — always use SafeHtml

```tsx
import SafeHtml from "@/components/ui/SafeHtml";

// ✅ Only approved way to render HTML strings
<SafeHtml content={speaker.bio} />

// ❌ Never — bypasses DOMPurify sanitization
<div dangerouslySetInnerHTML={{ __html: speaker.bio }} />
```

### External links — always include rel attribute

```tsx
// ✅ Correct — prevents reverse tabnapping
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Link
</a>

// ❌ Missing rel — security vulnerability
<a href="https://example.com" target="_blank">Link</a>
```

### Icons — import individually from lucide-react

```tsx
// ✅ Correct — tree-shakeable
import { Server, Users, Cloud } from "lucide-react";

// ❌ Never — imports entire library
import * as Icons from "lucide-react";
```

### Environment variables — always via Env constant

```tsx
// ✅ Correct
import { Env } from "@/config/env";
const apiUrl = Env.CMS_API_URL;

// ❌ Never access import.meta.env directly outside src/config/env.ts
const apiUrl = import.meta.env.VITE_CMS_API_URL;
```

### Preference for `globalThis`

Always prefer `globalThis` over `window` for accessing global properties (e.g., `globalThis.window`, `globalThis.innerWidth`, `globalThis.scrollTo`). In tests, use `(globalThis as unknown as Window)` for `fireEvent` to satisfy TypeScript.

### Framer Motion — respect reduced motion

```tsx
import { motion, useReducedMotion } from "framer-motion";

// Framer Motion respects prefers-reduced-motion automatically when using
// useReducedMotion() — always wire this up in animated components
export default function AnimatedSection() {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={variants} initial="hidden" whileInView="visible">
      {/* content */}
    </motion.div>
  );
}
```

### Adding a shadcn/ui component

```bash
# Always use the CLI — never manually create files in src/components/ui/
npx shadcn@latest add dialog
npx shadcn@latest add data-table
```

Files generated into `src/components/ui/` by shadcn are **never manually edited**. Custom wrappers go in `src/components/shared/` or alongside the feature that needs them.

---

## 7. TypeScript Conventions — Strict Rules

### No `any` — ever

```ts
// ✅ Define the type properly
interface ApiResponse {
  data: Speaker[];
  total: number;
}

// ❌ Never
const response: any = await fetch(...);
```

### All interfaces in `src/types/index.ts`

```ts
// ✅ Defined in src/types/index.ts, imported everywhere
import { Speaker, Sponsor, FAQItem } from "@/types";

// ❌ Never define interfaces inline in component files
// (unless they are truly component-local prop types)
```

### Imports — always use `@/` alias

```ts
// ✅ Correct — uses Vite path alias
import { Speaker } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import { speakers } from "@/data/speakers";
import { cn } from "@/lib/utils";

// ❌ Never use relative paths for cross-directory imports
import { Speaker } from "../../../types";
import SectionHeader from "../../components/ui/SectionHeader";
```

### Null vs undefined vs optional

Follow these rules consistently with the existing codebase:

```ts
// Use null for "value exists but is empty/unknown" (database-style)
imageUrl: string | null;    // photo not yet uploaded
company: string | null;     // independent speaker, no company

// Use optional (?) for "field may not exist at all"
isKeynote?: boolean;        // omit for non-keynotes
slidesUrl?: HttpUrl | null; // field doesn't apply to all speaker types

// Never mix: don't use undefined where null is expected by the interface
imageUrl: undefined;        // ❌ — use null
```

### File naming conventions

| Type       | Convention              | Example                |
| ---------- | ----------------------- | ---------------------- |
| Components | PascalCase              | `SpeakerCard.tsx`      |
| Pages      | PascalCase              | `Schedule.tsx`         |
| Hooks      | camelCase, `use` prefix | `useScrollPosition.ts` |
| Utilities  | camelCase               | `formatDate.ts`        |
| Data files | camelCase               | `speakers.ts`          |
| Type files | camelCase               | `index.ts`             |

---

## 8. Data Model — Current Interfaces

All interfaces are defined in `src/types/index.ts`. These are the exact current types — do not invent field names.

```ts
export type EntityId = number | string;
export type HttpUrl = `http://${string}` | `https://${string}`;

// Speaker — used for both current and past summit speakers
// ⚠️ Known issue: one interface serving two shapes — see Section 10
export interface Speaker {
  id: EntityId;
  name: string;
  designation: string | null;
  company?: string | null;
  imageUrl: HttpUrl | string | null; // ⚠️ should be HttpUrl | null — string is redundant
  eventRole?: string | null; // current year speakers only
  topic?: string | null; // past summit speakers only
  videoUrl?: HttpUrl | null; // past summit speakers only
  slidesUrl?: HttpUrl | null; // past summit speakers only
  isKeynote?: boolean;
  // Planned additions (not yet in interface):
  // twitter?: string | null;          // format: "@handle"
  // linkedin?: string | null;         // format: "in/handle"
  // github?: string | null;           // format: "@handle"
}

export interface Ticket {
  id: EntityId;
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
  ctaLabel: string;
}

export interface TeamMember {
  id: EntityId;
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl?: HttpUrl | null; // ⚠️ stores full URL — inconsistent with planned speaker handle format
}

export interface Sponsor {
  id: EntityId;
  name: string;
  logoUrl: string;
  packageTier?: "Platinum" | "Gold" | "Silver" | "Bronze" | "Community" | (string & {});
  // ⚠️ Missing: websiteUrl — sponsors cannot be linked
}

export interface Stat {
  value: string;
  label: string;
}

export interface Benefit {
  id: EntityId;
  icon: string; // ⚠️ Lucide icon name — loosely typed string, no validation
  title: string;
  description: string;
}

export interface Testimonial {
  id: EntityId;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface SponsorTestimonial {
  id: EntityId;
  quote: string;
  name: string;
  role: string; // job title only, not company
  company: string;
  image?: string;
  verified?: boolean; // ⚠️ all current entries are false — do not display unverified testimonials
}
```

### Types defined locally (not yet in index.ts — known issue)

```ts
// src/data/summitData.ts — should be moved to src/types/index.ts
export interface SummitHighlight {
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface PastSummit {
  year: number;
  theme: string;
  themeDescription: string;
  date: string; // "Month D–D, YYYY"
  venue: string;
  location: string;
  attendees: string; // "500+"
  countries: string; // "9+"
  reportUrl: string;
  videoUrl: string;
  highlights: SummitHighlight[];
}

export interface GrowthMetric {
  label: string;
  values: { year: string; value: number }[]; // ⚠️ year is string here — should be number
}

// src/data/faqs.ts — should be moved to src/types/index.ts
export interface FAQItem {
  question: string;
  answer: string;
  category: string; // must match one of faqCategories exactly
}
```

### Missing type — Session (does not exist yet)

```ts
// ⚠️ CRITICAL GAP: Session type does not exist in the codebase
// The /schedule page has no typed data model
// When adding session data, create this interface in src/types/index.ts:

export type SessionFormat =
  | "Keynote"
  | "Talk"
  | "Workshop"
  | "Panel"
  | "Lightning Talk"
  | "Unconference";

export type SessionTrack =
  | "Platform Engineering"
  | "DevSecOps"
  | "Cloud Native"
  | "SRE & Observability"
  | "AI/MLOps"
  | "Community & Culture";

export interface Session {
  id: EntityId;
  title: string;
  speakerId: EntityId | EntityId[] | null;
  day: 1 | 2;
  startTime: string; // "09:00" 24hr format
  endTime: string; // "09:45"
  format: SessionFormat;
  track: SessionTrack | null;
  room: string | null;
  description?: string | null;
  isBreak?: boolean;
}
```

---

## 9. Data File Patterns — Replicate These Exactly

### Year-keyed pattern (speakers, sponsors, pastSummitsData)

```ts
// Record<number, T[]> — keyed by summit year
export const speakers: Record<number, Speaker[]> = {
  2026: [
    /* current year */
  ],
  2025: [
    /* past edition */
  ],
  2024: [
    /* past edition */
  ],
};

// When adding a new year: add to the TOP of the record
// When archiving a year: move 2026 entries to the pattern below after the event
```

### Speaker ID conventions

```
Current year keynote:  "2026-k1", "2026-k2", "2026-k3"
Current year panelist: "2026-p1", "2026-p2"
Current year speaker:  "2026-s1" ... "2026-s8"
Past summit speaker:   "2025-1" ... "2025-17"  (sequential, no role prefix)
```

### Image URL patterns

```
// Cloudinary (production — use for all real speaker/sponsor images)
https://res.cloudinary.com/nairobidevops/image/upload/v[VERSION]/[FILENAME].[ext]

// Unsplash (placeholder only — never for real speaker images)
https://images.unsplash.com/photo-[ID]?w=400&h=400&fit=crop
```

### Social handle format (planned — not yet in interface)

```ts
twitter: "@handle"; // not "https://twitter.com/handle"
linkedin: "in/handle"; // not "https://linkedin.com/in/handle"
github: "@handle"; // not "https://github.com/handle"
```

### Null discipline in data files

```ts
// Use null for missing optional values — never undefined or empty string
imageUrl: null,    // ✅
imageUrl: "",      // ❌
imageUrl: undefined, // ❌

videoUrl: null,    // ✅
```

### FAQ category — must match exactly

```ts
// Valid categories — case-sensitive, must match faqCategories array exactly
"General";
"Tickets & Registration";
"Speakers & Content";
"Venue & Travel";
"Sponsorship";
"Community";
```

---

## 10. Known Issues in the Codebase

These are real, documented issues. Do NOT "fix" them unless the fix has been discussed and approved — some require coordinated changes across multiple files.

| #   | Issue                                                                                                          | Severity  | Status |
| --- | -------------------------------------------------------------------------------------------------------------- | --------- | ------ |
| 1   | `Speaker` interface overloaded — current and past speakers share one type with incompatible field sets         | 🔴 High   | Open   |
| 2   | `Speaker.imageUrl: HttpUrl \| string \| null` — `string` makes `HttpUrl` validation pointless                  | 🔴 High   | Open   |
| 3   | `Sponsor` has no `websiteUrl` — intentionally omitted as we only fetch logos                                   | 🟢 Low    | Closed |
| 4   | `Session` type is entirely missing — schedule page has no typed data model                                     | 🔴 High   | Open   |
| 5   | `Sponsor.id` resets to `1` each year — not globally unique                                                     | 🟡 Medium | Open   |
| 6   | `PastSummit`, `SummitHighlight`, `GrowthMetric`, `FAQItem` defined locally — should be in `src/types/index.ts` | 🟡 Medium | Open   |
| 7   | `icon` fields in `Benefit` and `SummitHighlight` are loose strings — Lucide icon names not validated           | 🟡 Medium | Open   |
| 8   | `GrowthMetric.year` is `string` — everything else uses `number` for years                                      | 🟡 Medium | Open   |
| 9   | `TeamMember.linkedinUrl` is a full URL — inconsistent with planned speaker handle format                       | 🟡 Medium | Open   |
| 10  | `PastSummit` has no `testimonials` field — `Testimonial` interface exists but is unused                        | 🟢 Low    | Open   |
| 11  | All 8 `SponsorTestimonial` entries have `verified: false` — unverified quotes should not display               | 🟢 Low    | Open   |

**When generating code that touches any of these areas:** Do not silently "fix" the issue as part of an unrelated change. Note the issue in a code comment and flag it in the PR.

---

## 11. Security Rules — Non-Negotiable

### Never access `import.meta.env` directly

```ts
// ✅ Always use the Env constant
import { Env } from "@/config/env";
const url = Env.CMS_API_URL;

// ❌ Never — bypasses validation
const url = import.meta.env.VITE_CMS_API_URL;
```

### Never add secrets to VITE\_ prefixed variables

```
# ✅ Safe — public configuration, visible in browser bundle
VITE_CMS_API_URL=https://api.example.com
VITE_IMAGEKIT_PUBLIC_KEY=public_abc123

# ❌ CRITICAL VIOLATION — private keys with VITE_ are exposed in the browser
VITE_IMAGEKIT_PRIVATE_KEY=private_xyz789
VITE_STRIPE_SECRET_KEY=sk_live_...

# ✅ Correct — private keys without VITE_ are build-time only
IMAGEKIT_PRIVATE_KEY=private_xyz789
```

### Never use `dangerouslySetInnerHTML`

```tsx
// ✅ Always use SafeHtml for rendering HTML strings
<SafeHtml content={htmlString} />

// ❌ Never — bypasses DOMPurify
<div dangerouslySetInnerHTML={{ __html: htmlString }} />
```

### Never commit `.env.local`

If `.env.local` appears in a diff, refuse to include it and remind the contributor it is gitignored.

### Update `.env.example` when adding variables

Any new `VITE_` or private variable must be added to `.env.example` with a descriptive dummy value and comment.

---

## 12. Styling Rules — Hard Constraints

```tsx
// ✅ Semantic Tailwind tokens
className="bg-primary text-foreground border-border"

// ✅ Responsive utilities
className="text-sm md:text-base lg:text-lg"

// ✅ Custom token defined in tailwind.config.ts
className="bg-dark-bg"

// ❌ Hardcoded color classes
className="bg-blue-600 text-gray-900"

// ❌ Arbitrary values
className="w-[347px] mt-[23px] bg-[#1a1a2e]"

// ❌ Inline styles
style={{ backgroundColor: '#1a1a2e', marginTop: '23px' }}

// ❌ External CSS files (other than src/index.css globals)
import "./MyComponent.css"
```

---

## 13. State Management Rules

```tsx
// ✅ Local state for UI concerns
const [isOpen, setIsOpen] = useState(false);
const [activeTab, setActiveTab] = useState<number>(2026);
const [lightboxImage, setLightboxImage] = useState<string | null>(null);

// ✅ React Query for server/async state (CMS, APIs)
const { data: speakers, isLoading } = useQuery({
  queryKey: ["speakers", year],
  queryFn: () => fetchSpeakers(year),
});

// ❌ Never install or suggest Redux, Zustand, Jotai, or any global state library
// The app has no shared cross-page state that warrants one
```

---

## 14. Deployment Context — Affects Code Decisions

- **Hosting:** cPanel shared hosting — static files only
- **Build output:** `dist/` folder from `vite build`
- **Node.js:** Not available at runtime — no server processes
- **SPA routing:** Requires `.htaccess` rewrite rule — all paths redirect to `index.html`
- **Environment variables:** Baked in at build time — no runtime env injection
- **No preview environments** — changes go to production after merge

This means:

- No server-side rendering code
- No API routes or serverless functions
- No dynamic `import.meta.env` reading at runtime
- Bundle size matters more than on platforms with CDN edge caching

---

## 15. Testing

```bash
npm run test          # run tests once
npm run test:watch    # run in watch mode
```

> **Important:** The testing framework is not yet fully documented. Before generating test files, confirm what framework is in use (`src/test/` setup file). Do not assume Jest — it may be Vitest.

When writing tests:

- Unit test utility functions in `src/lib/`
- Component tests for critical UI: `SafeHtml`, `SpeakerCard`, navigation
- Do not generate E2E tests — out of scope for current MVP phase

---

## 16. Available npm Scripts

| Command              | What it does                                |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start dev server at `http://localhost:5173` |
| `npm run build`      | Production build → `dist/`                  |
| `npm run build:dev`  | Dev build with source maps                  |
| `npm run preview`    | Serve `dist/` locally                       |
| `npm run lint`       | Run ESLint                                  |
| `npm run typecheck`  | TypeScript check without emit               |
| `npm run test`       | Run tests once                              |
| `npm run test:watch` | Run tests in watch mode                     |

**Before suggesting any PR is ready:** `npm run build` AND `npm run lint` must pass with zero errors.

---

## 17. Content Types Quick Reference

When generating or editing content in `src/data/`, use this as a quick field reference:

### Speaker (current year — 2026)

```ts
{
  id: "2026-s9",              // unique, format: "YEAR-TYPE#"
  name: "Full Name",
  designation: "Job Title",   // title case, or null
  company: "Company Name",    // official name, or null
  imageUrl: "https://res.cloudinary.com/nairobidevops/...",  // or null
  eventRole: "Speaker",       // "Keynote Speaker" | "Panelist" | "Speaker"
  isKeynote: true,            // only if keynote, omit otherwise
}
```

### Speaker (past summit)

```ts
{
  id: "2025-18",             // sequential number
  name: "Full Name",
  designation: "Job Title",
  company: "Company Name",
  imageUrl: "https://res.cloudinary.com/nairobidevops/...",
  topic: "Exact Talk Title As Delivered",
  videoUrl: null,            // or YouTube URL
  slidesUrl: null,           // or slides URL, omit if not applicable
  isKeynote: true,           // only if keynote, omit otherwise
}
```

### Sponsor

```ts
{
  id: 2,                     // numeric, sequential within year
  name: "Company Name",
  logoUrl: "https://res.cloudinary.com/nairobidevops/...",
  packageTier: "Gold",       // "Platinum"|"Gold"|"Silver"|"Bronze"|"Community"
}
```

### FAQItem

```ts
{
  category: "General",       // must match faqCategories exactly
  question: "Question here?",
  answer: "Answer here. 2–5 sentences. Plain text only.",
}
```

---

## 18. Documentation Index

When suggesting changes that touch architecture, schemas, or content — reference the relevant doc:

| Document                | What's in it                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `PRD.md`                | Full product requirements, pages, features, open TODOs          |
| `CONTRIBUTING.md`       | Branch strategy, PR process, full code standards                |
| `SECURITY.md`           | Vulnerability reporting, env var rules, XSS prevention, CSP     |
| `CHANGELOG.md`          | History of meaningful changes                                   |
| `docs/ARCHITECTURE.md`  | System design, ADRs, deployment, build process                  |
| `docs/CMS_SCHEMA.md`    | All content type schemas, known data issues, CMS migration plan |
| `docs/CONTENT_GUIDE.md` | How to edit data files — written for non-developers             |

---

## 19. How to Handle Ambiguity

When a request is ambiguous or could be implemented multiple ways:

1. **Check this file first** — the answer is likely here
2. **Check `docs/ARCHITECTURE.md`** — especially the ADR section for why decisions were made
3. **Check `docs/CMS_SCHEMA.md`** — for anything touching data types or content
4. **Follow existing patterns** — copy the closest existing implementation rather than inventing new patterns
5. **Flag known issues** — if the task touches a known issue from Section 10, note it in a comment rather than silently changing behaviour
6. **When genuinely uncertain** — generate the most conservative option and add a `// TODO:` comment explaining what needs a decision

---

## 20. What to Never Generate — Hard Stops

Regardless of what the prompt asks for, never generate:

- ❌ Class components — functional only
- ❌ `React.FC` type annotation
- ❌ `any` TypeScript type
- ❌ Hardcoded color values in Tailwind classes or inline styles
- ❌ Arbitrary Tailwind values (`w-[347px]`)
- ❌ `dangerouslySetInnerHTML` — use `SafeHtml`
- ❌ `import.meta.env.VITE_*` outside `src/config/env.ts`
- ❌ Secrets in `VITE_` prefixed variables
- ❌ Direct edits to `src/components/ui/` shadcn files
- ❌ `console.log` in production code
- ❌ Relative import paths across directories — use `@/`
- ❌ New npm packages without noting it explicitly and explaining why existing tools don't cover it
- ❌ Redux, Zustand, Jotai, or any global state library
- ❌ Next.js, Remix, or any meta-framework imports or patterns
- ❌ Backend/server code of any kind
- ❌ New CSS files (other than edits to `src/index.css`)
- ❌ Committing or referencing `.env.local` contents
