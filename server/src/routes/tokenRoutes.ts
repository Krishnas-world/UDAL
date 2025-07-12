// src/routes/tokenRoutes.ts
import express from 'express';
import { getToken, advanceToken, resetToken } from '../controllers/tokenController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get current token for a department (accessible by all staff for viewing)
router.get('/:department', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getToken);

// Advance token (accessible by OT, Pharmacy, Admin)
router.put('/:department/advance', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff'), advanceToken);

// Reset token (only accessible by Admin)
router.put('/:department/reset', protect, authorizeRoles('admin'), resetToken);

export default router;
