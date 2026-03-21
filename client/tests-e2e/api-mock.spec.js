import { expect, test } from "@playwright/test";

test.describe("Mocked API E2E", () => {
  test("mocked GET /api/products returns JSON and page loads", async ({
    page,
  }) => {
    await page.route("**/api/products**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          products: [
            {
              id: 1,
              title: "Mock T-Shirt",
              price: 29.99,
              thumbnail: "",
              images: [],
              tags: [],
              category: "clothing",
              stock: 10,
              rating: 4.5,
              brand: "TestBrand",
            },
            {
              id: 2,
              title: "Mock Jeans",
              price: 59.99,
              thumbnail: "",
              images: [],
              tags: [],
              category: "clothing",
              stock: 5,
              rating: 4.0,
              brand: "TestBrand",
            },
          ],
          total: 2,
        }),
      });
    });

    await page.goto("/");
    await expect(page.locator("a.navbar__logo")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Unleash Your Style");
  });

  test("mocked GET /api/cart returns empty cart", async ({ page }) => {
    await page.route("**/api/cart", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [] }),
      });
    });

    await page.goto("/cart");
    await expect(page).toHaveURL(/\/cart/);
    await expect(
      page.getByRole("heading", { name: /your shopping bag/i }),
    ).toBeVisible();
  });

  test("page loads correctly when API returns 500 error", async ({ page }) => {
    await page.route("**/api/products**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/");
    // App should not crash even when API fails
    await expect(page.locator("a.navbar__logo")).toBeVisible();
  });

  test("mocked GET /api/products/categories returns categories", async ({
    page,
  }) => {
    await page.route("**/api/products/categories", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          categories: ["beauty", "furniture", "clothing"],
        }),
      });
    });

    await page.route("**/api/products?**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ products: [], total: 0 }),
      });
    });

    await page.goto("/shop");
    await expect(
      page.getByRole("heading", { name: /discover premium products/i }),
    ).toBeVisible();
  });

  test("mocked product detail page renders", async ({ page }) => {
    await page.route("**/api/products/1", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          title: "Premium Sneakers",
          description: "High quality sneakers",
          price: 149.99,
          discountPercentage: 10,
          rating: 4.8,
          stock: 15,
          brand: "Nike",
          thumbnail: "",
          images: [],
          tags: ["shoes", "sneakers"],
          category: "footwear",
        }),
      });
    });

    await page.goto("/product/1");
    await expect(
      page.getByRole("heading", { name: /premium sneakers/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add to cart/i }),
    ).toBeVisible();
  });
});
