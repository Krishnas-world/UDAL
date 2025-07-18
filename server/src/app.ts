import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
// Import route modules
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import scheduleRoutes from './routes/scheduleRoutes'; 
import tokenRoutes from './routes/tokenRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import alertRoutes from './routes/alertRoutes';
import auditRoutes from './routes/auditRoutes'; 
import reportRoutes from './routes/reportRoutes'
import metaRoutes from './routes/metaRoutes'
// Import middleware
import { protect } from './middlewares/authMiddleware';

const app = express();
// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cookieParser());
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true, // MUST BE TRUE for cookies to be sent/received cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Basic route for testing
app.get('/', (_req, res) => {
  res.send('Wenlock Backend API is live 🔥');
});

// Add routes here
app.use('/api/auth', authRoutes); 
app.use('/api/users', protect, userRoutes); 
app.use('/api/schedules', protect, scheduleRoutes); 
app.use('/api/tokens', protect, tokenRoutes);
app.use('/api/inventory', protect, inventoryRoutes);
app.use('/api/alerts', protect, alertRoutes);
app.use('/api/auditlogs', protect, auditRoutes); 
app.use('/api/reports', protect, reportRoutes);
app.use('/api/meta', protect, metaRoutes)
export default app;