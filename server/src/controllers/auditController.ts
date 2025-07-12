// src/controllers/auditLogController.ts
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import AuditLog, { AuditActionType } from '../models/AuditLog';

export const createAuditLog = async (
  userId: mongoose.Schema.Types.ObjectId | string,
  username: string,
  actionType: AuditActionType,
  details: string,
  resourceId?: mongoose.Schema.Types.ObjectId | string,
  resourceType?: string,
  req?: Request // Optional: Pass the request object to get IP/User-Agent
) => {
  try {
    const newLog = new AuditLog({
      userId,
      username,
      actionType,
      details,
      resourceId,
      resourceType,
      ipAddress: req ? req.ip : undefined, // Get IP from request
      userAgent: req ? req.headers['user-agent'] : undefined, // Get User-Agent from request
    });
    await newLog.save();
    // console.log(`Audit Logged: ${actionType} by ${username}`); // For debugging
  } catch (error: any) {
    console.error('Error creating audit log:', error.message);
    // Important: Do not block the main request flow if audit logging fails
  }
};

// @desc    Get all audit logs (Admin only)
// @route   GET /api/auditlogs
// @access  Protected (admin)
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    // Build query filters
    const query: any = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.actionType) {
      query.actionType = req.query.actionType;
    }
    if (req.query.resourceType) {
      query.resourceType = req.query.resourceType;
    }
    if (req.query.startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(req.query.startDate as string) };
    }
    if (req.query.endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(req.query.endDate as string) };
    }

    // Fetch logs, populate user details and sort by creation date descending
    const logs = await AuditLog.find(query)
      .populate('userId', 'username email role') // Populate user details
      .sort({ createdAt: -1 }) // Latest logs first
      .limit(parseInt(req.query.limit as string) || 100); // Limit to 100 by default

    res.json(logs);
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single audit log by ID (Admin only)
// @route   GET /api/auditlogs/:id
// @access  Protected (admin)
export const getAuditLogById = async (req: Request, res: Response) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('userId', 'username email role');

    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    res.json(log);
  } catch (error: any) {
    console.error('Error fetching audit log by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
