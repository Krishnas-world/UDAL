// src/controllers/alertController.ts
import { Request, Response } from 'express';
import Alert, { IAlert } from '../models/Alert';
import { getIo } from '../sockets/socket'; // Import the Socket.IO instance

// @desc    Get all active alerts
// @route   GET /api/alerts/active
// @access  Protected (general_staff, ot_staff, pharmacy_staff, admin)
export const getActiveAlerts = async (_req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ triggeredAt: -1 }); // Latest active alerts first
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
    // Deactivate any existing alerts of the same type if needed (optional logic, depends on requirements)
    // For simplicity, we'll allow multiple active alerts for now, but a hospital might want only one Code Red at a time.
    // If you want to deactivate previous alerts of the same type:
    // await Alert.updateMany({ type, active: true }, { $set: { active: false, deactivatedAt: new Date() } });

    const newAlert = new Alert({
      type,
      message,
      active: true,
      triggeredBy: req.user?._id.toString(), // Get user ID from authenticated request
      triggeredAt: new Date(),
    });

    const createdAlert = await newAlert.save();

    // Emit real-time alert via Socket.IO to all connected clients
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
