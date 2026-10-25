import { expect, test, type Page } from "@playwright/test";

const accounts = {
  buyer: { email: process.env.E2E_BUYER_EMAIL, password: process.env.E2E_BUYER_PASSWORD },
  seller: { email: process.env.E2E_SELLER_EMAIL, password: process.env.E2E_SELLER_PASSWORD },
};

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("buyer", () => {
  test.skip(!accounts.buyer.email || !accounts.buyer.password, "E2E_BUYER_* not set");

  test("lands on the buyer dashboard and is blocked from seller pages", async ({ page }) => {
    await login(page, accounts.buyer.email!, accounts.buyer.password!);
    await expect(page).toHaveURL(/\/dashboard\/buyer/);

    await page.goto("/dashboard/seller/products");
    await expect(page.getByText("You don't have access")).toBeVisible();
  });
});

test.describe("seller", () => {
  test.skip(!accounts.seller.email || !accounts.seller.password, "E2E_SELLER_* not set");

  test("lands on the seller dashboard and can open the product form", async ({ page }) => {
    await login(page, accounts.seller.email!, accounts.seller.password!);
    await expect(page).toHaveURL(/\/dashboard\/seller/);

    await page.goto("/dashboard/seller/products/new");
    await expect(page.getByRole("heading", { name: "New product" })).toBeVisible();

    await page.goto("/dashboard/admin");
    await expect(page.getByText("You don't have access")).toBeVisible();
  });

  test("overview, products and orders pages render", async ({ page }) => {
    await login(page, accounts.seller.email!, accounts.seller.password!);

    await expect(page.getByText("Total sales")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ship these soon" })).toBeVisible();

    await page.goto("/dashboard/seller/products");
    await page.getByRole("combobox", { name: "Sort products" }).click();
    await page.getByRole("option", { name: "Best selling" }).click();
    await expect(page.getByRole("combobox", { name: "Sort products" })).toContainText(
      "Best selling",
    );

    await page.goto("/dashboard/seller/orders");
    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
    const first = page.getByRole("button", { name: /^Order #/ }).first();
    if (await first.count()) {
      await first.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByText("Status history")).toBeVisible();
    }
  });
});
