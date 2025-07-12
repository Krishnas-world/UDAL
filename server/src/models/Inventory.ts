// src/models/Inventory.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for Inventory Document
export interface IInventory extends Document {
  drugName: string;
  currentStock: number;
  reorderThreshold: number; 
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Schema
const InventorySchema: Schema<IInventory> = new Schema(
  {
    drugName: {
      type: String,
      required: [true, 'Please add a drug name'],
      unique: true, // Ensure unique drug names
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Stock cannot be negative
    },
    reorderThreshold: {
      type: Number,
      required: true,
      default: 10, // Default threshold, can be updated
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);

export default Inventory;
