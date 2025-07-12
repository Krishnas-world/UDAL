// src/routes/mockIntegrationRoutes.ts
import express from 'express';
import {
  mockEHRPatientSync,
  mockLabResultsFetch,
} from '../controllers/mockIntegrationController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Mock EHR Patient Data Sync (Admin only)
router.post('/ehr/sync-patient', protect, authorizeRoles('admin'), mockEHRPatientSync);

// Mock External Lab Results Fetch (Admin, OT Staff, General Staff)
router.get('/lab/results/:patientId', protect, authorizeRoles('admin', 'ot_staff', 'general_staff'), mockLabResultsFetch);

export default router;
