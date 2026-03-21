import { expect, test } from "@playwright/test";

test.describe("Navigation Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('clicking "Shop" navigates to /shop', async ({ page }) => {
    await page
      .getByRole("link", { name: /^shop$/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test('clicking "Wishlist" navigates to /wishlist', async ({ page }) => {
    await page
      .getByRole("link", { name: /wishlist/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/wishlist/);
  });

  test('clicking "Orders" navigates to /orders', async ({ page }) => {
    await page
      .getByRole("link", { name: /orders/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/orders/);
  });

  test('clicking "Home" navigates to /', async ({ page }) => {
    // First navigate away
    await page.goto("/shop");
    await page
      .getByRole("link", { name: /^home$/i })
      .first()
      .click();
    await expect(page).toHaveURL(/^\/$|\/$/);
    await expect(page.locator("h1")).toContainText("Unleash Your Style");
  });

  test("clicking ShopSmart logo returns to home (/)", async ({ page }) => {
    await page.goto("/shop");
    await page.locator("a.navbar__logo").click();
    await expect(page).toHaveURL(/^\/$|\/$/);
    await expect(page.locator("h1")).toContainText("Unleash Your Style");
  });

  test('clicking "Shop Now" on hero navigates to /shop', async ({ page }) => {
    await page.getByRole("link", { name: /shop now/i }).click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test('clicking "View All" navigates to /shop', async ({ page }) => {
    await page.getByRole("link", { name: /view all/i }).click();
    await expect(page).toHaveURL(/\/shop/);
  });
});
