# RevoShop — Product Catalog

A simple product catalog page featuring Indonesian products. Built with HTML, Tailwind CSS, and TypeScript, designed mobile first.

## Features

- Search products by name or description
- Category filter: Fashion, Makanan (food), Minuman (drinks), Kerajinan (crafts)
- "In stock only" filter
- Sorting: newest, price low to high, price high to low, name A–Z
- Stock labels: in stock, low stock (5 or fewer), out of stock
- Cart: adding the same product increases its quantity, capped at the available stock
- "No products match" message with a clear filters button

## Structure

```
product-catalog/
├── src/
│   ├── index.html   main page
│   ├── app.ts       catalog and cart logic
│   └── input.css    Tailwind entry and small components
├── dist/            build output (app.js, output.css)
├── tailwind.config.js
└── tsconfig.json
```

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` compiles TypeScript to `dist/app.js`, then starts Tailwind in watch mode, which writes `dist/output.css`. Then open `src/index.html` in a browser. If you change `app.ts`, run `npx tsc` again.

## Business flow in `app.ts`

1. **Data:** a list of `Product` items (name, category, description, price, stock, date).
2. **Page state:** the keyword, category, sort order, and stock filter are kept in plain variables.
3. **Cart:** a `Cart` is a list of `CartItem` entries (`product` and `quantity`). `addToCart` either adds a new item or raises its quantity, up to the stock limit.
4. **Filter and sort:** `getVisibleProducts()` filters the products, then sorts them.
5. **Rendering:** `showCategories()` and `showProducts()` run again through `refresh()` on every change.

## Notes

- Product data is hardcoded, not loaded from an API or database.
- The cart lives in memory only, so it resets on reload, and there is no cart panel yet.
