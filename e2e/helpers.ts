import { expect, type Page } from "@playwright/test";

export const buyer = {
  email: process.env.E2E_BUYER_EMAIL,
  password: process.env.E2E_BUYER_PASSWORD,
};
export const seller = {
  email: process.env.E2E_SELLER_EMAIL,
  password: process.env.E2E_SELLER_PASSWORD,
};

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard\//);
}

export async function openFirstInStockProduct(page: Page) {
  await page.goto("/collections/all");
  const cards = page.locator("article");
  await expect(cards.first()).toBeVisible();
  await cards
    .filter({ hasNotText: "Sold out" })
    .first()
    .locator('a[href^="/products/"][aria-label]')
    .click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);
}
