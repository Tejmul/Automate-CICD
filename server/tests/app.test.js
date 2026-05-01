const request = require('supertest');
const app = require('../src/app');

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
