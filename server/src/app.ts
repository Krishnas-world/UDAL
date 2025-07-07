// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// Import route modules here as we create them
// import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';
// import scheduleRoutes from './routes/scheduleRoutes';
// import tokenRoutes from './routes/tokenRoutes';
// import inventoryRoutes from './routes/inventoryRoutes';
// import alertRoutes from './routes/alertRoutes';

// Import middleware
// import { protect } from './middleware/authMiddleware';

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend URL
  credentials: true // Allow cookies/authorization headers
}));

// Basic route for testing
app.get('/', (_req, res) => {
  res.send('Wenlock Backend API is live 🔥');
});

// Add routes here as they are developed
// app.use('/api/auth', authRoutes);
// app.use('/api/users', protect, userRoutes);
// app.use('/api/schedules', protect, scheduleRoutes);
// app.use('/api/tokens', protect, tokenRoutes);
// app.use('/api/inventory', protect, inventoryRoutes);
// app.use('/api/alerts', protect, alertRoutes);

export default app;
