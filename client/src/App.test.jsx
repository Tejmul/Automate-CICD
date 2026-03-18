import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

describe('App', () => {
    it('renders ShopSmart title', () => {
        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
            })
        );

        render(<RouterProvider router={router} />);
        expect(screen.getByRole('link', { name: /shopsmart/i })).toBeInTheDocument();
    });
});
