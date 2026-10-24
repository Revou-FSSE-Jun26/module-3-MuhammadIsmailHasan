import { expect, test } from "@playwright/test";

test("home page shows the brand and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Open cart/ })).toBeVisible();
});

test("catalog lists products from the API", async ({ page }) => {
  await page.goto("/collections/all");
  const cards = page.locator('a[href^="/products/"]');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(1);
});

test("product card opens the product detail page", async ({ page }) => {
  await page.goto("/collections/all");
  const first = page.locator('a[href^="/products/"][aria-label]').first();
  const title = await first.getAttribute("aria-label");
  await first.click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(title ?? "");
});

test("unknown product slug shows the not found page", async ({ page }) => {
  const response = await page.goto("/products/this-product-does-not-exist-123");
  expect(response?.status()).toBe(404);
});
