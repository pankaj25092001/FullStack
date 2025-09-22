// src/models/video.model.ts

import mongoose, { Schema } from 'mongoose';

const videoSchema = new Schema(
  {
    youtubeVideoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    duration: {
      // Duration in seconds
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Education", "Gaming", "Music", "Tech", "Entertainment", "Lifestyle"],
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
    monetization: {
      type: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
      },
      price: {
        rent: { type: Number, default: 0 },
        buy: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// For powerful text searching across both title and description
videoSchema.index({ title: 'text', description: 'text' });

export const Video = mongoose.model('Video', videoSchema);