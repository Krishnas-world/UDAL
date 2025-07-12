// src/routes/reportRoutes.ts
import express from 'express';
import {
  getScheduleSummary,
  getInventoryOverview,
  getAlertMetrics,
  getAuditLogSummary,
} from '../controllers/reportController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Schedule Summary Report (accessible by admin, general staff, OT staff)
router.get('/schedules-summary', protect, authorizeRoles('admin', 'general_staff', 'ot_staff'), getScheduleSummary);

// Inventory Overview Report (accessible by admin, pharmacy staff, general staff)
router.get('/inventory-overview', protect, authorizeRoles('admin', 'pharmacy_staff', 'general_staff'), getInventoryOverview);

// Alert Metrics Report (accessible by admin, general staff)
router.get('/alert-metrics', protect, authorizeRoles('admin', 'general_staff'), getAlertMetrics);

// Audit Log Summary Report (accessible by admin only)
router.get('/audit-summary', protect, authorizeRoles('admin'), getAuditLogSummary);

export default router;
