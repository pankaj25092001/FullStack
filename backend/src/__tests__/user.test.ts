import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import dotenv from 'dotenv';

// 1. Load environment variables for our JWT secrets
dotenv.config({ path: './.env' });

import { User } from '../models/user.model';

// Increase the timeout to handle database setup
jest.setTimeout(30000);

describe('User Authentication Routes', () => {
  let mongoServer: MongoMemoryServer;

  // This Supertest "agent" will act like a browser and automatically handle cookies for us
  const agent = request.agent(app);

  // --- SETUP & TEARDOWN ---
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // This runs before EACH test, ensuring a clean database every time
  beforeEach(async () => {
    await User.deleteMany({});
  });


  // --- TEST GROUP #1: Registration ---
  describe('POST /api/v1/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          username: 'pankaj',
          email: 'pankaj@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should fail if email is already taken', async () => {
      // First, create a user
      await request(app).post('/api/v1/users/register').send({ username: 'user1', email: 'test@example.com', password: 'password123' });
      
      // Then, try to create another with the same email
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          username: 'user2',
          email: 'test@example.com', // Duplicate email
          password: 'password456'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Username or email already exists');
    });
  });

  // --- TEST GROUP #2: The Full Authentication Flow ---
  describe('Login, Profile, Refresh, and Logout', () => {
    it('should log in a user and set secure cookies', async () => {
      // First, register the user we are going to log in
      await User.create({ username: 'loginuser', email: 'login@example.com', password: 'password123' });

      const res = await agent // Use the agent to automatically save cookies
        .post('/api/v1/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      // Check that the Set-Cookie headers exist in the response
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'].some((c: string) => c.startsWith('accessToken='))).toBe(true);
      expect(res.headers['set-cookie'].some((c: string) => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should allow access to a protected route after login', async () => {
      // We need to log in first so the agent has the cookies
      await User.create({ username: 'profileuser', email: 'profile@example.com', password: 'password123' });
      await agent.post('/api/v1/users/login').send({ email: 'profile@example.com', password: 'password123' });

      // Now, make a request to the protected route
      const res = await agent.get('/api/v1/users/profile');

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('profileuser');
    });

    it('should refresh the access token using the refresh token cookie', async () => {
      await User.create({ username: 'refreshuser', email: 'refresh@example.com', password: 'password123' });
      await agent.post('/api/v1/users/login').send({ email: 'refresh@example.com', password: 'password123' });

      // The agent automatically sends the refreshToken cookie
      const res = await agent.post('/api/v1/users/refresh-token');

      expect(res.status).toBe(200);
      // Check that NEW cookies were sent back
      expect(res.headers['set-cookie'].some((c: string) => c.startsWith('accessToken='))).toBe(true);
    });

    it('should log out the user and clear cookies', async () => {
      await User.create({ username: 'logoutuser', email: 'logout@example.com', password: 'password123' });
      await agent.post('/api/v1/users/login').send({ email: 'logout@example.com', password: 'password123' });
      
      // First, confirm we ARE logged in
      const profileRes1 = await agent.get('/api/v1/users/profile');
      expect(profileRes1.status).toBe(200);

      // Now, log out
      const logoutRes = await agent.post('/api/v1/users/logout');
      expect(logoutRes.status).toBe(200);

      // Finally, confirm we are NOT logged in anymore
      const profileRes2 = await agent.get('/api/v1/users/profile');
      expect(profileRes2.status).toBe(401);
    });
  });
});

