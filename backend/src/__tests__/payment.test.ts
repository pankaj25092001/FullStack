import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// 1. Load environment variables
dotenv.config({ path: './.env' });

import { User } from '../models/user.model';
import { Video } from '../models/video.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';

// 2. This is the magic of mocking. We tell Jest: "Any time someone tries to use 'stripe',
//    use our fake version instead of the real one."
jest.mock('stripe');

// Increase the timeout for this test suite
jest.setTimeout(30000);

describe('Payment Routes', () => {
  let mongoServer: MongoMemoryServer;
  const agent = request.agent(app); // Our cookie-handling agent
  let testUser: any;
  let premiumVideo: any;

  // We create a mocked version of the Stripe class
  const mockStripe = Stripe as jest.MockedClass<typeof Stripe>;
  const mockSessionsCreate = jest.fn();
  const mockSessionsRetrieve = jest.fn();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Before the tests, we set up our mock Stripe functions
    mockStripe.prototype.checkout = {
      sessions: {
        create: mockSessionsCreate,
        retrieve: mockSessionsRetrieve,
      },
    } as any;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // Before each test, create a fresh user and video
  beforeEach(async () => {
    await User.deleteMany({});
    await Video.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    
    // Reset our mock functions before each test to ensure a clean slate
    mockSessionsCreate.mockReset();
    mockSessionsRetrieve.mockReset();

    testUser = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    premiumVideo = await Video.create({
        youtubeVideoId: 'premium1', title: 'Premium Course', description: 'A great course.',
        uploaderId: testUser._id, thumbnailUrl: 'url', duration: 1000, category: 'Tech',
        monetization: { type: 'premium', price: { rent: 100, buy: 500 } }
    });
  });

  // --- TEST GROUP #1: Create Checkout Session ---
  describe('POST /api/v1/payment/create-checkout-session', () => {
    it('should fail with 401 if user is not authenticated', async () => {
      const res = await request(app).post('/api/v1/payment/create-checkout-session');
      expect(res.status).toBe(401);
    });

    it('should fail with 400 if the cart is empty', async () => {
      // Log in the user, but don't add anything to their cart
      await agent.post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password123' });
      const res = await agent.post('/api/v1/payment/create-checkout-session');
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Your cart is empty.');
    });

    it('should create a Stripe session and return a URL for a valid cart', async () => {
      // Log in and add an item to the cart
      await agent.post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password123' });
      await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });

      // 3. We tell our fake Stripe what to return when it's called
      const fakeSession = { url: 'https://checkout.stripe.com/fake_session_url' };
      mockSessionsCreate.mockResolvedValue(fakeSession);

      const res = await agent.post('/api/v1/payment/create-checkout-session');
      
      expect(res.status).toBe(200);
      expect(res.body.url).toBe(fakeSession.url);
      // We can even check if our code called Stripe with the correct data!
      expect(mockSessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
        mode: 'payment',
        line_items: expect.any(Array)
      }));
    });
  });

  // --- TEST GROUP #2: Verify Payment ---
  describe('POST /api/v1/payment/verify-session', () => {
    it('should verify a successful payment, create an order, and delete the cart', async () => {
      await agent.post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password123' });
      const cartRes = await agent.post('/api/v1/cart/add').send({ videoId: premiumVideo._id, purchaseType: 'buy' });
      const cartId = cartRes.body._id;

      // 4. We tell our fake Stripe to return a "paid" session when asked
      const fakeSessionId = 'cs_test_123';
      const fakePaidSession = {
        payment_status: 'paid',
        metadata: { cartId: cartId, userId: testUser._id.toString() },
        amount_total: 50000,
        payment_intent: 'pi_test_123'
      };
      mockSessionsRetrieve.mockResolvedValue(fakePaidSession);
      
      const res = await agent.post('/api/v1/payment/verify-session').send({ session_id: fakeSessionId });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Payment successful!');
      
      // Check the database to confirm the consequences
      const order = await Order.findOne({ userId: testUser._id });
      expect(order).not.toBeNull();
      expect(order?.totalAmount).toBe(500);

      const cart = await Cart.findById(cartId);
      expect(cart).toBeNull(); // The cart should be deleted
    });
  });
});
