// src/models/user.model.ts

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// This is the blueprint for our User data
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Makes searching by username faster
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// --- Mongoose Hook: "pre-save" ---
// This function runs automatically right BEFORE a user is saved to the database.
userSchema.pre('save', async function (next) {
  // We only want to hash the password if it's new or has been changed.
  if (!this.isModified('password')) return next();

  try {
    // "Salting" adds random characters to the password before hashing to make it more secure.
    // A salt round of 10 is a good standard.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // If there's an error, we pass it to the next middleware.
    // We need to cast 'error' to 'Error' for TypeScript to be happy.
    return next(error as Error);
  }
});

export const User = mongoose.model('User', userSchema);