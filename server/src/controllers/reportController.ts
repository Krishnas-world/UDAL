// src/controllers/reportController.ts
import { Request, Response } from 'express';
import Schedule from '../models/Schedule';
import Inventory from '../models/Inventory';
import Alert from '../models/Alert';
import AuditLog from '../models/AuditLog';
import { createAuditLog } from './auditController'; // For logging report access

// Helper function to parse date range from query parameters
const parseDateRange = (req: Request) => {
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(0); // Default to epoch
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(); // Default to now
  return { startDate, endDate };
};

// @desc    Get Schedule Summary Report
// @route   GET /api/reports/schedules-summary
// @access  Protected (admin, general_staff, ot_staff)
export const getScheduleSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = parseDateRange(req);

    const summary = await Schedule.aggregate([
      {
        $match: {
          scheduledTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$department',
          totalSchedules: { $sum: 1 },
          scheduled: { $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          totalSchedules: 1,
          scheduled: 1,
          inProgress: 1,
          completed: 1,
          cancelled: 1,
        },
      },
      { $sort: { department: 1 } },
    ]);

    // Log report access
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'report_access',
        `Accessed Schedule Summary Report (Range: ${startDate.toISOString()} to ${endDate.toISOString()})`,
        undefined,
        'Report',
        req
      );
    }

    res.json(summary);
  } catch (error: any) {
    console.error('Error generating schedule summary report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Inventory Overview Report
// @route   GET /api/reports/inventory-overview
// @access  Protected (admin, pharmacy_staff, general_staff)
export const getInventoryOverview = async (req: Request, res: Response) => {
  try {
    const overview = await Inventory.aggregate([
      {
        $project: {
          _id: 0,
          drugName: 1,
          currentStock: 1,
          reorderThreshold: 1,
          location: 1,
          isLowStock: { $lte: ['$currentStock', '$reorderThreshold'] },
        },
      },
      { $sort: { drugName: 1 } },
    ]);

    // Log report access
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'report_access',
        `Accessed Inventory Overview Report`,
        undefined,
        'Report',
        req
      );
    }

    res.json(overview);
  } catch (error: any) {
    console.error('Error generating inventory overview report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Alert Metrics Report
// @route   GET /api/reports/alert-metrics
// @access  Protected (admin, general_staff)
export const getAlertMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = parseDateRange(req);

    const metrics = await Alert.aggregate([
      {
        $match: {
          triggeredAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          totalTriggers: { $sum: 1 },
          activeNow: { $sum: { $cond: ['$active', 1, 0] } },
          avgDurationMinutes: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ['$deactivatedAt', null] }, { $ne: ['$triggeredAt', null] }] },
                { $divide: [{ $subtract: ['$deactivatedAt', '$triggeredAt'] }, 60000] }, // Duration in minutes
                null,
              ],
            },
          },
          latestTrigger: { $max: '$triggeredAt' },
        },
      },
      {
        $project: {
          _id: 0,
          alertType: '$_id',
          totalTriggers: 1,
          activeNow: 1,
          avgDurationMinutes: { $round: ['$avgDurationMinutes', 2] }, // Round to 2 decimal places
          latestTrigger: 1,
        },
      },
      { $sort: { alertType: 1 } },
    ]);

    // Log report access
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'report_access',
        `Accessed Alert Metrics Report (Range: ${startDate.toISOString()} to ${endDate.toISOString()})`,
        undefined,
        'Report',
        req
      );
    }

    res.json(metrics);
  } catch (error: any) {
    console.error('Error generating alert metrics report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Audit Log Summary Report (Admin only)
// @route   GET /api/reports/audit-summary
// @access  Protected (admin)
export const getAuditLogSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = parseDateRange(req);

    const summary = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$actionType',
          totalActions: { $sum: 1 },
          usersAffected: { $addToSet: '$userId' }, // Get unique users involved
        },
      },
      {
        $project: {
          _id: 0,
          actionType: '$_id',
          totalActions: 1,
          uniqueUsers: { $size: '$usersAffected' }, // Count unique users
        },
      },
      { $sort: { actionType: 1 } },
    ]);

    // Log report access
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'report_access',
        `Accessed Audit Log Summary Report (Range: ${startDate.toISOString()} to ${endDate.toISOString()})`,
        undefined,
        'Report',
        req
      );
    }

    res.json(summary);
  } catch (error: any) {
    console.error('Error generating audit log summary report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
