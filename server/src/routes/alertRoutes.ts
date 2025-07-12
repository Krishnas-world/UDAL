// src/routes/alertRoutes.ts
import express from 'express';
import {
  getActiveAlerts,
  triggerAlert,
  deactivateAlert,
  getAllAlerts,
} from '../controllers/alertController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get active alerts (accessible by all staff for viewing)
router.get('/active', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getActiveAlerts);

// Trigger a new alert (only accessible by Admin)
router.post('/trigger', protect, authorizeRoles('admin'), triggerAlert);

// Deactivate an alert (only accessible by Admin)
router.put('/:id/deactivate', protect, authorizeRoles('admin'), deactivateAlert);

// Get all alerts (active and inactive) - Admin only
router.get('/all', protect, authorizeRoles('admin'), getAllAlerts);

export default router;
