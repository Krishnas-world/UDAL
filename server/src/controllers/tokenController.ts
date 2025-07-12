// src/controllers/tokenController.ts
import { Request, Response } from 'express';
import Token from '../models/Token';
import { getIo } from '../sockets/socket'; // Import the Socket.IO instance
import { createAuditLog } from './auditController'; // NEW: Import createAuditLog

// @desc    Get current token for a specific department
// @route   GET /api/tokens/:department
// @access  Protected (general_staff, ot_staff, pharmacy_staff, admin)
export const getToken = async (req: Request, res: Response) => {
  try {
    const department = req.params.department as string;
    let token = await Token.findOne({ department });

    if (!token) {
      // If no token entry exists for the department, create one with default 0
      token = await Token.create({ department, currentToken: 0 });
      // No need to emit here, as it's a new creation, not an update to an existing queue
    }
    res.json(token);
  } catch (error: any) {
    console.error('Error fetching token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Advance token for a specific department
// @route   PUT /api/tokens/:department/advance
// @access  Protected (ot_staff, pharmacy_staff, admin)
export const advanceToken = async (req: Request, res: Response) => {
  try {
    const department = req.params.department as string;

    // Find and update the token, or create if it doesn't exist
    const updatedToken = await Token.findOneAndUpdate(
      { department },
      { $inc: { currentToken: 1 } }, // Increment currentToken by 1
      { new: true, upsert: true, setDefaultsOnInsert: true } // Return updated doc, create if not exists
    );

    // NEW: Log token advance
    if (req.user && updatedToken) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'token_advance',
        `Advanced token for ${department} to ${updatedToken.currentToken}`,
        req.user._id.toString(),
        'Token',
        req
      );
    }

    const io = getIo();
    io.emit('tokenUpdate', { action: 'advance', token: updatedToken });

    res.json(updatedToken);
  } catch (error: any) {
    console.error('Error advancing token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset token for a specific department
// @route   PUT /api/tokens/:department/reset
// @access  Protected (admin)
export const resetToken = async (req: Request, res: Response) => {
  try {
    const department = req.params.department as string;

    // Find and update the token, or create if it doesn't exist
    const updatedToken = await Token.findOneAndUpdate(
      { department },
      { currentToken: 0, lastResetAt: Date.now() }, // Reset to 0 and update lastResetAt
      { new: true, upsert: true, setDefaultsOnInsert: true } // Return updated doc, create if not exists
    );

    // NEW: Log token reset
    if (req.user && updatedToken) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'token_reset',
        `Reset token for ${department} to ${updatedToken.currentToken}`,
        updatedToken._id?.toString(),
        'Token',
        req
      );
    }

    const io = getIo();
    io.emit('tokenUpdate', { action: 'reset', token: updatedToken });

    res.json(updatedToken);
  } catch (error: any) {
    console.error('Error resetting token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
