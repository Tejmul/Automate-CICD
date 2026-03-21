import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('loads successfully and shows hero heading', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Unleash Your Style')
    })

    test('Navbar is visible with ShopSmart logo', async ({ page }) => {
        await expect(page.getByRole('link', { name: /shopsmart/i })).toBeVisible()
    })

    test('Shop Now button is visible on hero', async ({ page }) => {
        await expect(page.getByRole('link', { name: /shop now/i })).toBeVisible()
    })

    test('15 Million+ customer stat is shown', async ({ page }) => {
        await expect(page.getByText(/15 Million\+/i)).toBeVisible()
    })

    test('page title is set (not blank)', async ({ page }) => {
        const title = await page.title()
        expect(title).toBeTruthy()
    })

    test('Trending Now section heading is visible', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /trending now/i })).toBeVisible()
    })

    test('View All link is visible in featured section', async ({ page }) => {
        await expect(page.getByRole('link', { name: /view all/i })).toBeVisible()
    })
})
