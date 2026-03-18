import { test, expect } from '@playwright/test'

test('shop -> product -> add to cart', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /shop/i }).click()

    await expect(page.getByRole('heading', { name: /prada-clean grid/i })).toBeVisible()

    const firstCard = page.locator('.pcard').first()
    await firstCard.click()

    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible()
    await page.getByRole('button', { name: /add to cart/i }).click()

    await page.getByRole('link', { name: /cart/i }).click()
    await expect(page.getByRole('heading', { name: /mobile-first checkout/i })).toBeVisible()
})

