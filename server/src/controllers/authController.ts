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
  console.log(username);

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const finalRole = role || 'general_staff'; // Default to general_staff if no role is provided

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: finalRole,
    });

    if (user) {
      await createAuditLog(
        req.user ? req.user._id.toString() : 'system', // Log who initiated this action
        req.user ? req.user.username : 'System',
        'user_register',
        `New user registered: ${user.username} (${user.email}) with role ${user.role}`,
        user._id.toString(),
        'User',
        req
      );

      return res.status(201).json({
        message: 'User registered successfully',
        userId: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role,
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
      return res.status(401).json({ message: 'Invalid credentials' }); // ✅ return
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      await createAuditLog(
        user._id.toString(),
        user.username,
        'user_login',
        `Failed login attempt for user: ${user.username} (incorrect password)`,
        user._id.toString(),
        'User',
        req
      );
      return res.status(401).json({ message: 'Invalid credentials' }); // ✅ return
    }

    // Successful login — everything validated now
    const token = generateToken(user._id.toString(), user.role);

    // ✅ Set cookie just before sending response
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await createAuditLog(
      user._id.toString(),
      user.username,
      'user_login',
      `User logged in: ${user.username} (${user.email})`,
      user._id.toString(),
      'User',
      req
    );

    return res.json({
      user
    })
  } catch (error: any) {
    console.error('Error logging in user:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

