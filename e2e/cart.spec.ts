import { expect, test, type Page } from "@playwright/test";

const buyer = { email: process.env.E2E_BUYER_EMAIL, password: process.env.E2E_BUYER_PASSWORD };

async function openFirstProduct(page: Page) {
  await page.goto("/collections/all");
  await page.locator('a[href^="/products/"][aria-label]').first().click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);
}

test("a guest who adds to cart is sent to sign in", async ({ page }) => {
  await openFirstProduct(page);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page).toHaveURL(/\/login\?next=/);
});

test("a guest sees a sign-in prompt in the cart drawer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open cart/ }).click();
  const drawer = page.getByRole("dialog", { name: "Shopping cart" });
  await expect(drawer.getByText("Sign in to see your cart")).toBeVisible();
});

test("a guest can still use the wishlist", async ({ page }) => {
  await page.goto("/collections/all");
  await page.getByRole("button", { name: "Add to wishlist" }).first().click({ force: true });
  await expect(page.getByRole("link", { name: /Wishlist, 1 items/ })).toBeVisible();
});

test.describe("buyer", () => {
  test.skip(!buyer.email || !buyer.password, "E2E_BUYER_* not set");

  test("adding a product updates the cart and the drawer", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(buyer.email!);
    await page.getByLabel("Password").fill(buyer.password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard\/buyer/);

    await openFirstProduct(page);
    await page.getByRole("button", { name: "Add to cart" }).click();

    const drawer = page.getByRole("dialog", { name: "Shopping cart" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: /checkout/i })).toBeVisible();
  });

  test("cart items can be deselected before checkout", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(buyer.email!);
    await page.getByLabel("Password").fill(buyer.password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard\/buyer/);

    await openFirstProduct(page);
    await page.getByRole("button", { name: "Add to cart" }).click();

    const drawer = page.getByRole("dialog", { name: "Shopping cart" });
    await expect(drawer.getByRole("link", { name: /checkout \(\d+\)/i })).toBeVisible();

    await drawer.getByLabel("Select all", { exact: false }).uncheck();
    await expect(drawer.getByText("Select items to check out")).toBeVisible();

    await drawer.getByLabel("Select all", { exact: false }).check();
    await expect(drawer.getByRole("link", { name: /checkout \(\d+\)/i })).toBeVisible();
  });

  test("my orders opens the detail in a modal", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(buyer.email!);
    await page.getByLabel("Password").fill(buyer.password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard\/buyer/);

    await page.goto("/dashboard/buyer/orders");
    await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();
    const card = page.getByRole("button", { name: /Order #\d+/ }).first();
    test.skip(!(await card.isVisible().catch(() => false)), "buyer has no orders yet");
    await card.click();
    await expect(page.getByRole("dialog", { name: /Order #\d+/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Order #\d+/ })).toBeHidden();
  });
});
