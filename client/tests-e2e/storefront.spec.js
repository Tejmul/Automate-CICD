import { test, expect } from "@playwright/test";

test("shop -> product -> add to cart", async ({ page }) => {
  await page.goto("/");
  await page.locator('.navbar__nav a[href="/shop"]').click();

  await expect(
    page.getByRole("heading", { name: /discover premium products/i }),
  ).toBeVisible();

  const firstCard = page.locator(".pcard").first();
  await firstCard.click();

  await expect(
    page.getByRole("button", { name: /add to cart/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /add to cart/i }).click();

  // Navbar opens cart drawer; footer has a /cart link — go directly for a stable assertion.
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: /your shopping bag/i }),
  ).toBeVisible();
});
