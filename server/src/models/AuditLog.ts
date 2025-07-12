// src/models/AuditLog.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define possible action types for auditing
export type AuditActionType =
  | 'user_login'
  | 'user_register'
  | 'user_update'
  | 'user_delete'
  | 'schedule_create'
  | 'schedule_update'
  | 'schedule_delete'
  | 'token_advance'
  | 'token_reset'
  | 'inventory_create'
  | 'inventory_update'
  | 'inventory_delete'
  | 'alert_trigger'
  | 'alert_deactivate'
  | 'report_access'
  | 'integration_fetch'
  | 'integration_sync'; 

// Interface for AuditLog Document
export interface IAuditLog extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  username: string; 
  actionType: AuditActionType; 
  details: string; 
  resourceId?: mongoose.Schema.Types.ObjectId; 
  resourceType?: string; 
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// AuditLog Schema
const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    actionType: {
      type: String,
      enum: [
        'user_login',
        'user_register',
        'user_update',
        'user_delete',
        'schedule_create',
        'schedule_update',
        'schedule_delete',
        'token_advance',
        'token_reset',
        'inventory_create',
        'inventory_update',
        'inventory_delete',
        'alert_trigger',
        'alert_deactivate',
        'report_access', // NEW: Added to enum here
      ],
      required: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'resourceType', // Dynamically reference other models
      required: false,
    },
    resourceType: {
      type: String,
      required: false,
      enum: ['User', 'Schedule', 'Token', 'Inventory', 'Alert', 'Report'], // Added 'Report' as a resource type
    },
    ipAddress: {
      type: String,
      required: false,
      trim: true,
    },
    userAgent: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only create 'createdAt'
  }
);

const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
