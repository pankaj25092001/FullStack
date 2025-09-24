import { Response } from 'express';
import { Order } from '../models/order.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// --- GET ALL ORDERS FOR THE LOGGED-IN USER ---
export const getOrdersForUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    try {
        // Find all orders that belong to this user
        // We sort by newest first and populate the video details
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'items.videoId',
                select: 'title thumbnailUrl' // We only need these details for the list
            });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error while fetching orders." });
    }
};