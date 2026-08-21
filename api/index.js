import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from '../backend/routes/authRoutes.js';
import projectRoutes from '../backend/routes/projectRoutes.js';
import orderRoutes from '../backend/routes/orderRoutes.js';
import userRoutes from '../backend/routes/userRoutes.js';
import contactRoutes from '../backend/routes/contactRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'ZARO Cloud REST API Backend (Vercel Serverless)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default app;
