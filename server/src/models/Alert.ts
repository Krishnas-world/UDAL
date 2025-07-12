// src/models/Alert.ts
import mongoose, { Document, Schema } from 'mongoose';
export type AlertType = 'Code Blue' | 'Code Red' | 'Emergency';

export interface IAlert extends Document {
  type: AlertType;
  message: string;
  active: boolean; 
  triggeredBy?: string; 
  triggeredAt: Date;
  deactivatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema: Schema<IAlert> = new Schema(
  {
    type: {
      type: String,
      enum: ['Code Blue', 'Code Red', 'Emergency'],
      required: [true, 'Please specify alert type'],
    },
    message: {
      type: String,
      required: [true, 'Please add an alert message'],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true, 
    },
    triggeredBy: {
      type: String,
      trim: true,
    },
    triggeredAt: {
      type: Date,
      default: Date.now,
    },
    deactivatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

const Alert = mongoose.model<IAlert>('Alert', AlertSchema);

export default Alert;
