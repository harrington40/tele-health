import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { authRateLimit, validateLoginInput, bruteForceProtection } from '../middleware/security.middleware';
import emailService from '../services/email.service';
import verificationService from '../services/verification.service';
import { config } from '../config';
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
      email_verified: false, // Require email verification
      is_active: false, // Account inactive until verified
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await r.table('users').insert(user).run(connection);
    const userId = result.generated_keys[0];

    // Generate and send verification code
    try {
      const verificationCode = await verificationService.createVerificationCode(userId, email, 'registration');
      await emailService.sendVerificationCode(email, verificationCode, 'registration');
      console.log(`📧 Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails - user can request resend
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for the verification code.',
      requiresVerification: true,
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        user_type: user.user_type,
        email_verified: false
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register tech support
router.post('/register/tech-support', authRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, phone, employee_id, department } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !employee_id) {
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

    // Create tech support user
    const user = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone: phone || '',
      user_type: 'tech_support',
      employee_id,
      department: department || 'Support',
      email_verified: true, // Auto-verify tech support accounts
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await r.table('users').insert(user).run(connection);
    const userId = result.generated_keys[0];

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, `${first_name} ${last_name}`);
      console.log(`📧 Welcome email sent to tech support: ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      message: 'Tech support account created successfully',
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        employee_id: user.employee_id,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Tech support registration error:', error);
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

    // Check if email is verified
    if (!user.email_verified) {
      res.status(403).json({ 
        error: 'Email not verified. Please verify your email first.',
        requiresVerification: true,
        email: user.email
      });
      return;
    }

    // Generate and send login verification code
    try {
      const verificationCode = await verificationService.createVerificationCode(user.id, email, 'login');
      await emailService.sendVerificationCode(email, verificationCode, 'login');
      console.log(`📧 Login verification code sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send login verification email:', emailError);
      // Allow login even if email fails
    }

    res.json({
      message: 'Verification code sent to your email',
      requiresVerification: true,
      userId: user.id,
      email: user.email
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
    // Get user info from token before clearing
    const token = req.cookies.auth_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        const connection = db.getConnection();
        const userCursor = await r.table('users').filter({ id: decoded.userId }).run(connection);
        const users = await userCursor.toArray();
        
        if (users.length > 0) {
          const user = users[0];
          const userName = `${user.first_name} ${user.last_name}`;
          const deviceInfo = req.headers['user-agent'] || 'Unknown device';
          
          // Send logout notification email
          try {
            await emailService.sendLogoutNotification(user.email, userName, deviceInfo);
            console.log(`📧 Logout notification sent to ${user.email}`);
          } catch (emailError) {
            console.error('Failed to send logout notification:', emailError);
          }
        }
      } catch (tokenError) {
        console.error('Error processing logout notification:', tokenError);
      }
    }
    
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email/login code
router.post('/verify-code', authRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, type } = req.body;

    if (!email || !code || !type) {
      res.status(400).json({ error: 'Email, code, and type are required' });
      return;
    }

    if (!['registration', 'login', 'password_reset'].includes(type)) {
      res.status(400).json({ error: 'Invalid verification type' });
      return;
    }

    // Verify the code
    const result = await verificationService.verifyCode(email, code, type);

    if (!result.valid) {
      res.status(400).json({ error: result.message });
      return;
    }

    // If login verification, generate JWT token
    if (type === 'login') {
      const connection = db.getConnection();
      const userCursor = await r.table('users').filter({ id: result.userId }).run(connection);
      const users = await userCursor.toArray();
      
      if (users.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = users[0];

      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        config.jwt.secret,
        { expiresIn: '24h' }
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
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
    } 
    // If registration verification, send welcome email
    else if (type === 'registration') {
      const connection = db.getConnection();
      const userCursor = await r.table('users').filter({ id: result.userId }).run(connection);
      const users = await userCursor.toArray();
      
      if (users.length > 0) {
        const user = users[0];
        const userName = `${user.first_name} ${user.last_name}`;
        
        // Send welcome email
        try {
          await emailService.sendWelcomeEmail(user.email, userName);
          console.log(`📧 Welcome email sent to ${user.email}`);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      }

      res.json({
        message: 'Email verified successfully. You can now login.',
        verified: true
      });
    } else {
      res.json({
        message: result.message,
        verified: true
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification code
router.post('/resend-code', authRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      res.status(400).json({ error: 'Email and type are required' });
      return;
    }

    if (!['registration', 'login', 'password_reset'].includes(type)) {
      res.status(400).json({ error: 'Invalid verification type' });
      return;
    }

    const result = await verificationService.resendCode(email, type);

    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    // Send the new code via email
    if (result.code) {
      try {
        await emailService.sendVerificationCode(email, result.code, type as 'registration' | 'login');
        console.log(`📧 Verification code resent to ${email}`);
      } catch (emailError) {
        console.error('Failed to resend verification email:', emailError);
      }
    }

    res.json({
      message: 'Verification code sent successfully',
      success: true
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password - send reset code
router.post('/forgot-password', authRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
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

    // Check if user exists
    const userCursor = await r.table('users').filter({ email }).run(connection);
    const userArray = await userCursor.toArray();

    if (userArray.length === 0) {
      // Don't reveal if user exists or not for security
      res.json({
        message: 'If an account exists with this email, a password reset code has been sent.',
        success: true
      });
      return;
    }

    const user = userArray[0];

    // Generate and send password reset code
    try {
      const verificationCode = await verificationService.createVerificationCode(user.id, email, 'password_reset');
      await emailService.sendVerificationCode(email, verificationCode, 'password_reset');
      console.log(`📧 Password reset code sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json({ error: 'Failed to send password reset email' });
      return;
    }

    res.json({
      message: 'If an account exists with this email, a password reset code has been sent.',
      success: true,
      email: email
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password with verification code
router.post('/reset-password', authRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res.status(400).json({ error: 'Email, code, and new password are required' });
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    // Verify the code
    const result = await verificationService.verifyCode(email, code, 'password_reset');

    if (!result.valid) {
      res.status(400).json({ error: result.message });
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.rounds);

    // Update user password
    await r.table('users')
      .filter({ id: result.userId })
      .update({
        password: hashedPassword,
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .run(connection);

    // Send confirmation email
    try {
      const userCursor = await r.table('users').get(result.userId).run(connection);
      if (userCursor) {
        const userName = `${userCursor.first_name} ${userCursor.last_name}`;
        // For now, just send a simple notification (we can create a dedicated template later)
        await emailService.sendWelcomeEmail(userCursor.email, userName);
        console.log(`📧 Password reset confirmation sent to ${email}`);
      }
    } catch (emailError) {
      console.error('Failed to send password reset confirmation:', emailError);
    }

    res.json({
      message: 'Password reset successfully. You can now login with your new password.',
      success: true
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;