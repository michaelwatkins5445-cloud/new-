const request = require('supertest');
const app = require('../app');

describe('Profile API', () => {
  test('POST /profile creates a profile', async () => {
    const res = await request(app).post('/profile').send({ name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Alice');
  });

  test('GET /profile/:id retrieves a profile', async () => {
    const created = await request(app).post('/profile').send({ name: 'Bob' });
    const id = created.body.id;
    const res = await request(app).get(`/profile/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id, name: 'Bob' });
  });

  test('GET /qr/:id returns a QR code image', async () => {
    const created = await request(app).post('/profile').send({ name: 'Carol' });
    const id = created.body.id;
    const res = await request(app).get(`/qr/${id}`).buffer(true);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
    expect(res.body.length).toBeGreaterThan(0);
  });
});
