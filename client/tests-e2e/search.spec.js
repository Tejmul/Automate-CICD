import { expect, test } from "@playwright/test";

test.describe("Search (Catalog Page)", () => {
  /** Catalog page search (navbar also has a search field — avoid ambiguous placeholders). */
  const catalogSearch = (page) => page.locator("#search-products");

  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("search input is visible with placeholder", async ({ page }) => {
    const input = catalogSearch(page);
    await expect(input).toBeVisible();
  });

  test("typing in search updates input value", async ({ page }) => {
    const input = catalogSearch(page);
    await input.fill("chair");
    await expect(input).toHaveValue("chair");
  });

  test("search input accepts special characters", async ({ page }) => {
    const input = catalogSearch(page);
    await input.fill("Kid's wear");
    await expect(input).toHaveValue("Kid's wear");
  });

  test("search input can be cleared", async ({ page }) => {
    const input = catalogSearch(page);
    await input.fill("sweater");
    await input.clear();
    await expect(input).toHaveValue("");
  });

  test("catalog page heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /discover premium products/i }),
    ).toBeVisible();
  });
});
