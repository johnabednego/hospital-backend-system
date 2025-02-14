const request = require('supertest');
const User = require('../../models/User');  // Import User model to perform cleanup

describe('Authentication Endpoints', () => {
  let userToken;
  let userId;

  // Create a user before tests
  beforeAll(async () => {
    const res = await request(global.serverAddress)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'patient',
      });

    userId = res.body?.user?._id; // Store userId for cleanup
  });

  // Cleanup after all tests
  afterAll(async () => {
    if (userId) {
      await User.findByIdAndDelete(userId); // Remove test user from DB
    }
  });

  it('should login existing user', async () => {
    const res = await request(global.serverAddress)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200); // Expect 200 status
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  it('should reject invalid credentials', async () => {
    const res = await request(global.serverAddress)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    // Log for debugging
    console.log(res.body);

    expect(res.statusCode).toBe(400); // Expect 400 status
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
