import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import db from './config/database';
import { securityHeaders, apiRateLimit } from './middleware/security.middleware';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error(error.stack);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log the error
});

console.log('Starting backend server...');
dotenv.config();
console.log('Dotenv loaded');

const app = express();
console.log('Express app created');

// Security middleware (must be first)
app.use(securityHeaders);
console.log('Security headers middleware added');

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
console.log('CORS middleware added');

// Rate limiting
app.use('/api/', apiRateLimit);
console.log('API rate limiting added');

// Other middleware
app.use(cookieParser());
console.log('Cookie parser added');
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
console.log('JSON and URL encoded middleware added');

// Routes
app.use('/api/auth', authRoutes);
console.log('Auth routes added');

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Telehealth Backend API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);
console.log('Starting server on port:', PORT);
console.log('DB Config:', {
  host: process.env.RETHINKDB_HOST,
  port: process.env.RETHINKDB_PORT,
  db: process.env.RETHINKDB_DB
});

// Connect to database first
db.connect().then(() => {
  console.log('Database connected successfully');
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  console.log('Server will start without database connection');
});

// Start server regardless of DB status
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server started successfully');
  console.log('Listening...');
});
