# Bootcamp Module 3 — Muhammad Ismail Hasan

Frontend assignments for Module 3. Checkpoints 1 and 2 are self-contained projects in
their own folders; the capstone, **RevoShop**, lives at the repository root.

| Folder | Checkpoint | Stack |
|---|---|---|
| [`checkpoint-1/`](checkpoint-1) | Static pages and DOM scripting | HTML, Tailwind CSS 3, TypeScript |
| [`checkpoint-2/`](checkpoint-2) | Component-driven storefront with live data | Next.js 16, React 19, Tailwind CSS 4 |
| [`/` (root)](#revoshop) | Capstone: full storefront with auth, dashboards and checkout | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion, Playwright |

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

## RevoShop

A full storefront on the Next.js App Router, backed by my own Flask JWT API from
Module 2 (`https://revoshop-apis.onrender.com/api/v1`).

**Features**

- Catalogue with categories in the navbar, sub-category sections, sorting and pagination.
- Product detail with an image gallery, related products and slug-based URLs.
- Cart drawer with stock-aware quantities, then checkout with shipping address selection.
- Register and login with access and refresh JWTs, automatic token refresh and safe `next` redirects.
- Role-based dashboards, each guarded by the role the API enforces:

| Role | Can do |
|---|---|
| Buyer | Browse, check out, track and cancel own orders |
| Seller | Create, edit and delete own products, manage images, update order status |
| Admin | Everything a seller can, plus categories, sub-categories and all orders |

- Toasts and loading spinners for every API action.

**Routes**

| Path | Access |
|---|---|
| `/`, `/collections/[category]`, `/products/[slug]` | Public |
| `/login`, `/register` | Public |
| `/checkout` | Buyer |
| `/dashboard/buyer`, `/dashboard/buyer/orders[/id]` | Buyer |
| `/dashboard/seller`, `/products[/new, /slug]`, `/orders[/id]` | Seller |
| `/dashboard/admin`, `/products[/new, /slug]`, `/categories`, `/orders[/id]` | Admin |

**Run it**

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the API, including `/api/v1` |
| `E2E_BUYER_EMAIL`, `E2E_BUYER_PASSWORD` | Optional buyer account for the RBAC tests |
| `E2E_SELLER_EMAIL`, `E2E_SELLER_PASSWORD` | Optional seller account for the RBAC tests |

**Scripts**

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier check |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:e2e:ui` | Playwright UI mode |

**End-to-end tests**

Tests live in `e2e/` (catalogue, cart, auth guards, RBAC). Install the browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

The RBAC tests are skipped unless the `E2E_*` accounts are set in `.env.local`.
Set `E2E_BASE_URL` to run against a deployed site instead of the dev server.

**Project structure**

```
src/
  app/(site)/        public pages and checkout
  app/(dashboard)/   buyer, seller and admin dashboards
  components/        auth, cart, checkout, dashboard, orders, product, ui
  hooks/             useAuthedQuery
  lib/               API client, types, auth, cart, orders helpers
e2e/                 Playwright tests
```

> The API runs on Render's free tier, so the first request after an idle period can
> take 30–50 seconds.

## Notes

Design references live in `docs/`, which is excluded from version control.
