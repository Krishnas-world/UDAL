// src/models/Token.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface for Token Document
export interface IToken extends Document {
  department: string;
  currentToken: number; 
  lastResetAt: Date; 
  createdAt: Date;
  updatedAt: Date;
}

// Token Schema
const TokenSchema: Schema<IToken> = new Schema(
  {
    department: {
      type: String,
      required: [true, 'Please add a department for the token queue'],
      unique: true, 
      trim: true,
    },
    currentToken: {
      type: Number,
      required: true,
      default: 0, // Start from 0 or 1, depending on hospital policy
      min: 0,
    },
    lastResetAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Token = mongoose.model<IToken>('Token', TokenSchema);

export default Token;
