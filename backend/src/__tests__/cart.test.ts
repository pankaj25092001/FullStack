import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config({ path: './.env' });

import { User } from '../models/user.model';
import { Video } from '../models/video.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';

// Increase the timeout for this test suite
jest.setTimeout(30000);

describe('Cart Routes', () => {
  let mongoServer: MongoMemoryServer;
  const agent = request.agent(app); // Our cookie-handling agent
  let testUser: any;
  let premiumVideo: any;
  let regularVideo: any;

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

  // Before each test, create a fresh user and videos, and log the user in.
  beforeEach(async () => {
    await User.deleteMany({});
    await Video.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    testUser = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    
    premiumVideo = await Video.create({
        youtubeVideoId: 'premium1', title: 'Premium Course', description: 'A great course.',
        uploaderId: testUser._id, thumbnailUrl: 'url', duration: 1000, category: 'Tech',
        monetization: { type: 'premium', price: { rent: 100, buy: 500 } }
    });
    
    regularVideo = await Video.create({
        youtubeVideoId: 'regular1', title: 'Regular Video', description: 'A free video.',
        uploaderId: testUser._id, thumbnailUrl: 'url', duration: 100, category: 'Tech',
        monetization: { type: 'free' }
    });

    // Log in the user before each test so the agent has the cookies
    await agent.post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password123' });
  });

  // --- TEST GROUP #1: GET Cart ---
  describe('GET /api/v1/cart', () => {
    it('should fail with 401 if user is not authenticated', async () => {
      // Use a new agent that is not logged in
      const res = await request(app).get('/api/v1/cart');
      expect(res.status).toBe(401);
    });

    it('should return a new, empty cart for a logged-in user', async () => {
      const res = await agent.get('/api/v1/cart');
      
      expect(res.status).toBe(200);
      expect(res.body.items).toBeInstanceOf(Array);
      expect(res.body.items.length).toBe(0);
    });
  });

  // --- TEST GROUP #2: ADD Item to Cart ---
  describe('POST /api/v1/cart/add', () => {
    it('should add a premium video to the cart', async () => {
      const res = await agent.post('/api/v1/cart/add').send({
        videoId: premiumVideo._id,
        purchaseType: 'buy'
      });

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0].videoId.title).toBe('Premium Course');
      expect(res.body.items[0].price).toBe(500);
    });

    it('should fail with 404 if trying to add a non-premium video', async () => {
      const res = await agent.post('/api/v1/cart/add').send({
        videoId: regularVideo._id,
        purchaseType: 'buy'
      });
      
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Premium video not found.');
    });

    it('should fail with 409 if the item is already in the cart', async () => {
      // Add the item once
      await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });
      
      // Try to add it again
      const res = await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('This item is already in your cart.');
    });

    it('should fail with 409 if the user already owns the video', async () => {
      // Create a fake completed order for this user and video
      await Order.create({
        userId: testUser._id,
        items: [{ videoId: premiumVideo._id, purchaseType: 'buy', price: 500 }],
        totalAmount: 500,
        status: 'completed'
      });

      const res = await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('You already own this video.');
    });
  });

  // --- TEST GROUP #3: REMOVE Item from Cart ---
  describe('DELETE /api/v1/cart/remove/:itemId', () => {
    it('should remove an item from the cart', async () => {
      // First, add an item to the cart
      const addRes = await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });
      const itemId = addRes.body.items[0]._id;

      // Now, remove it
      const removeRes = await agent.delete(`/api/v1/cart/remove/${itemId}`);

      expect(removeRes.status).toBe(200);
      expect(removeRes.body.items.length).toBe(0);
    });
  });
});
