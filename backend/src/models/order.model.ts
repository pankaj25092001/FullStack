import mongoose, { Schema } from 'mongoose';

const orderItemSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  purchaseType: { type: String, enum: ['rent', 'buy'], required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);