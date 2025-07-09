// src/models/Schedule.ts
import mongoose, { Document, Schema } from 'mongoose';

export type ScheduleType = 'OT' | 'Consultation';

export type ScheduleStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface ISchedule extends Document {
  department: string; 
  type: ScheduleType; 
  patientToken: string; 
  doctorName?: string; 
  roomNumber?: string; 
  scheduledTime: Date; 
  status: ScheduleStatus; 
  notes?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema: Schema<ISchedule> = new Schema(
  {
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['OT', 'Consultation'],
      required: [true, 'Please specify schedule type (OT or Consultation)'],
    },
    patientToken: {
      type: String,
      required: [true, 'Please add a patient token/identifier'],
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Please add a scheduled time'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule;
