import { expect, test, type Page } from "@playwright/test";
import { login, seller } from "./helpers";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function chooseCategory(page: Page) {
  const category = page.getByRole("combobox", { name: "Category", exact: true });
  const sub = page.getByRole("combobox", { name: "Sub-category", exact: true });
  const categoryOptions = page
    .getByRole("listbox", { name: "Category", exact: true })
    .getByRole("option");
  const subOptions = page
    .getByRole("listbox", { name: "Sub-category", exact: true })
    .getByRole("option");

  await category.click();
  await expect(categoryOptions.nth(1)).toBeVisible();
  const total = await categoryOptions.count();
  await page.keyboard.press("Escape");

  for (let i = 1; i < total; i++) {
    await category.click();
    await categoryOptions.nth(i).click();
    await sub.click();
    await expect(subOptions.first()).toBeVisible();
    if ((await subOptions.count()) > 1) {
      await subOptions.nth(1).click();
      return;
    }
    await page.keyboard.press("Escape");
  }
  throw new Error("No category with a sub-category is available");
}

test.describe.serial("seller product CRUD", () => {
  test.skip(!seller.email || !seller.password, "E2E_SELLER_* not set");

  const name = `E2E product ${Date.now()}`;
  let slug = "";

  test.beforeEach(async ({ page }) => {
    await login(page, seller.email!, seller.password!);
  });

  test("creates a product", async ({ page }) => {
    await page.goto("/dashboard/seller/products/new");
    await page.getByLabel("Name", { exact: true }).fill(name);
    await page.getByLabel("Price (IDR)").fill("15000");
    await page.getByLabel("Stock", { exact: true }).fill("5");
    await page.getByLabel("Description").fill("Created by the Playwright CRUD test.");
    await chooseCategory(page);
    await page.getByRole("button", { name: "Create product" }).click();

    await expect(page).toHaveURL(/\/dashboard\/seller\/products\/(?!new)[^/]+$/);
    await expect(page.getByRole("heading", { name: "Edit product" })).toBeVisible();
    slug = new URL(page.url()).pathname.split("/").pop()!;
  });

  test("updates the product", async ({ page }) => {
    await page.goto(`/dashboard/seller/products/${slug}`);
    await expect(page.getByLabel("Stock", { exact: true })).toHaveValue("5");
    await page.getByLabel("Stock", { exact: true }).fill("8");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Product saved")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Stock", { exact: true })).toHaveValue("8");
  });

  test("shows a loading state while an image uploads", async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/images/upload", async (route) => {
      if (route.request().method() === "POST") await gate;
      await route.continue();
    });

    await page.goto(`/dashboard/seller/products/${slug}`);
    await expect(page.getByText("No images yet.")).toBeVisible();
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: "e2e.png", mimeType: "image/png", buffer: PNG });

    await expect(page.getByText("Uploading…").first()).toBeVisible();
    release();
    await expect(page.getByText("Image uploaded")).toBeVisible();
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
    await expect(page.getByText("Uploading…")).toBeHidden();
  });

  test("lists the product in the seller's products", async ({ page }) => {
    await page.goto("/dashboard/seller/products");
    await page.getByPlaceholder("Search by name").fill(name);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("listitem").filter({ hasText: name })).toBeVisible();
  });

  test("deletes the product", async ({ page }) => {
    await page.goto("/dashboard/seller/products");
    await page.getByPlaceholder("Search by name").fill(name);
    await page.getByRole("button", { name: "Search" }).click();

    const card = page.getByRole("listitem").filter({ hasText: name });
    await card.getByRole("button", { name: "Delete" }).click();
    await card.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Product deleted")).toBeVisible();
    await expect(page.getByText("No products found.")).toBeVisible();
  });
});
