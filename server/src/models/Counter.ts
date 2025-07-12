// src/models/Counter.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for Counter Document
export interface ICounter extends Document {
  _id: string; 
  seq: number; 
}

// Counter Schema
const CounterSchema: Schema<ICounter> = new Schema({
  _id: {
    type: String,
    trim: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);

export default Counter;
