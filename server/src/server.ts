// src/server.ts
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app'; 
import connectDB from './config/db'; 
import { initializeSocketIO } from './sockets/socket'; 

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server from Express app 
//! Note: We use this and then pass that server instance to new SocketIOServer(server, { ... }) because Socket.IO needs to attach itself to an existing HTTP server.
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Socket.IO instance passed to a dedicated initializer
initializeSocketIO(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`MongoDB connected successfully`);
  console.log(`Socket.IO initialized`);
});

// Handled the unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
