// src/routes/scheduleRoutes.ts
import express from 'express';
import {
  getSchedules,
  getSchedulesByPatientToken, // NEW: Import new controller function
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduleController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get schedules (accessible by all staff for viewing)
router.get('/', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getSchedules);

// NEW: Get schedules by patient token (accessible by all staff for viewing)
router.get('/:patientToken', protect, authorizeRoles('admin', 'ot_staff', 'pharmacy_staff', 'general_staff'), getSchedulesByPatientToken);


// Create schedule (accessible by OT staff and Admin)
// patientToken is now system-assigned, not passed in the body
router.post('/', protect, authorizeRoles('admin', 'ot_staff'), createSchedule);

// Update schedule (accessible by OT staff and Admin) - still uses ID for specific record
router.put('/:id', protect, authorizeRoles('admin', 'ot_staff'), updateSchedule);

// Delete schedule (only accessible by Admin) - still uses ID for specific record
router.delete('/:id', protect, authorizeRoles('admin'), deleteSchedule);

export default router;
