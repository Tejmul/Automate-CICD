import { expect, test } from '@playwright/test'

test.describe('Responsive Design', () => {
    test('renders correctly on mobile viewport (375px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await page.goto('/')
        await expect(page.getByRole('link', { name: /shopsmart/i })).toBeVisible()
        await expect(page.locator('h1')).toBeVisible()
    })

    test('renders correctly on tablet viewport (768px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 })
        await page.goto('/')
        await expect(page.getByRole('link', { name: /shopsmart/i })).toBeVisible()
        await expect(page.locator('h1')).toBeVisible()
    })

    test('renders correctly on desktop viewport (1440px)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 })
        await page.goto('/')
        await expect(page.getByRole('link', { name: /shopsmart/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /^shop$/i }).first()).toBeVisible()
        await expect(page.getByRole('link', { name: /wishlist/i }).first()).toBeVisible()
        await expect(page.getByRole('link', { name: /orders/i }).first()).toBeVisible()
    })

    test('hamburger menu is visible on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await page.goto('/')
        await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    })

    test('shop page renders correctly on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await page.goto('/shop')
        await expect(page.getByRole('heading', { name: /discover premium products/i })).toBeVisible()
        await expect(page.getByPlaceholder(/search products/i)).toBeVisible()
    })

    test('cart page renders correctly on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await page.goto('/cart')
        await expect(page.getByRole('heading', { name: /your shopping bag/i })).toBeVisible()
    })
})
