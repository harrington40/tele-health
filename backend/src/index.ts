import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import db from './config/database';

console.log('Starting backend server...');
dotenv.config();
console.log('Dotenv loaded');

const app = express();
console.log('Express app created');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
console.log('CORS middleware added');
app.use(cookieParser());
console.log('Cookie parser added');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server started successfully');
  console.log('Listening...');
});
