// src/routes/userRoutes.ts
import express from 'express';
import {
  getUserProfile,
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware'; // Import middleware

const router = express.Router();

// Get current user's profile (any authenticated user)
router.get('/profile', protect, getUserProfile);

// Admin-only routes for user management
router.get('/', protect, authorizeRoles('admin'), getUsers); // Get all users
router.get('/:id', protect, authorizeRoles('admin'), getUserById); // Get user by ID
router.put('/:id', protect, authorizeRoles('admin'), updateUserProfile); // Update user by ID (admin can change role)
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser); // Delete user

export default router;
