// src/controllers/scheduleController.ts
import { Request, Response } from 'express';
import Schedule from '../models/Schedule';
import Counter from '../models/Counter'; // Import Counter model
import { getIo } from '../sockets/socket'; // Import the Socket.IO instance
import { createAuditLog } from './auditController'; // NEW: Import createAuditLog

// Helper function to get next sequence number for a department
async function getNextSequence(department: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    department,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // Create if not exists, return updated document
  );
  return counter.seq;
}

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Protected (general_staff, ot_staff, admin)
export const getSchedules = async (req: Request, res: Response) => {
  try {
    // Filter by department if provided in query, otherwise get all
    const department = req.query.department as string;
    const query: any = {};
    if (department) {
      query.department = department;
    }

    const schedules = await Schedule.find(query).sort({ scheduledTime: 1 });
    res.json(schedules);
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single schedule by ID
// @route   GET /api/schedules/:id
// @access  Protected (general_staff, ot_staff, admin)
export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error: any) {
    console.error('Error fetching schedule by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get schedules by patient token
// @route GET /api/schedules/by-patient-token/:patientToken
// @access Protected (general_staff, ot_staff, pharmacy_staff, admin)
export const getSchedulesByPatientToken = async (req: Request, res: Response) => {
  try {
    const patientToken = req.params.patientToken as string;
    const schedules = await Schedule.find({ patientToken }).sort({ scheduledTime: 1 });

    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this patient token' });
    }
    res.json(schedules);
  } catch (error: any) {
    console.error('Error fetching schedules by patient token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Create a new schedule
// @route   POST /api/schedules
// @access  Protected (ot_staff, admin)
export const createSchedule = async (req: Request, res: Response) => {
  const { department, type, doctorName, roomNumber, scheduledTime, notes } = req.body;

  if (!department || !type || !scheduledTime) {
    return res.status(400).json({ message: 'Please enter all required fields: department, type, scheduledTime' });
  }

  try {
    const nextSeq = await getNextSequence(department);
    const generatedPatientToken = `${department.toUpperCase()}-${nextSeq.toString().padStart(4, '0')}`;

    const schedule = new Schedule({
      department,
      type,
      patientToken: generatedPatientToken,
      doctorName,
      roomNumber,
      scheduledTime: new Date(scheduledTime),
      status: 'Scheduled',
      notes,
    });

    const createdSchedule = await schedule.save();

    // NEW: Log schedule creation
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'schedule_create',
        `Created new ${createdSchedule.type} schedule for ${createdSchedule.department} (Patient: ${createdSchedule.patientToken})`,
        (createdSchedule._id as string)?.toString(),
        'Schedule',
        req
      );
    }

    const io = getIo();
    io.emit('scheduleUpdate', { action: 'create', schedule: createdSchedule });

    res.status(201).json(createdSchedule);
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Protected (ot_staff, admin)
export const updateSchedule = async (req: Request, res: Response) => {
  const { department, type, doctorName, roomNumber, scheduledTime, status, notes } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const oldStatus = schedule.status; // Capture old status for logging
    const oldScheduledTime = schedule.scheduledTime; // Capture old time for logging

    schedule.department = department || schedule.department;
    schedule.type = type || schedule.type;
    schedule.doctorName = doctorName || schedule.doctorName;
    schedule.roomNumber = roomNumber || schedule.roomNumber;
    schedule.scheduledTime = scheduledTime ? new Date(scheduledTime) : schedule.scheduledTime;
    schedule.status = status || schedule.status;
    schedule.notes = notes || schedule.notes;

    const updatedSchedule = await schedule.save();

    // NEW: Log schedule update
    if (req.user) {
      let details = `Updated ${updatedSchedule.type} schedule for ${updatedSchedule.department} (Patient: ${updatedSchedule.patientToken}).`;
      if (status && status !== oldStatus) {
        details += ` Status changed from '${oldStatus}' to '${updatedSchedule.status}'.`;
      }
      if (scheduledTime && new Date(scheduledTime).getTime() !== oldScheduledTime.getTime()) {
        details += ` Time changed from '${oldScheduledTime.toISOString()}' to '${updatedSchedule.scheduledTime.toISOString()}'.`;
      }
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'schedule_update',
        details,
        (updatedSchedule._id as string)?.toString(),
        'Schedule',
        req
      );
    }

    const io = getIo();
    io.emit('scheduleUpdate', { action: 'update', schedule: updatedSchedule });

    res.json(updatedSchedule);
  } catch (error: any) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Protected (admin)
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const deletedScheduleDetails = `Schedule for ${schedule.department}, type ${schedule.type}, patient ${schedule.patientToken}`;
    const deletedScheduleId = schedule._id;

    await Schedule.deleteOne({ _id: req.params.id });

    // NEW: Log schedule deletion
    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'schedule_delete',
        `Deleted ${deletedScheduleDetails} by ${req.user.username}`,
        (deletedScheduleId as string)?.toString(),
        'Schedule',
        req
      );
    }

    const io = getIo();
    io.emit('scheduleUpdate', { action: 'delete', scheduleId: req.params.id });

    res.json({ message: 'Schedule removed' });
  } catch (error: any) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
