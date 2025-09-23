import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth.middleware';

// --- Helper function to generate both tokens ---
const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET ) {
        throw new Error("Server secret keys are not configured properly.");
    }
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found for token generation");

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store the new refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error: ", error);
    throw new Error("Something went wrong while generating tokens");
  }
};

// --- Smart Cookie Options ---
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' 
};

// --- UPGRADED LOGIN ---
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
    
    const userResponse = { _id: user._id, username: user.username, email: user.email };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "Login successful", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// --- UPGRADED LOGOUT ---
export const logoutUser = async (req: AuthRequest, res: Response) => {
  // Clear the refresh token from the user's document in the database
  await User.findByIdAndUpdate(
    req.user._id, 
    { $unset: { refreshToken: 1 } }, // Use $unset to completely remove the field
    { new: true }
  );
  
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({ message: "User logged out successfully" });
};

// --- NEW REFRESH FUNCTION ---
export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) return res.status(401).json({ message: "Unauthorized request" });

  try {
    const decodedToken: any = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const user = await User.findById(decodedToken._id);

    // Verify that the refresh token from the cookie matches the one in our database
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token is expired or has been used" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
    
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "Tokens refreshed" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// --- REGISTER (No changes needed, but included for completeness) ---
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(409).json({ message: 'Username or email already exists' });
        const user = new User({ username, email, password });
        await user.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- GET PROFILE (No changes needed, but included for completeness) ---
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    res.status(200).json(req.user);
};
