/**
 * Express app - middleware và mount routes (theo feature)
 */
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './features/auth/routes.js';
import userRoutes from './features/users/routes.js';
import productRoutes from './features/products/routes.js';
import adminRoutes from './features/admin/routes.js';
import newsletterRoutes from './features/newsletter/routes.js';
import chatRoutes from './features/chat/routes.js';

const app = express();

// CORS - cho phép frontend gọi API
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, message: 'API running' }));

// Middleware xử lý lỗi tập trung (phải đặt cuối)
app.use(errorHandler);

export default app;
