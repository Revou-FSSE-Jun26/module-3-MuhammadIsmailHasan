# Bootcamp Module 3 — Muhammad Ismail Hasan

Frontend assignments for Module 3, organised by checkpoint. Each checkpoint is a
self-contained project; later ones do not modify earlier ones.

| Folder | Checkpoint | Stack |
|---|---|---|
| [`checkpoint-1/`](checkpoint-1) | Static pages and DOM scripting | HTML, Tailwind CSS 3, TypeScript |
| [`checkpoint-2/`](checkpoint-2) | Component-driven storefront with live data | Next.js 16, React 19, Tailwind CSS 4 |

## Checkpoint 1

Two projects, both built without a framework.

| Folder | Description |
|---|---|
| `checkpoint-1/profile-page/` | Personal profile page (home, about, skills, work, contact) with dark mode, plus standalone exercises in DOM manipulation and array methods. |
| `checkpoint-1/product-catalog/` | Indonesian product catalogue with search, filters, sorting and a cart, written in TypeScript and compiled to `dist/`. See its [README](checkpoint-1/product-catalog/README.md). |

**Running it**

```bash
# Profile page — no build step
open checkpoint-1/profile-page/index.html

# Product catalogue
cd checkpoint-1/product-catalog
npm install
npm run dev          # compiles TypeScript and Tailwind in watch mode
```

Then open `checkpoint-1/product-catalog/src/index.html` in a browser.

## Checkpoint 2

A storefront built on the Next.js App Router, consuming the REST API written for
Module 2. It covers component composition, props and state, routing with nested
layouts, metadata, and data fetching split between Server and Client Components.

```bash
cd checkpoint-2
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Setup, environment variables, routing and the API
boundary are documented in [`checkpoint-2/README.md`](checkpoint-2/README.md).

> The API runs on Render's free tier, so the first request after an idle period can
> take 30–50 seconds.

## Notes

Design references live in `docs/`, which is excluded from version control.
