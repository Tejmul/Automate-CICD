import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'

describe('App', () => {
    it('renders ShopSmart title', () => {
        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
            })
        );

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: 0 }, mutations: { retry: 0 } }
        })

        render(
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        );
        expect(screen.getByRole('link', { name: /shopsmart/i })).toBeInTheDocument();
    });
});
