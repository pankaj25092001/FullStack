import { Response } from 'express';
import { Cart } from '../models/cart.model';
import { Video } from '../models/video.model';
import { Order } from '../models/order.model';
import { AuthRequest } from '../middlewares/auth.middleware'; // Import our special Request type

// --- GET USER'S CURRENT CART ---
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    // Find the cart belonging to the logged-in user (from req.user)
    // .populate will replace the videoId with the actual video details
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.videoId', 'title thumbnailUrl price');
    
    // If the user has never had a cart before, create one for them
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching cart.' });
  }
};

// --- ADD A VIDEO TO THE CART ---
export const addItemToCart = async (req: AuthRequest, res: Response) => {
  const { videoId, purchaseType } = req.body;
  const userId = req.user._id;

  try {
    const video = await Video.findById(videoId);
    
    // Defensive checks to make sure the video is valid and premium
    if (!video || !video.monetization || video.monetization.type !== 'premium') {
      return res.status(404).json({ message: 'Premium video not found.' });
    }

    // Check if the user already owns this item
    const existingOrder = await Order.findOne({ userId, 'items.videoId': videoId, status: 'completed' });
    if (existingOrder) {
      return res.status(409).json({ message: 'You already own this video.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Check if the item is already in the cart
    const itemExists = cart.items.some(item => item.videoId.toString() === videoId);
    if (itemExists) {
      return res.status(409).json({ message: 'This item is already in your cart.' });
    }
    
    if (!video.monetization.price) {
        return res.status(500).json({ message: 'Video price information is missing.' });
    }

    const price = purchaseType === 'buy' ? video.monetization.price.buy : video.monetization.price.rent;
    if (!price || price <= 0) {
        return res.status(400).json({ message: 'Invalid price for this purchase type.' });
    }

    cart.items.push({ videoId, purchaseType, price });
    await cart.save();
    
    // Send back the updated cart with populated video details
    await cart.populate('items.videoId', 'title thumbnailUrl price');
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error while adding item to cart.' });
  }
};

// --- REMOVE A VIDEO FROM THE CART ---
export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params; // This is the _id of the item inside the cart's items array
    const userId = req.user._id;

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: itemId } } }, // Find the cart and pull the matching item
            { new: true } // Return the updated document
        ).populate('items.videoId', 'title thumbnailUrl price');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Server error while removing item from cart.' });
    }
}