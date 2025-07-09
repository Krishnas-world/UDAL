// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User'; // Import the User model

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Protected
export const getUserProfile = async (req: Request, res: Response) => {
  // req.user is populated by the protect middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Protected (Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Exclude password from the results
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Protected (Admin)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile (Admin only for role, or user themselves for own profile)
// @route   PUT /api/users/:id
// @access  Protected (Admin or User themselves)
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow user to update their own username/email, but role update only by admin
    if (req.user && (req.user.role === 'admin' || req.user._id.toString() === user._id.toString())) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      // Only allow admin to change roles
      if (req.user.role === 'admin' && req.body.role) {
        user.role = req.body.role;
      }

      if (req.body.password) {
        user.password = req.body.password; // Password hashing handled by pre-save hook in User model
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(403).json({ message: 'Not authorized to update this user profile' });
    }
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Protected (Admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
