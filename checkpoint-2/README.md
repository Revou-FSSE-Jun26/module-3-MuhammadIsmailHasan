# RevoShop — Checkpoint 2

A product catalogue built with Next.js App Router, consuming the RevoShop REST API
from Module 2.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| API | [RevoShop API](https://revoshop-apis.onrender.com/docs/swagger-ui) |

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev
```

Open http://localhost:3000.

> The API is hosted on Render's free tier. The first request after an idle period
> can take 30–50 seconds while the instance wakes up.

## Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | public | API base URL; inlined into the client bundle |
| `API_SECRET_KEY` | server only | Secret available to Server Components, Route Handlers and Server Actions |

Variables prefixed with `NEXT_PUBLIC_` are embedded in the JavaScript sent to the
browser and are readable by anyone. Secrets must never carry the prefix.

## Project structure

```
src/
├── app/            # routes — every folder with a page.tsx is a URL
│   ├── layout.tsx  # root layout: Header + Footer on every page
│   └── globals.css # Tailwind import + design tokens (@theme)
├── components/     # reusable UI
├── lib/
│   └── api.ts      # the only module that knows how the backend talks
└── types/          # shared TypeScript interfaces
```

## API boundary

All HTTP access goes through `src/lib/api.ts`. It normalises three things so no
component has to know about them:

- The API wraps every payload in `{ status, message, data, pagination }`.
- Collection routes require a trailing slash (`/products/`); detail routes must not
  have one (`/products/1`).
- The API's product search parameter is `name`, exposed to the app as `search`.

Non-2xx responses throw a typed `ApiError`, which `error.tsx` boundaries catch.

## Design

The visual language follows `docs/ref-design.jpg`. Colours, surfaces and shadows are
defined once as tokens in the `@theme` block of `src/app/globals.css`; components
reference the generated utilities (`bg-brand-600`, `shadow-card`) and never hardcode
a hex value.

The API provides no rating, review count or promotional badge. Those are modelled as
optional props with sensible defaults, so a card renders correctly with or without
them. Product image URLs in the dataset point to a placeholder domain that does not
resolve, so cards fall back to a tinted placeholder.

## Implementation note

The checkpoint brief asks, in its components section, for the catalogue `page.tsx` to
render `<Header />`, `<ProductGrid />` and `<Footer />`, and in its routing section
for the root `layout.tsx` to wrap every page with `<Header />` and `<Footer />`.
Doing both would render the header and footer twice.

This project follows the routing requirement: `Header` and `Footer` are mounted once
in `app/layout.tsx`, and page components render their own content only. The component
decomposition the brief asks for is otherwise unchanged.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
