const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/db/prisma');

jest.mock('../src/services/dummyjson', () => ({
  loginUser: jest.fn(async () => ({ accessToken: 'access', refreshToken: 'refresh' })),
  refreshAuthToken: jest.fn(async () => ({ accessToken: 'access2', refreshToken: 'refresh2' })),
  getAuthUser: jest.fn(async () => ({ id: 1, username: 'demo' })),
}));

const DEMO_HEADERS = {
  'x-user-email': 'test-user@example.com',
  'x-user-name': 'Test User',
};

async function resetDb() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
}

async function seedProducts() {
  await prisma.product.createMany({
    data: [
      {
        id: 101,
        title: 'Eyeshadow Palette',
        description: 'Palette',
        price: 29.99,
        discountPercentage: 12,
        rating: 4.4,
        stock: 22,
        brand: 'Glamour Beauty',
        thumbnail: 'https://example.com/p1.png',
        images: JSON.stringify(['https://example.com/p1.png']),
        category: 'beauty',
        tags: JSON.stringify(['makeup']),
      },
      {
        id: 202,
        title: 'Modern Chair',
        description: 'Chair',
        price: 199.0,
        discountPercentage: 0,
        rating: 4.8,
        stock: 3,
        brand: 'Nordic',
        thumbnail: 'https://example.com/p2.png',
        images: JSON.stringify(['https://example.com/p2.png']),
        category: 'furniture',
        tags: JSON.stringify(['home']),
      },
    ],
  });
}

beforeAll(async () => {
  await resetDb();
  await seedProducts();
});

afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

describe('Meta/Health API', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api returns basic api info', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'ShopSmart API');
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('Auth API', () => {
  it('POST /api/auth/login validates body and returns tokens', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'u', password: 'p' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('POST /api/auth/login rejects missing body fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'u' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/refresh returns tokens', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: 'r' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('GET /api/auth/me returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/auth/me returns user with token', async () => {
    const res = await request(app).get('/api/auth/me').set('authorization', 'Bearer abc');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'demo');
  });
});

describe('Products API', () => {
  it('GET /api/products/categories returns categories', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ categories: ['beauty', 'furniture'] });
  });

  it('GET /api/products returns paginated products', async () => {
    const res = await request(app).get('/api/products?limit=1&skip=0');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total', 2);
    expect(res.body.products).toHaveLength(1);
    expect(Array.isArray(res.body.products[0].images)).toBe(true);
    expect(Array.isArray(res.body.products[0].tags)).toBe(true);
  });

  it('GET /api/products supports search via q', async () => {
    const res = await request(app).get('/api/products?q=chair&limit=24&skip=0');
    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBe(1);
    expect(res.body.products[0]).toHaveProperty('title', 'Modern Chair');
  });

  it('GET /api/products/category/:category returns filtered products', async () => {
    const res = await request(app).get('/api/products/category/beauty?limit=24&skip=0');
    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBe(1);
    expect(res.body.products[0]).toHaveProperty('category', 'beauty');
  });

  it('GET /api/products/:id returns 404 for missing', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toEqual(404);
  });

  it('GET /api/products/:id returns a product', async () => {
    const res = await request(app).get('/api/products/101');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Eyeshadow Palette');
  });
});

describe('Cart API (demo-auth protected)', () => {
  it('GET /api/cart without headers returns 401', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/cart returns empty list', async () => {
    const res = await request(app).get('/api/cart').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ items: [] });
  });

  it('POST /api/cart adds an item', async () => {
    const res = await request(app).post('/api/cart').set(DEMO_HEADERS).send({ productId: 101, quantity: 2 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('productId', 101);
    expect(res.body).toHaveProperty('quantity', 2);
  });

  it('PATCH /api/cart/:productId sets quantity', async () => {
    const res = await request(app).patch('/api/cart/101').set(DEMO_HEADERS).send({ quantity: 5 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('quantity', 5);
  });

  it('DELETE /api/cart/:productId removes item', async () => {
    const res = await request(app).delete('/api/cart/101').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(204);
  });

  it('DELETE /api/cart clears cart', async () => {
    await request(app).post('/api/cart').set(DEMO_HEADERS).send({ productId: 202, quantity: 1 });
    const res = await request(app).delete('/api/cart').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(204);
    const after = await request(app).get('/api/cart').set(DEMO_HEADERS);
    expect(after.body.items).toHaveLength(0);
  });
});

describe('Wishlist API (demo-auth protected)', () => {
  it('GET /api/wishlist returns empty list', async () => {
    const res = await request(app).get('/api/wishlist').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ items: [] });
  });

  it('POST /api/wishlist adds item', async () => {
    const res = await request(app).post('/api/wishlist').set(DEMO_HEADERS).send({ productId: 101 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('productId', 101);
  });

  it('DELETE /api/wishlist/:productId removes item', async () => {
    const res = await request(app).delete('/api/wishlist/101').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(204);
  });
});

describe('Orders API (demo-auth protected)', () => {
  it('POST /api/orders returns 400 when cart is empty', async () => {
    const res = await request(app).post('/api/orders').set(DEMO_HEADERS).send({ currency: 'USD' });
    expect(res.statusCode).toEqual(400);
  });

  it('POST /api/orders creates order and clears cart', async () => {
    await request(app).post('/api/cart').set(DEMO_HEADERS).send({ productId: 101, quantity: 2 });
    const res = await request(app).post('/api/orders').set(DEMO_HEADERS).send({ currency: 'USD' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('items');
    expect(res.body.items.length).toBeGreaterThan(0);

    const cartAfter = await request(app).get('/api/cart').set(DEMO_HEADERS);
    expect(cartAfter.body.items).toHaveLength(0);
  });

  it('GET /api/orders lists orders', async () => {
    const res = await request(app).get('/api/orders').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('orders');
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  it('GET /api/orders/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/orders/not-a-real-id').set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(404);
  });

  it('GET /api/orders/:id returns order by id', async () => {
    const list = await request(app).get('/api/orders').set(DEMO_HEADERS);
    const id = list.body.orders[0].id;
    const res = await request(app).get(`/api/orders/${id}`).set(DEMO_HEADERS);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', id);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
