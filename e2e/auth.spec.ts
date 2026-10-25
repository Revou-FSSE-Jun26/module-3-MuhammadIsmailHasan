import { expect, test } from "@playwright/test";

test("dashboard redirects guests to login and keeps the target", async ({ page }) => {
  await page.goto("/dashboard/seller/products");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fseller%2Fproducts/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("login page offers demo accounts that fill the form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Try a demo account")).toBeVisible();
  await page.getByRole("button", { name: /buyer/i }).click();
  await expect(page.getByLabel("Email")).toHaveValue("jane@example.com");
  await expect(page.getByLabel("Password")).toHaveValue("password123");
});

test("checkout redirects guests to login", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login/);
});

test("wrong credentials show an error and stay on login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password").fill("not-a-real-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("register form validates before calling the API", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});
