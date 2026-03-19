import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

vi.mock('../hooks/useStorefront', () => {
    return {
        useCart: vi.fn(),
        useWishlist: vi.fn(),
        useCartActions: vi.fn(),
        useCartWithProducts: vi.fn(),
    }
})

vi.mock('../components/CartDrawer', () => {
    return {
        CartDrawer: ({ open }) => (open ? <div data-testid="cart-drawer-open" /> : null),
    }
})

describe('Navbar', async () => {
    const { useCart, useWishlist, useCartActions, useCartWithProducts } = await import('../hooks/useStorefront')
    const { Navbar } = await import('./Navbar')

    beforeEach(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
        useCart.mockReturnValue({ data: [] })
        useWishlist.mockReturnValue({ data: [] })
        useCartActions.mockReturnValue({ add: {}, setQuantity: {}, remove: {}, clear: {} })
        useCartWithProducts.mockReturnValue({ lines: [], subtotal: 0 })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    const renderWithRouter = (initialPath = '/') => {
        const router = createMemoryRouter(
            [
                { path: '/', element: <Navbar /> },
                { path: '/shop', element: <Navbar /> },
                { path: '/wishlist', element: <Navbar /> },
                { path: '/orders', element: <Navbar /> },
            ],
            { initialEntries: [initialPath] },
        )

        const utils = render(<RouterProvider router={router} />)
        return { router, ...utils }
    }

    it('adds scrolled class after scrolling', () => {
        const { container } = renderWithRouter('/')
        const header = container.querySelector('header.navbar')
        expect(header?.className).not.toMatch(/navbar--scrolled/)

        window.scrollY = 80
        act(() => {
            window.dispatchEvent(new Event('scroll'))
        })
        return waitFor(() => expect(header?.className).toMatch(/navbar--scrolled/))
    })

    it('shows wishlist badge/dot and cart count when there are items', () => {
        useCart.mockReturnValue({ data: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 3 }] })
        useWishlist.mockReturnValue({ data: [{ productId: 10 }] })

        renderWithRouter('/')

        expect(screen.getByText('1')).toBeInTheDocument() // wishlist badge
        expect(document.querySelector('.navbar__dot')).toBeTruthy()
        expect(screen.getByText('5')).toBeInTheDocument() // cart count
    })

    it('toggles search open, focuses input, and closes on Escape', () => {
        renderWithRouter('/')

        fireEvent.click(screen.getByRole('button', { name: 'Search' }))
        const input = screen.getByPlaceholderText(/search products/i)
        expect(input).toHaveFocus()

        fireEvent.keyDown(input, { key: 'Escape' })
        expect(document.querySelector('.navbar__search--open')).toBeFalsy()
    })

    it('closes menus on navigation (location change)', async () => {
        const { router } = renderWithRouter('/')

        // open search + mobile + cart
        fireEvent.click(screen.getByRole('button', { name: 'Search' }))
        fireEvent.click(screen.getByRole('button', { name: /menu/i }))
        fireEvent.click(screen.getByRole('button', { name: /cart/i }))
        expect(document.querySelector('.navbar__search--open')).toBeTruthy()
        expect(document.querySelector('.navbar__mobile--open')).toBeTruthy()
        expect(screen.getByTestId('cart-drawer-open')).toBeInTheDocument()

        await act(async () => {
            await router.navigate('/shop')
        })
        await waitFor(() => expect(document.querySelector('.navbar__search--open')).toBeFalsy())
        expect(document.querySelector('.navbar__mobile--open')).toBeFalsy()
        expect(screen.queryByTestId('cart-drawer-open')).toBeNull()
    })
})

