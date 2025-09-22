// src/controllers/user.controller.ts

import { Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth.middleware';

export const registerUser = async (req: AuthRequest, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) { return res.status(400).json({ message: 'All fields are required' }); }
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) { return res.status(409).json({ message: 'Username or email already exists' }); }
        const user = new User({ username, email, password });
        await user.save();
        const userResponse = { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
        return res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginUser = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Email and password are required' }); }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ _id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1d' });
        const userResponse = { _id: user._id, username: user.username, email: user.email };
        return res.status(200).json({ message: 'Login successful', user: userResponse, accessToken });
    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
    return res.status(200).json({ message: 'User logged out successfully' });
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    res.status(200).json(req.user);
};