import { apiFetch } from './http'

export const api = {
    health() {
        return apiFetch('/api/health')
    },

    auth: {
        login({ username, password }) {
            return apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            })
        },
        refresh(refreshToken) {
            return apiFetch('/api/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            })
        },
        me(accessToken) {
            return apiFetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        },
    },

    products: {
        list({ q, limit = 24, skip = 0 } = {}) {
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            params.set('limit', String(limit))
            params.set('skip', String(skip))
            return apiFetch(`/api/products?${params.toString()}`)
        },
        get(id) {
            return apiFetch(`/api/products/${encodeURIComponent(String(id))}`)
        },
        categories() {
            return apiFetch('/api/products/categories')
        },
        byCategory({ category, limit = 24, skip = 0 } = {}) {
            const params = new URLSearchParams()
            params.set('limit', String(limit))
            params.set('skip', String(skip))
            return apiFetch(
                `/api/products/category/${encodeURIComponent(String(category))}?${params.toString()}`,
            )
        },
    },

    cart: {
        get() {
            return apiFetch('/api/cart')
        },
        add({ productId, quantity = 1 }) {
            return apiFetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity }),
            })
        },
        setQuantity({ productId, quantity }) {
            return apiFetch(`/api/cart/${encodeURIComponent(String(productId))}`, {
                method: 'PATCH',
                body: JSON.stringify({ quantity }),
            })
        },
        remove(productId) {
            return apiFetch(`/api/cart/${encodeURIComponent(String(productId))}`, {
                method: 'DELETE',
            })
        },
        clear() {
            return apiFetch('/api/cart', { method: 'DELETE' })
        },
    },

    wishlist: {
        get() {
            return apiFetch('/api/wishlist')
        },
        add(productId) {
            return apiFetch('/api/wishlist', {
                method: 'POST',
                body: JSON.stringify({ productId }),
            })
        },
        remove(productId) {
            return apiFetch(`/api/wishlist/${encodeURIComponent(String(productId))}`, {
                method: 'DELETE',
            })
        },
    },

    orders: {
        list({ status } = {}) {
            const params = new URLSearchParams()
            if (status) params.set('status', status)
            const qs = params.toString()
            return apiFetch(`/api/orders${qs ? `?${qs}` : ''}`)
        },
        get(id) {
            return apiFetch(`/api/orders/${encodeURIComponent(String(id))}`)
        },
        create({ currency } = {}) {
            return apiFetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify({ currency }),
            })
        },
    },
}
