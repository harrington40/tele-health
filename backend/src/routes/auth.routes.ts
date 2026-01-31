import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
const r = require('rethinkdb');

const router = express.Router();

// Register patient
router.post('/register/patient', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, phone, consent_to_terms, consent_to_privacy, hipaa_consent } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check database connection
    try {
      db.getConnection();
    } catch (error) {
      console.error('Database not connected:', error);
      res.status(503).json({ error: 'Database service unavailable' });
      return;
    }

    const connection = db.getConnection();

    // Check if user already exists
    const existingUser = await r.table('users').filter({ email }).run(connection);
    const existingArray = await existingUser.toArray();
    if (existingArray.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      user_type: 'patient',
      consent_to_terms: consent_to_terms || false,
      consent_to_privacy: consent_to_privacy || false,
      hipaa_consent: hipaa_consent || false,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await r.table('users').insert(user).run(connection);
    const userId = result.generated_keys[0];

    // Generate JWT
    const token = jwt.sign(
      { userId, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'Patient registered successfully',
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Check database connection
    try {
      db.getConnection();
    } catch (error) {
      console.error('Database not connected:', error);
      res.status(503).json({ error: 'Database service unavailable' });
      return;
    }

    const connection = db.getConnection();

    // Find user
    const userCursor = await r.table('users').filter({ email }).run(connection);
    const userArray = await userCursor.toArray();
    if (userArray.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = userArray[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.auth_token;
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-in-production') as any;

    // Check database connection
    try {
      db.getConnection();
    } catch (error) {
      console.error('Database not connected:', error);
      res.status(503).json({ error: 'Database service unavailable' });
      return;
    }

    const connection = db.getConnection();
    const userCursor = await r.table('users').get(decoded.userId).run(connection);
    
    if (!userCursor) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = userCursor;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;