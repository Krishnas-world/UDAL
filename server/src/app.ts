// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// Import route modules
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import scheduleRoutes from './routes/scheduleRoutes'; // NEW: Import schedule routes
// import tokenRoutes from './routes/tokenRoutes'; // Will be added later
// import inventoryRoutes from './routes/inventoryRoutes'; // Will be added later
// import alertRoutes from './routes/alertRoutes'; // Will be added later

// Import middleware
import { protect } from './middlewares/authMiddleware';

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

// Add routes here
app.use('/api/auth', authRoutes); // Auth routes (login, register)
app.use('/api/users', protect, userRoutes); // User routes, protected by JWT
app.use('/api/schedules', protect, scheduleRoutes); // NEW: Schedule routes, protected by JWT and roles
// app.use('/api/tokens', protect, tokenRoutes);
// app.use('/api/inventory', protect, inventoryRoutes);
// app.use('/api/alerts', protect, alertRoutes);

export default app;