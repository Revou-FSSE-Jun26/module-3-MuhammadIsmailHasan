import { expect, test } from "@playwright/test";
import { buyer, login, openFirstInStockProduct } from "./helpers";

test.describe("checkout", () => {
  test.skip(!buyer.email || !buyer.password, "E2E_BUYER_* not set");

  test.beforeEach(async ({ page }) => {
    await login(page, buyer.email!, buyer.password!);
    await openFirstInStockProduct(page);
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("dialog", { name: "Shopping cart" })).toBeVisible();
  });

  test("shows the demo payment guide before placing the order", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "How to pay (demo)" })).toBeVisible();
    await expect(page.getByText("4811 1111 1111 1114")).toBeVisible();
    await expect(page.getByText("112233")).toBeVisible();
  });

  test("place order stays disabled until the addresses are loaded", async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/addresses", async (route) => {
      if (route.request().method() === "GET") await gate;
      await route.continue();
    });

    await page.goto("/checkout");
    const placeOrder = page.getByRole("button", { name: "Place order" });
    await expect(placeOrder).toBeDisabled();

    release();
    await expect(page.getByText("Loading addresses…")).toBeHidden();
    if ((await page.getByRole("radio").count()) > 0) {
      await expect(placeOrder).toBeEnabled();
    }
  });
});
