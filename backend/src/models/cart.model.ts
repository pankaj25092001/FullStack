import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  purchaseType: { type: String, enum: ['rent', 'buy'], required: true },
  price: { type: Number, required: true },
});

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);