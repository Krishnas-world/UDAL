// src/routes/auditLogRoutes.ts
import express from 'express';
import { getAuditLogs, getAuditLogById } from '../controllers/auditController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// Get all audit logs (Admin only)
router.get('/', protect, authorizeRoles('admin'), getAuditLogs);

// Get a single audit log by ID (Admin only)
router.get('/:id', protect, authorizeRoles('admin'), getAuditLogById);

export default router;
