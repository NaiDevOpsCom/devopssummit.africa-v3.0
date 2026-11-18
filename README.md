<div align="center">

# 🌍 Africa DevOps Summit

**Africa's premier DevOps, Cloud & SRE conference.**

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[🌐 Live Site](https://devopssummit.africa) · [📋 PRD](./docs/prd.md) · [🤝 Contributing](./docs/contributing.md) · [🐛 Report a Bug](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=bug_report.md) · [💡 Request a Feature](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=feature_request.md)

<!-- TODO: Replace with an actual screenshot or banner image of the site -->
<!-- ![Africa DevOps Summit Screenshot](./public/assets/og-image.png) -->

</div>

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Community](#community)
- [License](#license)

---

## About the Project

This repository contains the official website for the **Africa DevOps Summit** — a community-driven conference that brings together DevOps engineers, SREs, software developers, cloud practitioners, and tech leaders from across Africa and beyond.

The website is the event's primary digital presence, handling:

- 📣 Event marketing and promotion
- 🎤 Speaker profiles and conference schedule
- 🎟️ Ticket information and registration
- 🤝 Sponsor acquisition and engagement
- 📸 Past summit archives, photo galleries, and recaps

This is a **frontend-only** React + Vite + TypeScript application. There is no backend server. All content is either statically defined or fetched client-side from a CMS.

> **Status:** MVP complete — actively iterating. See [open issues](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues) for what's being worked on.

---

## Tech Stack

| Technology                                    | Purpose                            |
| --------------------------------------------- | ---------------------------------- |
| [React 18+](https://react.dev/)               | UI component framework             |
| [Vite](https://vitejs.dev/)                   | Build tool and development server  |
| [TypeScript](https://www.typescriptlang.org/) | Strictly typed JavaScript          |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling              |
| [shadcn/ui](https://ui.shadcn.com/)           | Accessible UI component primitives |

---

## Project Structure

```
devopssummit.africa-v3/
├── public/                  # Static assets (images, fonts, favicons, PDFs)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui generated components — do not edit manually
│   │   └── shared/          # Custom shared components (Navbar, Footer, etc.)
│   ├── pages/               # Route-level page components
│   ├── data/                # Static content (JSON / TypeScript)
│   ├── types/               # Shared TypeScript interfaces and types
│   ├── lib/                 # Utility functions and helpers
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component and routing
│   └── main.tsx             # Application entry point
├── .env.example             # Required environment variables (commit this)
├── .env.local               # Your local secrets (never commit this)
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── components.json          # shadcn/ui config
├── PRD.md                   # Full product requirements and architecture decisions
└── README.md                # You are here
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed before proceeding.

**Node.js** — version **24 or higher** is required.

We recommend managing Node versions with [nvm](https://github.com/nvm-sh/nvm):

```sh
# Install the required Node version
nvm install 24
nvm use 24

# Verify
node --version   # should print v24.x.x or higher
npm --version
```

### Installation

1. **Clone the repository**

   ```sh
   git clone git@github.com:NaiDevOpsCom/devopssummit.africa-v3.git
   cd devopssummit.africa-v3
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables** _(see next section)_

4. **Start the development server**

   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Environment Variables

This project uses Vite's environment variable system. Variables must be prefixed with `VITE_` to be accessible in the browser.

```sh
# Copy the example file
cp .env.example .env.local

# Open .env.local and fill in the required values
```

Refer to `.env.example` for the full list of variables and descriptions. **Never commit `.env.local`** — it is gitignored by default.

> ⚠️ Because this is a static frontend app deployed to shared hosting, environment variables are **baked in at build time**. Do not store secrets in `VITE_` variables — they will be visible in the browser bundle.

---

### Available Scripts

| Command             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Start the local development server at `http://localhost:5173` |
| `npm run build`     | Build the production-ready site into `dist/`                  |
| `npm run preview`   | Preview the production build locally before deploying         |
| `npm run lint`      | Run ESLint across the codebase                                |
| `npm run typecheck` | Run TypeScript type checking without emitting files           |

> 💡 Always run `npm run build` and verify it passes with no errors before opening a pull request.

---

## Contributing

Contributions are what make this project — and the African DevOps community — thrive. Whether you're fixing a typo, improving accessibility, building a new feature, or updating content, **every contribution matters**.

### How to get involved

- 🛠️ **Build something** — clone the repo, create a branch, and open a PR
- 💬 **Start a discussion** — have an idea or a question? [Open a GitHub Discussion](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/discussions)
- 🐛 **Report a bug** — [open a bug report issue](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=bug_report.md)
- 💡 **Request a feature** — [open a feature request issue](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues/new?template=feature_request.md)
- 📝 **Update content** — speaker bios, schedule, photos, copy corrections are all welcome

### Quick contribution steps

1. Clone the repo and create a branch off `main` using the naming convention: `feat/your-feature-name`
2. Make your changes — follow the code standards in [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Run `npm run build` and `npm run lint` — both must pass
4. Open a pull request against `main` with a clear description and screenshots for any UI changes

Not sure what to work on? [Browse open issues](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/issues) or [start a discussion](https://github.com/NaiDevOpsCom/devopssummit.africa-v3/discussions) — the team is happy to point you in the right direction.

Please read [**CONTRIBUTING.md**](./CONTRIBUTING.md) for the full guide including branch strategy, PR process, code standards, and how to add shadcn/ui components.

**Security issue?** Please do **not** open a public issue. Email us at `TODO: security@devopssummit.africa` instead.

---

## Documentation

| Document                                           | Description                                                    |
| -------------------------------------------------- | -------------------------------------------------------------- |
| [`PRD.md`](./PRD.md)                               | Full product requirements, architecture, pages, and open TODOs |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)             | How to contribute, branch strategy, code standards, PR process |
| [`CHANGELOG.md`](./CHANGELOG.md)                   | History of meaningful changes per release                      |
| [`SECURITY.md`](./SECURITY.md)                     | How to report security vulnerabilities                         |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)   | Key technical decisions and why they were made                 |
| [`docs/CMS_SCHEMA.md`](./docs/CMS_SCHEMA.md)       | CMS content types, fields, and validation rules                |
| [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md) | Guide for non-developer contributors updating content          |
| [`docs/graphify.md`](./docs/graphify.md)           | Optional codebase knowledge graph for contributors and agents  |

> Some of these documents are works in progress. See the [open TODO items in PRD.md](./PRD.md#12-open-questions--todos).

---

## Community

The Africa DevOps Summit is organised by the **Nairobi DevOps Community** — a grassroots community of DevOps practitioners across Africa.

- 🌐 Website: [devopssummit.africa](https://devopssummit.africa)
- 🐦 Twitter / X: [`TODO: @handle`](https://twitter.com/TODO)
- 💼 LinkedIn: [`TODO: LinkedIn page`](https://linkedin.com/TODO)
- 💬 Community chat: `TODO: Link to Discord / Slack / WhatsApp community`
- 📧 General enquiries: `TODO: hello@devopssummit.africa`

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ by the African DevOps community.

</div>
