// src/controllers/alertController.ts
import { Request, Response } from 'express';
import Alert, { IAlert } from '../models/Alert';
import { getIo } from '../sockets/socket'; 
import { createAuditLog } from './auditController'; 

// @desc    Get all active alerts
// @route   GET /api/alerts/active
// @access  Protected (general_staff, ot_staff, pharmacy_staff, admin)
export const getActiveAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ triggeredAt: -1 }); 
    res.json(alerts);
  } catch (error: any) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Trigger a new emergency alert
// @route   POST /api/alerts/trigger
// @access  Protected (admin)
export const triggerAlert = async (req: Request, res: Response) => {
  const { type, message } = req.body;

  if (!type || !message) {
    return res.status(400).json({ message: 'Please provide alert type and message' });
  }

  try {
    const newAlert = new Alert({
      type,
      message,
      active: true,
      triggeredBy: req.user?._id.toString(), 
    });

    const createdAlert = await newAlert.save();

    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'alert_trigger',
        `Triggered new alert: '${createdAlert.type}' with message: '${createdAlert.message}'`,
        createdAlert._id?.toString(),
        'Alert',
        req
      );
    }
    const io = getIo();
    io.emit('emergencyAlert', { action: 'trigger', alert: createdAlert });

    res.status(201).json(createdAlert);
  } catch (error: any) {
    console.error('Error triggering alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Deactivate an active emergency alert
// @route   PUT /api/alerts/:id/deactivate
// @access  Protected (admin)
export const deactivateAlert = async (req: Request, res: Response) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (!alert.active) {
      return res.status(400).json({ message: 'Alert is already inactive' });
    }

    alert.active = false;
    alert.deactivatedAt = new Date();

    const updatedAlert = await alert.save();

    // NEW: Log alert deactivation
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'alert_deactivate',
        `Deactivated alert: '${updatedAlert.type}' (ID: ${updatedAlert._id}) with message: '${updatedAlert.message}'`,
        updatedAlert._id?.toString(),
        'Alert',
        req
      );
    }

    // Emit real-time alert deactivation via Socket.IO
    const io = getIo();
    io.emit('emergencyAlert', { action: 'deactivate', alertId: updatedAlert._id, alert: updatedAlert });

    res.json(updatedAlert);
  } catch (error: any) {
    console.error('Error deactivating alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all alerts (active and inactive) - Admin only
// @route   GET /api/alerts/all
// @access  Protected (admin)
export const getAllAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({}).sort({ triggeredAt: -1 });
    res.json(alerts);
  } catch (error: any) {
    console.error('Error fetching all alerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
