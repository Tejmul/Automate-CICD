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
        // Verify DummyJSON-aligned fields
        if (res.body.products.length > 0) {
            const p = res.body.products[0];
            expect(p).toHaveProperty('title');
            expect(p).toHaveProperty('price');
            expect(p).toHaveProperty('thumbnail');
            expect(p).toHaveProperty('images');
            expect(Array.isArray(p.images)).toBe(true);
        }
    });

    it('GET /api/products supports search via q', async () => {
        const res = await request(app).get('/api/products?q=phone');
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

    it('GET /api/products/:id returns a single product', async () => {
        const list = await request(app).get('/api/products?limit=1');
        if (list.body.products.length > 0) {
            const id = list.body.products[0].id;
            const res = await request(app).get(`/api/products/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('price');
            expect(res.body).toHaveProperty('brand');
        }
    });
});

describe('Auth-protected routes', () => {
    it('GET /api/cart without demo auth headers returns 401', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });
});

describe('Auth API', () => {
    it('POST /api/auth/login with valid DummyJSON credentials returns tokens', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'emilys', password: 'emilyspass' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('POST /api/auth/login with invalid credentials returns error', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'invalid', password: 'wrong' });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('GET /api/auth/me without token returns 401', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toEqual(401);
    });
});
