// src/sockets/socket.ts
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocketIO = (httpServerIo: SocketIOServer) => {
  io = httpServerIo;
  console.log('Socket.IO initialized and ready to use.');

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Function to get the initialized Socket.IO instance
export const getIo = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocketIO first.');
  }
  return io;
};
