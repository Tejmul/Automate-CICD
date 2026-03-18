const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});

describe('Products API', () => {
    it('GET /api/products/categories returns categories', async () => {
        const res = await request(app).get('/api/products/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('categories');
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories.length).toBeGreaterThan(0);
    });

    it('GET /api/products returns paginated products', async () => {
        const res = await request(app).get('/api/products?limit=10&skip=0');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
        expect(res.body).toHaveProperty('total');
        expect(res.body.products.length).toBeLessThanOrEqual(10);
    });

    it('GET /api/products supports search via q', async () => {
        const res = await request(app).get('/api/products?q=wireless');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
    });

    it('GET /api/products/category/:category returns products', async () => {
        const cats = await request(app).get('/api/products/categories');
        const category = cats.body.categories[0];
        const res = await request(app).get(`/api/products/category/${encodeURIComponent(category)}?limit=5&skip=0`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
    });
});

describe('Auth-protected routes', () => {
    it('GET /api/cart without demo auth headers returns 401', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });
});
