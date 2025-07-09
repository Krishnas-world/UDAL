// src/routes/scheduleRoutes.ts
import express from 'express';
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduleController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get schedules (accessible by all staff for viewing)
router.get('/', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getSchedules);
router.get('/:id', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getScheduleById);

// Create/Update schedules (accessible by OT staff and Admin)
router.post('/', protect, authorizeRoles('admin', 'ot_staff'), createSchedule);
router.put('/:id', protect, authorizeRoles('admin', 'ot_staff'), updateSchedule);

// Delete schedule (only accessible by Admin)
router.delete('/:id', protect, authorizeRoles('admin'), deleteSchedule);

export default router;
