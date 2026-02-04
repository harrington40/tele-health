import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { authRateLimit, validateLoginInput, bruteForceProtection } from '../middleware/security.middleware';
const r = require('rethinkdb');

const router = express.Router();

// Simple country detection from phone number
const getCountryFromPhone = (phoneNumber: string) => {
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    return null;
  }

  const countryCodes: { [key: string]: { code: string; name: string } } = {
    '+255': { code: 'TZ', name: 'Tanzania' },
    '+254': { code: 'KE', name: 'Kenya' },
    '+256': { code: 'UG', name: 'Uganda' },
    '+250': { code: 'RW', name: 'Rwanda' },
    '+257': { code: 'BI', name: 'Burundi' },
    '+243': { code: 'CD', name: 'Democratic Republic of the Congo' },
    '+234': { code: 'NG', name: 'Nigeria' },
    '+233': { code: 'GH', name: 'Ghana' },
    '+27': { code: 'ZA', name: 'South Africa' },
    '+20': { code: 'EG', name: 'Egypt' },
    '+251': { code: 'ET', name: 'Ethiopia' },
    '+1': { code: 'US', name: 'United States' },
    '+44': { code: 'GB', name: 'United Kingdom' },
    '+49': { code: 'DE', name: 'Germany' },
    '+33': { code: 'FR', name: 'France' },
    '+39': { code: 'IT', name: 'Italy' },
    '+34': { code: 'ES', name: 'Spain' },
    '+31': { code: 'NL', name: 'Netherlands' },
    '+46': { code: 'SE', name: 'Sweden' },
    '+47': { code: 'NO', name: 'Norway' },
    '+45': { code: 'DK', name: 'Denmark' },
    '+358': { code: 'FI', name: 'Finland' },
    '+48': { code: 'PL', name: 'Poland' },
    '+420': { code: 'CZ', name: 'Czech Republic' },
    '+36': { code: 'HU', name: 'Hungary' },
    '+40': { code: 'RO', name: 'Romania' },
    '+30': { code: 'GR', name: 'Greece' },
    '+90': { code: 'TR', name: 'Turkey' },
    '+7': { code: 'RU', name: 'Russia' },
    '+86': { code: 'CN', name: 'China' },
    '+81': { code: 'JP', name: 'Japan' },
    '+82': { code: 'KR', name: 'South Korea' },
    '+91': { code: 'IN', name: 'India' },
    '+65': { code: 'SG', name: 'Singapore' },
    '+60': { code: 'MY', name: 'Malaysia' },
    '+66': { code: 'TH', name: 'Thailand' },
    '+84': { code: 'VN', name: 'Vietnam' },
    '+62': { code: 'ID', name: 'Indonesia' },
    '+63': { code: 'PH', name: 'Philippines' },
    '+61': { code: 'AU', name: 'Australia' },
    '+64': { code: 'NZ', name: 'New Zealand' },
    '+55': { code: 'BR', name: 'Brazil' },
    '+52': { code: 'MX', name: 'Mexico' },
    '+54': { code: 'AR', name: 'Argentina' },
    '+56': { code: 'CL', name: 'Chile' },
    '+57': { code: 'CO', name: 'Colombia' },
    '+58': { code: 'VE', name: 'Venezuela' },
    '+51': { code: 'PE', name: 'Peru' },
    '+593': { code: 'EC', name: 'Ecuador' },
    '+598': { code: 'UY', name: 'Uruguay' },
    '+595': { code: 'PY', name: 'Paraguay' },
    '+507': { code: 'PA', name: 'Panama' },
    '+506': { code: 'CR', name: 'Costa Rica' },
    '+503': { code: 'SV', name: 'El Salvador' },
    '+502': { code: 'GT', name: 'Guatemala' },
    '+504': { code: 'HN', name: 'Honduras' },
    '+505': { code: 'NI', name: 'Nicaragua' },
  };

  // Try different lengths of calling codes
  for (let length = 4; length >= 1; length--) {
    const callingCode = phoneNumber.substring(0, length + 1);
    if (countryCodes[callingCode]) {
      return countryCodes[callingCode];
    }
  }

  return null;
};

// Register patient
router.post('/register/patient', authRateLimit, async (req: Request, res: Response): Promise<void> => {
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

    // Detect country from phone number
    const detectedCountry = getCountryFromPhone(phone);

    // Create user
    const user = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      user_type: 'patient',
      country: detectedCountry,
      consent_to_terms: consent_to_terms || false,
      consent_to_privacy: consent_to_privacy || false,
      hipaa_consent: hipaa_consent || false,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await r.table('users').insert(user).run(connection);
    const userId = result.generated_keys[0];

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const token = jwt.sign(
      { userId, email: user.email, userType: user.user_type },
      jwtSecret,
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
router.post('/login', authRateLimit, bruteForceProtection, validateLoginInput, async (req: Request, res: Response): Promise<void> => {
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

    // Check password - support both password and password_hash fields
    const storedPassword = user.password || user.password_hash;
    if (!storedPassword) {
      console.error('User has no password set');
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, storedPassword);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      jwtSecret,
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
        user_type: user.user_type,
        country: user.country
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update emergency contact
router.put('/emergency-contact', async (req: Request, res: Response): Promise<void> => {
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

    // Get emergency contact data from request body
    const { name, phone, relationship, country, province } = req.body;

    // Validate required fields
    if (!name || !phone || !country) {
      res.status(400).json({ error: 'Name, phone, and country are required' });
      return;
    }

    // Prepare emergency contact object
    const emergencyContact = {
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship || '',
      country: {
        code: country.code,
        name: country.name,
        flag: country.flag,
        callingCode: country.callingCode
      },
      province: province ? province.trim() : undefined
    };

    // Update user with emergency contact
    const result = await r.table('users')
      .get(decoded.userId)
      .update({
        emergency_contact: emergencyContact,
        updated_at: new Date()
      })
      .run(connection);

    if (result.replaced === 0 && result.unchanged === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Emergency contact updated successfully',
      emergencyContact
    });

  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
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