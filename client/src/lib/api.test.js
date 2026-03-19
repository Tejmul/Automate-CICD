import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./http', () => {
  return {
    apiFetch: vi.fn(async () => ({ ok: true })),
  }
})

describe('client api mapping', async () => {
  const { apiFetch } = await import('./http')
  const { api } = await import('./api')

  beforeEach(() => {
    apiFetch.mockClear()
  })

  it('health() calls GET /api/health', async () => {
    await api.health()
    expect(apiFetch).toHaveBeenCalledWith('/api/health')
  })

  it('auth.login posts to /api/auth/login with body', async () => {
    await api.auth.login({ username: 'u', password: 'p' })
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'u', password: 'p' }),
      }),
    )
  })

  it('auth.refresh posts to /api/auth/refresh', async () => {
    await api.auth.refresh('r')
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'r' }),
      }),
    )
  })

  it('auth.me sends Authorization header', async () => {
    await api.auth.me('token')
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
      }),
    )
  })

  it('products.list builds query params', async () => {
    await api.products.list({ q: 'chair', limit: 10, skip: 20 })
    const [path] = apiFetch.mock.calls[0]
    expect(path).toMatch(/^\/api\/products\?/)
    expect(path).toContain('q=chair')
    expect(path).toContain('limit=10')
    expect(path).toContain('skip=20')
  })

  it('products.get encodes id', async () => {
    await api.products.get('1 2')
    expect(apiFetch).toHaveBeenCalledWith('/api/products/1%202')
  })

  it('products.categories calls /api/products/categories', async () => {
    await api.products.categories()
    expect(apiFetch).toHaveBeenCalledWith('/api/products/categories')
  })

  it('products.byCategory builds path and query', async () => {
    await api.products.byCategory({ category: 'home decor', limit: 5, skip: 0 })
    const [path] = apiFetch.mock.calls[0]
    expect(path).toMatch(/^\/api\/products\/category\/home%20decor\?/)
    expect(path).toContain('limit=5')
    expect(path).toContain('skip=0')
  })

  it('cart.get calls /api/cart', async () => {
    await api.cart.get()
    expect(apiFetch).toHaveBeenCalledWith('/api/cart')
  })

  it('cart.add posts to /api/cart', async () => {
    await api.cart.add({ productId: 101, quantity: 2 })
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ productId: 101, quantity: 2 }),
      }),
    )
  })

  it('cart.setQuantity patches /api/cart/:productId', async () => {
    await api.cart.setQuantity({ productId: 101, quantity: 9 })
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/cart/101',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ quantity: 9 }),
      }),
    )
  })

  it('cart.remove deletes /api/cart/:productId', async () => {
    await api.cart.remove(101)
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/cart/101',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('cart.clear deletes /api/cart', async () => {
    await api.cart.clear()
    expect(apiFetch).toHaveBeenCalledWith('/api/cart', expect.objectContaining({ method: 'DELETE' }))
  })

  it('wishlist.get calls /api/wishlist', async () => {
    await api.wishlist.get()
    expect(apiFetch).toHaveBeenCalledWith('/api/wishlist')
  })

  it('wishlist.add posts to /api/wishlist', async () => {
    await api.wishlist.add(101)
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/wishlist',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ productId: 101 }),
      }),
    )
  })

  it('wishlist.remove deletes /api/wishlist/:productId', async () => {
    await api.wishlist.remove(101)
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/wishlist/101',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('orders.list optionally adds status query param', async () => {
    await api.orders.list({ status: 'PENDING' })
    const [path] = apiFetch.mock.calls[0]
    expect(path).toBe('/api/orders?status=PENDING')
  })

  it('orders.get calls /api/orders/:id', async () => {
    await api.orders.get('abc')
    expect(apiFetch).toHaveBeenCalledWith('/api/orders/abc')
  })

  it('orders.create posts to /api/orders', async () => {
    await api.orders.create({ currency: 'USD' })
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/orders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ currency: 'USD' }),
      }),
    )
  })
})

