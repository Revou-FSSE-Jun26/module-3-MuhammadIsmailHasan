import { expect, test } from "@playwright/test";

test("adding a product updates the cart and the drawer", async ({ page }) => {
  await page.goto("/collections/all");
  await page.locator('a[href^="/products/"][aria-label]').first().click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);

  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("button", { name: "Open cart, 1 items" })).toBeVisible();

  await page.getByRole("button", { name: /Open cart/ }).click();
  const drawer = page.getByRole("dialog", { name: "Shopping cart" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: /checkout/i })).toBeVisible();
});
