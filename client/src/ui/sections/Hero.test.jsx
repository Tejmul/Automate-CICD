import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../hooks/useStorefront', () => {
    return {
        useProducts: vi.fn(),
    }
})

describe('Hero', async () => {
    const { useProducts } = await import('../hooks/useStorefront')
    const { Hero } = await import('./Hero')

    it('renders headline and CTA link', () => {
        useProducts.mockReturnValue({ data: { products: [] } })

        render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>,
        )

        expect(screen.getByRole('heading', { name: /unleash your style/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /shop now/i })).toHaveAttribute('href', '/shop')
    })

    it('renders placeholder when no primary product', () => {
        useProducts.mockReturnValue({ data: { products: [] } })

        const { container } = render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>,
        )

        expect(container.querySelector('.hero2__ph--gradient')).toBeTruthy()
        expect(container.querySelector('.hero2__img img')).toBeFalsy()
    })

    it('uses product images/thumbnail for the primary image', () => {
        useProducts.mockReturnValue({
            data: {
                products: [
                    { id: 1, title: 'Primary', images: ['https://cdn.example/1.png'], thumbnail: 'https://cdn.example/t.png' },
                    { id: 2, title: 'Other', images: ['https://cdn.example/2.png'] },
                    { id: 3, title: 'Other 2', images: [] },
                ],
            },
        })

        const { container } = render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>,
        )

        const img = container.querySelector('.hero2__img img')
        expect(img).toBeTruthy()
        expect(img?.getAttribute('src')).toBe('https://cdn.example/1.png')
    })
})

