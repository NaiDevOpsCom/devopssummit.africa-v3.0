# Contributing to Africa DevOps Summit

First off — thank you. This project is built by the African DevOps community, for the African DevOps community. Whether you're fixing a typo, improving a component, updating speaker content, or building a new feature, your contribution matters.

This guide covers everything you need to go from "I want to help" to "my PR is merged."

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style & Conventions](#code-style--conventions)
- [Working with shadcn/ui](#working-with-shadcnui)
- [Content Contributions](#content-contributions)
- [Code Review Expectations](#code-review-expectations)
- [What Not to Do](#what-not-to-do)
- [Getting Help](#getting-help)

---

## Ways to Contribute

You don't need to write code to contribute. Here are all the ways you can help:

| Type                                     | How                                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 🐛 **Report a bug**                      | [Open a bug report issue](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=bug_report.md)           |
| 💡 **Suggest a feature**                 | [Open a feature request issue](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=feature_request.md) |
| 💬 **Ask a question or discuss an idea** | [Start a GitHub Discussion](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/discussions)                               |
| 🛠️ **Fix a bug or build a feature**      | Clone the repo, make your changes, open a PR (see below)                                                                      |
| 📝 **Improve documentation**             | Edit any `.md` file and open a PR                                                                                             |
| 🎨 **Improve UI / design**               | Open an issue first to discuss, then submit a PR with screenshots                                                             |
| 📣 **Update event content**              | Speaker bios, schedule, photos — see [Content Contributions](#content-contributions)                                          |

**Not sure where to start?** Browse [open issues](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues) or [start a discussion](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/discussions) — the team is happy to help you find something that matches your skills and interest.

---

## Prerequisites

Make sure you have the following installed before starting:

- **Node.js ≥ 24.x** — required. We recommend managing versions with [nvm](https://github.com/nvm-sh/nvm):

  ```sh
  nvm install 24
  nvm use 24
  node --version  # should print v24.x.x or higher
  ```

- **npm** — comes bundled with Node.js
- **Git**
- A code editor — [VS Code](https://code.visualstudio.com/) is recommended. Install the following extensions for the best experience:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) _(if used)_

---

## Local Setup

Since this is a community project, contributors work from a local clone. You do not need to fork the repository unless you do not have push access.

```sh
# 1. Clone the repository
git clone git@github.com:NaiDevOpsCom/devopssummit.africa-v3.git
cd devopssummit.africa-v3

# 2. Install dependencies
npm install

# 3. Set up environment variables (see next section)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

> ⚠️ If port 5173 is in use, Vite will automatically try the next available port. Check your terminal output for the actual URL.

### Optional: Graphify knowledge graph

The repo ships project-scoped [Graphify](https://github.com/Graphify-Labs/graphify) config for
OpenCode. If you use OpenCode and want faster codebase queries:

```sh
pipx install graphifyy
graphify extract . --code-only   # local AST only — no API cost
```

See [`docs/graphify.md`](./graphify.md) for commands and troubleshooting. It is entirely optional —
ignore it if you use another editor.

---

## Environment Variables

All environment variables are documented in `.env.example`. Copy it to `.env.local` and fill in the values:

```sh
cp .env.example .env.local
```

**Rules:**

- **Never commit `.env.local`** — it is gitignored
- Always keep `.env.example` up to date when you add a new variable
- Variables must be prefixed with `VITE_` to be accessible in the app
- This is a static frontend app — all env vars are baked in at build time and visible in the browser bundle. **Do not store secrets in `VITE_` variables.**

---

## Available Scripts

| Command              | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`        | Start local dev server with hot module replacement at `http://localhost:5173` |
| `npm run build`      | Production build — output goes to `dist/`                                     |
| `npm run build:dev`  | Development build (with source maps)                                          |
| `npm run preview`    | Preview the production build locally before deploying                         |
| `npm run lint`       | Run ESLint across the codebase                                                |
| `npm run typecheck`  | TypeScript type checking without emitting files                               |
| `npm run test`       | Run tests once _(if tests exist for the area you're working on)_              |
| `npm run test:watch` | Run tests in watch mode                                                       |

> 💡 Always run `npm run build` and `npm run lint` before opening a PR to catch errors early.

---

## Development Workflow

1. **Check open issues or discussions** — see if the work you want to do is already being tracked. If not, open an issue or discussion to let the team know what you're planning.

2. **Create a branch** from `main` using the naming convention below

3. **Make your changes** — follow the existing code patterns and design system conventions in this guide

4. **Test in the browser** — check your changes across mobile, tablet, and desktop breakpoints

5. **Run the build** — `npm run build` must pass with zero errors

6. **Lint your code** — `npm run lint` must pass with no new warnings

7. **Commit** using [Conventional Commits](#commit-conventions) format

8. **Push** your branch and open a Pull Request against `main`

---

## Branching Strategy

Branch directly off `main`:

| Branch pattern                 | Use for                                     |
| ------------------------------ | ------------------------------------------- |
| `feat/<short-description>`     | New features or enhancements                |
| `fix/<short-description>`      | Bug fixes                                   |
| `docs/<short-description>`     | Documentation-only changes                  |
| `style/<short-description>`    | UI/visual changes with no logic impact      |
| `refactor/<short-description>` | Code restructuring with no behaviour change |
| `content/<short-description>`  | Content updates (speakers, schedule, copy)  |

**Examples:**

```
feat/speaker-search-filter
fix/mobile-navbar-overlap
docs/update-cms-schema
content/add-2026-speakers
```

Keep branch names lowercase, hyphen-separated, and descriptive but brief.

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/). This keeps the git history readable and makes changelogs easier to generate.

**Format:**

```
<type>: <short present-tense description>
```

**Types:**

| Type       | When to use                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | Adding a new feature or page section              |
| `fix`      | Fixing a bug                                      |
| `docs`     | Documentation changes only                        |
| `style`    | Visual/UI changes that don't affect logic         |
| `refactor` | Code restructuring — no behaviour change          |
| `content`  | Updating event content (speakers, schedule, etc.) |
| `chore`    | Dependency updates, config changes, build tweaks  |

**Examples:**

```
feat: add speaker video links to past summits page
fix: correct navbar active state on /past-summits route
docs: update CMS schema documentation
style: adjust hero section spacing on mobile
refactor: extract MetricCard into shared component
content: add 2026 keynote speaker profiles
chore: upgrade tailwind to v4
```

Keep the description short (under 72 characters) and in the present tense.

---

## Pull Request Process

1. **Title** — use the same format as your commit message (e.g. `feat: add sponsor tier comparison table`)

2. **Description** — fill in the PR template:
   - What changed and why
   - Link to the related issue or discussion (e.g. `Closes #42`)
   - Screenshots or screen recordings for any UI changes (before and after)
   - Notes on how you tested the change

3. **Self-review** — read through your own diff before requesting review. Catch typos, leftover debug code, and console logs yourself first.

4. **Request a reviewer** — tag at least one core maintainer for review

5. **Respond to feedback** — address comments or explain your reasoning. PRs are a conversation, not a gate.

6. **Merge** — a maintainer will squash and merge once approved

> ⚠️ PRs that break the build (`npm run build`), introduce TypeScript errors, or have unresolved ESLint warnings will not be merged until fixed.

---

## Code Style & Conventions

### TypeScript

- Avoid `any` — define proper types and interfaces in `src/types/`
- Use **plain function declarations** for components, not `React.FC`:

  ```tsx
  // ✅ Preferred
  export default function SpeakerCard({ name, bio }: SpeakerCardProps) { ... }

  // ❌ Avoid
  const SpeakerCard: React.FC<SpeakerCardProps> = ({ name, bio }) => { ... }
  ```

- Export prop types as named interfaces alongside the component file

### Components

- Functional components with hooks only — no class components
- One component per file; filename matches the component name (PascalCase)
- Keep components small and focused — if a component exceeds ~150 lines, consider splitting it
- Every page wraps content with `<Navbar />` and `<Footer />`
- Use `<SectionHeader />` for consistent section titles across pages

### Styling

- **Tailwind only** — no inline styles, no external `.css` files (except `src/styles/globals.css`)
- Use semantic Tailwind tokens, not raw values:

  ```tsx
  // ✅ Correct — uses design tokens
  <p className="text-foreground bg-primary">...</p>

  // ❌ Wrong — hardcoded color
  <p className="text-gray-900 bg-orange-500">...</p>
  ```

- Do not use arbitrary Tailwind values (e.g. `w-[347px]`) — add custom tokens to `tailwind.config.ts` instead
- Responsive design is required — always test at mobile (`375px`), tablet (`768px`), and desktop (`1280px`) widths

### Animations

- Use **Framer Motion** for animations — use consistent `fadeUp` variants defined in `src/lib/animations.ts`
- Keep animations subtle and purposeful — they should enhance UX, not distract
- Always respect `prefers-reduced-motion` — Framer Motion handles this via `useReducedMotion()`

### Data & Content

- Store all static data in `src/data/` as typed `.ts` files
- All data exports must have TypeScript types defined in `src/types/`
- Do not hardcode event-specific strings (dates, venue, names) directly in component JSX — reference them from `src/data/`

### Imports

- Use the `@/` path alias for all imports — no relative `../../../` chains:

  ```ts
  // ✅ Correct
  import { SpeakerCard } from "@/components/shared/SpeakerCard";

  // ❌ Avoid
  import { SpeakerCard } from "../../../components/shared/SpeakerCard";
  ```

### File Naming

| Type       | Convention                  | Example                |
| ---------- | --------------------------- | ---------------------- |
| Components | PascalCase                  | `SpeakerCard.tsx`      |
| Pages      | PascalCase                  | `Schedule.tsx`         |
| Hooks      | camelCase with `use` prefix | `useScrollPosition.ts` |
| Utilities  | camelCase                   | `formatDate.ts`        |
| Data files | camelCase                   | `speakers.ts`          |
| Type files | camelCase                   | `speaker.types.ts`     |

---

## Working with shadcn/ui

shadcn/ui components are generated into `src/components/ui/`. **Do not manually edit files in this directory** — they will be overwritten when the component is updated via the CLI.

To add a new shadcn/ui component:

```sh
npx shadcn@latest add <component-name>

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add data-table
```

To update an existing component:

```sh
npx shadcn@latest add <component-name> --overwrite
```

Custom wrappers or compositions built on top of shadcn primitives belong in `src/components/shared/`, not `src/components/ui/`.

---

## Content Contributions

Not all contributions require code changes. If you're an organizer, volunteer, or community member updating event content:

### What counts as a content contribution

- Speaker profiles (name, bio, photo, talk title, social links)
- Session and schedule updates
- Sponsor logos and descriptions
- Past summit photos, recaps, and testimonials
- Copy corrections (typos, outdated information)

### How to contribute content

**For CMS-managed content** _(speakers, schedule, sponsors, past summits):_

> `TODO: Document CMS access and update process once CMS is confirmed.`

**For static content** _(FAQs, Code of Conduct, ticket tiers, etc.):_

1. Edit the relevant file in `src/data/`
2. Follow the existing TypeScript structure and types
3. Open a PR with the label `content`

**For images:**

- Use WebP format where possible
- Keep file sizes under 200KB — compress using [Squoosh](https://squoosh.app/) or [TinyPNG](https://tinypng.com/)
- Use descriptive, kebab-case filenames: `amina-njoroge-speaker-2026.webp`
- Place images in the appropriate subfolder under `public/assets/`

---

## Code Review Expectations

When your PR is reviewed, reviewers will check for:

- ✅ Build passes (`npm run build` — no errors)
- ✅ No TypeScript errors (`npm run typecheck`)
- ✅ No new ESLint warnings (`npm run lint`)
- ✅ Tailwind semantic tokens used — no hardcoded colors
- ✅ Components are small, typed, and focused
- ✅ Responsive layout tested on mobile, tablet, and desktop
- ✅ Accessibility basics preserved (alt text, aria-labels, semantic HTML, keyboard navigation)
- ✅ No leftover `console.log`, commented-out code, or debug artifacts
- ✅ `.env.example` updated if new env variables were added

---

## What Not to Do

To keep the codebase healthy, please avoid:

- ❌ **Editing `src/components/ui/` directly** — use the shadcn CLI; manual edits get overwritten
- ❌ **Committing `.env.local`** — it's gitignored for a reason
- ❌ **Pushing directly to `main`** — all changes go through PRs
- ❌ **Using `any` in TypeScript** — define the type properly
- ❌ **Hardcoding colors, font sizes, or spacing** outside of `tailwind.config.ts`
- ❌ **Adding large uncompressed images** to `public/` — optimise before committing
- ❌ **Mixing multiple unrelated changes in one PR** — keep PRs focused

---

## Getting Help

Stuck? Not sure where to start? Here's how to get help:

- 💬 **GitHub Discussions** — [Ask a question or share an idea](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/discussions)
- 🐛 **GitHub Issues** — [Report a bug or request a feature](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues)
- 📧 **Email the team** — `TODO: hello@devopssummit.africa`
- 💬 **Community chat** — `TODO: Link to Discord / Slack / WhatsApp`

We're a friendly community — no question is too small. We'd rather you ask than get blocked.

---

_Thank you for contributing to the Africa DevOps Summit. Let's build something the continent is proud of. 🌍_
