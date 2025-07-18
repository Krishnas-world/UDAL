// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { createAuditLog } from './auditController';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (for initial setup, later restricted to admin)
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'general_staff',
    });

    if (user) {
  
      await createAuditLog(
        user._id.toString(),
        user.username,
        'user_register',
        `New user registered: ${user.username} (${user.email}) with role ${user.role}`,
        user._id.toString(),
        'User',
        req
      );

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
     
      await createAuditLog(
        'unknown',
        email, 
        'user_login',
        `Failed login attempt for email: ${email}`,
        undefined,
        undefined,
        req
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // NEW: Log failed login attempt
      await createAuditLog(
        user._id.toString(),
        user.username,
        'user_login',
        `Failed login attempt for user: ${user.username} (incorrect password)`,
        user._id.toString(),
        'User',
        req
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // NEW: Log successful login
    await createAuditLog(
      user._id.toString(),
      user.username,
      'user_login',
      `User logged in: ${user.username} (${user.email})`,
      user._id.toString(),
      'User',
      req
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error: any) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
