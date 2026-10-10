# RevoShop — Checkpoint 2

A product catalogue built with the Next.js App Router, consuming the RevoShop REST
API from Module 2.

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
> can take 30–50 seconds while the instance wakes up — which is why every
> data-fetching route ships a `loading.tsx`.

## Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | public | API base URL; inlined into the client bundle |
| `API_SECRET_KEY` | server only | Secret available to Server Components, Route Handlers and Server Actions |

Variables prefixed with `NEXT_PUBLIC_` are embedded in the JavaScript sent to the
browser and are readable by anyone. Secrets must never carry the prefix.

## Routes

| Route | Rendering | Data |
|---|---|---|
| `/` | Server Component | First 5 products |
| `/products` | Server Component → Client `ProductList` | Products, filtered by `?search=` |
| `/products/[id]` | Server Component | One product, with a generated page title |
| `/categories` | Server Component | All categories |
| `/orders` | Server Component | The signed-in user's orders |
| `/login` | Static | — |
| `/api/products`, `/api/categories` | Route Handlers | Browser-side proxy (see below) |

Every route that fetches data has its own `loading.tsx` and `error.tsx`.

## Project structure

```
src/
├── app/
│   ├── layout.tsx       Root layout: Header + Footer on every page
│   ├── globals.css      Tailwind import + design tokens (@theme)
│   ├── api/             Route handlers used as a same-origin proxy
│   ├── components/      Reusable UI
│   └── <route>/         page.tsx + loading.tsx + error.tsx per route
├── data/                Captured API fixtures used while building the UI
├── lib/
│   ├── api.ts           Server-side access to the RevoShop API
│   ├── client-api.ts    Browser-side access, via the proxy routes
│   ├── format.ts        Currency formatting
│   └── session.ts       Reads the auth cookie (server only)
└── types/               Shared TypeScript interfaces
```

## API boundary

All server-side HTTP access goes through `src/lib/api.ts`. It normalises three
things so no component has to know about them:

- The API wraps every payload in `{ status, message, data, pagination }`.
- Collection routes require a trailing slash (`/products/`); detail routes must not
  have one (`/products/1`).
- The API's product search parameter is `name`, exposed to the app as `search`.

### Why there are two API modules

The RevoShop API sends no `Access-Control-Allow-Origin` header, so a browser refuses
to read its responses. Server-side fetches are unaffected — CORS is a browser rule.

Client Components therefore call this app's own route handlers under `/api`, which
forward the request from the server. `src/lib/client-api.ts` is that browser-side
entry point; `src/lib/api.ts` stays server-only.

Besides working around CORS, the proxy keeps the upstream URL out of the browser and
gives the app one place to attach credentials to outgoing requests.

## Error handling

Three layers, split by where the code runs:

1. **`res.ok` checks.** `fetch` does not reject on 404 or 500, so both API modules
   check the status and throw — `ApiError` on the server, a plain `Error` in the
   browser. Without this, an error page would reach `JSON.parse` and fail far from
   the real cause.
2. **`error.tsx`.** Server Components deliberately carry no `try/catch`: a throw
   during render propagates to the nearest error boundary, which renders a retry UI
   driven by Next's `reset()`.
3. **Explicit `.catch()` in effects.** Code in `useEffect` runs in the browser, after
   the server has finished, so `error.tsx` can never see it. Those failures leave the
   last successful data on screen rather than replacing it with an error state.

The same split applies to loading states: `loading.tsx` covers server renders, while
client-side refetches derive their own loading flag.

## Authentication

Orders are per-account, so `/orders` needs a token. Signing in posts to the API from
a Server Action and stores the access token in an **httpOnly** cookie.

The cookie is httpOnly because `/orders` is a Server Component: the server can read
cookies sent with the request, but has no access to `localStorage`. The same property
makes the token unreadable to any script, so XSS cannot exfiltrate it. The trade-off
is that client-side code cannot inspect it either — signed-in state always comes from
the server.

## Design

The visual language follows `docs/ref-design.jpg`. Colours, surfaces and shadows are
defined once as tokens in the `@theme` block of `src/app/globals.css`; components
reference the generated utilities (`bg-brand-600`, `shadow-card`) and never hardcode
a hex value.

The API provides no rating, review count or promotional badge. Those are modelled as
optional props with defaults, so a card renders correctly with or without them.
Product image URLs in the dataset point to a host that does not resolve, so cards
fall back to a tinted placeholder keyed to the product id.

## Implementation notes

**Header and Footer placement.** The brief asks, in its components section, for the
catalogue `page.tsx` to render `<Header />`, `<ProductGrid />` and `<Footer />`, and
in its routing section for the root `layout.tsx` to wrap every page with `<Header />`
and `<Footer />`. Doing both would render them twice. This project follows the
routing requirement: they are mounted once in `app/layout.tsx`.

**Nested layout verification.** `app/products/layout.tsx` renders a probe that
records the time it first mounted. Navigating between `/products` and
`/products/[id]` leaves that timestamp unchanged, which demonstrates the layout is
preserved rather than remounted.

**Cart model.** The cart is a flat `Product[]`, as the brief specifies, so quantity is
represented by repetition. The API models a cart as line items with a `quantity`
column; migrating would be the natural next step once a dedicated cart page exists.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
