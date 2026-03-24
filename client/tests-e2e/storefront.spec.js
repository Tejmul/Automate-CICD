import { test, expect } from "@playwright/test";

test("shop -> product -> add to cart", async ({ page }) => {
  await page.goto("/");
  await page.locator('.navbar__nav a[href="/shop"]').click();

  await expect(
    page.getByRole("heading", { name: /discover premium products/i }),
  ).toBeVisible();

  // Catalog uses ProductCard links (`.product-card`), not legacy `.pcard` skeleton class.
  // Click the title, not the card center — the overlay "Add to Cart" uses stopPropagation
  // and would leave us on /shop with many matching buttons (Playwright strict mode).
  const firstCard = page.locator("a.product-card").first();
  await expect(firstCard).toBeVisible();
  await firstCard.locator(".product-card__name").click();
  await expect(page).toHaveURL(/\/product\/\d+/);

  const addToCart = page
    .locator(".pdp__actions")
    .getByRole("button", { name: /add to cart/i });
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  // Navbar opens cart drawer; footer has a /cart link — go directly for a stable assertion.
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: /your shopping bag/i }),
  ).toBeVisible();
});
