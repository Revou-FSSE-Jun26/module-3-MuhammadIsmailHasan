# Bootcamp Module 3 — Muhammad Ismail Hasan

Frontend assignments for Module 3. The main deliverable is **Checkpoint 3, RevoShop**
(the capstone, at the repository root). Checkpoints 2 and 1 are self-contained
projects in their own folders and are collapsed at the bottom of this page.

| Checkpoint | Where | What | Stack |
|---|---|---|---|
| **3** | [`/` (root)](#checkpoint-3--revoshop-capstone) | Capstone: full storefront with auth, cart, per-seller checkout and dashboards | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion, Playwright |
| 2 | [`checkpoint-2/`](checkpoint-2) | Component-driven storefront with live data | Next.js 16, React 19, Tailwind CSS 4 |
| 1 | [`checkpoint-1/`](checkpoint-1) | Static pages and DOM scripting | HTML, Tailwind CSS 3, TypeScript |

## Checkpoint 3 — RevoShop (capstone)

A full storefront on the Next.js App Router, backed by my own Flask JWT API from
Module 2 (`https://revoshop-apis.onrender.com/api/v1`).

**Features**

- Catalogue with categories in the navbar, sub-category sections, sorting and pagination.
- Product detail with an image gallery, related products and slug-based URLs.
- Cart for signed-in buyers, saved to their account through the API: items are grouped by seller, can be ticked per item or per seller, and update instantly while the server catches up.
- Checkout of the ticked items with shipping address selection; items from several sellers become one order per seller, each with its own status.
- Register and login with access and refresh JWTs, automatic token refresh and safe `next` redirects.
- Role-based dashboards, each guarded by the role the API enforces:

| Role | Can do |
|---|---|
| Buyer | Browse, keep a cart, check out per seller, track and cancel own orders (order details open in a modal) |
| Seller | Create, edit and delete own products, manage images, update order status |
| Admin | Everything a seller can, plus categories, sub-categories and all orders |

**Routes**

| Path | Access |
|---|---|
| `/`, `/collections/[category]`, `/products/[slug]` | Public |
| `/login`, `/register` | Public |
| `/checkout` | Buyer |
| `/dashboard/buyer`, `/dashboard/buyer/orders`, `/dashboard/buyer/profile` | Buyer |
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
| `E2E_BUYER_EMAIL`, `E2E_BUYER_PASSWORD` | Optional buyer account for the RBAC, cart and order modal tests |
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

Tests live in `e2e/` (catalogue, cart, auth guards, RBAC). The login page lists demo accounts (buyer, seller, admin) that fill the form when clicked. Install the browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

The RBAC tests are skipped unless the `E2E_*` accounts are set in `.env.local`.
Set `E2E_BASE_URL` to run against a deployed site instead of the dev server.

> The API runs on Render's free tier, so the first request after an idle period can
> take 30–50 seconds.

## Project structure

```
.
├── src/                       Checkpoint 3 (RevoShop) source
│   ├── app/
│   │   ├── (site)/            public pages: home, collections, product detail,
│   │   │                      login, register, wishlist, checkout
│   │   ├── (dashboard)/       buyer, seller and admin dashboards
│   │   ├── layout.tsx         providers (auth, toast, cart) and the cart drawer
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/              login, register, role guards, AuthProvider
│   │   ├── cart/              CartProvider (API-backed, optimistic) and drawer
│   │   ├── checkout/          checkout view and address form
│   │   ├── dashboard/         shell, buyer overview, managers, shared query views
│   │   ├── home/              hero, collections, lookbook, FAQ and other sections
│   │   ├── layout/            header, footer, announcement bar
│   │   ├── orders/            order cards, order modal, status actions
│   │   ├── product/           product card, detail, wishlist, sort
│   │   └── ui/                icons, select, spinner, toasts, reveal animations
│   ├── hooks/                 useAuthedQuery
│   └── lib/                   API client, types, auth, cart, orders, catalog helpers
├── e2e/                       Playwright tests (catalogue, cart, auth, RBAC)
├── public/images/             hero and lookbook images
├── playwright.config.ts
├── checkpoint-2/              Next.js storefront with live data (own README)
├── checkpoint-1/
│   ├── profile-page/          static profile page
│   └── product-catalog/       TypeScript product catalogue
└── docs/                      design references (not in version control)
```

## Earlier checkpoints

<details>
<summary><b>Checkpoint 2 — Next.js storefront with live data</b></summary>

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

</details>

<details>
<summary><b>Checkpoint 1 — Static pages and DOM scripting</b></summary>

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

</details>

## Notes

Design references live in `docs/`, which is excluded from version control.
