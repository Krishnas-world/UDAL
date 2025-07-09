// src/controllers/scheduleController.ts
import { Request, Response } from 'express';
import Schedule, { ISchedule } from '../models/Schedule';
import { getIo } from '../sockets/socket'; // Import the Socket.IO instance

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

// @desc    Create a new schedule
// @route   POST /api/schedules
// @access  Protected (ot_staff, admin)
export const createSchedule = async (req: Request, res: Response) => {
  const { department, type, patientToken, doctorName, roomNumber, scheduledTime, notes } = req.body;

  // Basic validation
  if (!department || !type || !patientToken || !scheduledTime) {
    return res.status(400).json({ message: 'Please enter all required fields: department, type, patientToken, scheduledTime' });
  }

  try {
    const schedule = new Schedule({
      department,
      type,
      patientToken,
      doctorName,
      roomNumber,
      scheduledTime: new Date(scheduledTime), // Ensure it's a Date object
      status: 'Scheduled', // Default status
      notes,
    });

    const createdSchedule = await schedule.save();

    // Emit real-time update via Socket.IO
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
  const { department, type, patientToken, doctorName, roomNumber, scheduledTime, status, notes } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Update fields
    schedule.department = department || schedule.department;
    schedule.type = type || schedule.type;
    schedule.patientToken = patientToken || schedule.patientToken;
    schedule.doctorName = doctorName || schedule.doctorName;
    schedule.roomNumber = roomNumber || schedule.roomNumber;
    schedule.scheduledTime = scheduledTime ? new Date(scheduledTime) : schedule.scheduledTime;
    schedule.status = status || schedule.status;
    schedule.notes = notes || schedule.notes;

    const updatedSchedule = await schedule.save();

    // Emit real-time update via Socket.IO
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

    await Schedule.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+

    // Emit real-time update via Socket.IO
    const io = getIo();
    io.emit('scheduleUpdate', { action: 'delete', scheduleId: req.params.id });

    res.json({ message: 'Schedule removed' });
  } catch (error: any) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
