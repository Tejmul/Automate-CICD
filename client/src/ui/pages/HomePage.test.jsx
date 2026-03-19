import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../sections/Hero', () => {
    return { Hero: () => <div data-testid="hero" /> }
})

vi.mock('../hooks/useStorefront', () => {
    return {
        useProducts: vi.fn(),
        useCartActions: vi.fn(),
        useWishlist: vi.fn(),
        useWishlistActions: vi.fn(),
    }
})

describe('HomePage', async () => {
    const { useProducts, useCartActions, useWishlist, useWishlistActions } = await import('../hooks/useStorefront')
    const { HomePage } = await import('./HomePage')

    const productA = {
        id: 101,
        title: 'Alpha Tee',
        thumbnail: 'https://cdn.example/a.png',
        price: 19.99,
        rating: 4.2,
        brand: 'BrandA',
        category: 'shirts',
    }
    const productB = {
        id: 202,
        title: 'Beta Hat',
        thumbnail: 'https://cdn.example/b.png',
        price: 9.5,
        rating: 3.9,
        brand: 'BrandB',
        category: 'hats',
    }

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.clearAllTimers()
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('shows featured skeletons while loading', () => {
        useProducts.mockReturnValue({ data: undefined, isLoading: true })
        useCartActions.mockReturnValue({ add: { mutate: vi.fn() } })
        useWishlist.mockReturnValue({ data: [] })
        useWishlistActions.mockReturnValue({ add: { mutate: vi.fn() }, remove: { mutate: vi.fn() } })

        const { container } = render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        )

        expect(screen.getByTestId('hero')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /trending now/i })).toBeInTheDocument()
        expect(container.querySelectorAll('.pcard--skel').length).toBe(4)
    })

    it('renders product cards and wires quick-add + wishlist toggle', () => {
        const addToCart = vi.fn()
        const addWish = vi.fn()
        const removeWish = vi.fn()

        useProducts.mockReturnValue({ data: { products: [productA, productB] }, isLoading: false })
        useCartActions.mockReturnValue({ add: { mutate: addToCart } })
        useWishlist.mockReturnValue({ data: [{ productId: productB.id }] })
        useWishlistActions.mockReturnValue({ add: { mutate: addWish }, remove: { mutate: removeWish } })

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>,
        )

        // ProductCard renders as links
        expect(screen.getByRole('link', { name: /alpha tee/i })).toHaveAttribute('href', `/product/${productA.id}`)
        expect(screen.getByRole('link', { name: /beta hat/i })).toHaveAttribute('href', `/product/${productB.id}`)

        // Quick add should call cart mutate with (productId, qty 1)
        const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
        fireEvent.click(addButtons[0])
        expect(addToCart).toHaveBeenCalledWith({ productId: productA.id, quantity: 1 })

        // Wishlist toggle should remove for wishlisted product and add for non-wishlisted
        fireEvent.click(screen.getByRole('button', { name: /add to wishlist/i }))
        expect(addWish).toHaveBeenCalledWith(productA.id)

        fireEvent.click(screen.getByRole('button', { name: /remove from wishlist/i }))
        expect(removeWish).toHaveBeenCalledWith(productB.id)
    })
})

