import { Response } from 'express';
import Stripe from 'stripe';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// Note: We are now exporting each function with the 'export' keyword

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  // We initialize Stripe INSIDE the function to ensure .env is loaded
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate({ path: 'items.videoId', select: 'title' });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    const line_items = cart.items.map((item: any) => {
      if (!item.videoId) return null;
      return {
        price_data: { currency: 'inr', product_data: { name: `${item.videoId.title} (${item.purchaseType})` }, unit_amount: item.price * 100 },
        quantity: 1,
      };
    }).filter(item => item !== null);
    if (line_items.length === 0) {
        return res.status(400).json({ message: 'Your cart contains items no longer available.' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: { cartId: cart._id.toString(), userId: userId.toString() }
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation failed:", error);
    res.status(500).json({ message: 'Failed to create checkout session.' });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { session_id } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            const cartId = session.metadata?.cartId;
            const userId = session.metadata?.userId;
            const cart = await Cart.findById(cartId);
            if (!cart) {
                const existingOrder = await Order.findOne({ stripePaymentIntentId: session.payment_intent as string });
                if (existingOrder) return res.status(200).json({ message: 'Payment already verified.', order: existingOrder });
                return res.status(404).json({ message: 'Cart not found for this order.' });
            }
            const order = await Order.create({
                userId, items: cart.items, totalAmount: session.amount_total! / 100,
                status: 'completed', stripePaymentIntentId: session.payment_intent as string,
            });
            await Cart.findByIdAndDelete(cartId);
            return res.status(200).json({ message: 'Payment successful!', order });
        } else {
            return res.status(400).json({ message: 'Payment not successful.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Payment verification failed.' });
    }
};