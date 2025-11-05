// =====================================================
// Authentication Service - RethinkDB
// Handles login, registration, email verification
// =====================================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { r, getConnection } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

/**
 * Register a new patient
 */
async function registerPatient(data) {
  const connection = getConnection();
  
  try {
    // Check if email already exists
    const existingUser = await r.table('users')
      .filter({ email: data.email })
      .limit(1)
      .run(connection);
    
    const users = await existingUser.toArray();
    if (users.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // Generate email verification token
    const email_verification_token = uuidv4();

    // Create patient document
    const patient = {
      user_type: 'patient',
      email: data.email,
      password_hash,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      
      // Address
      address: data.address || null,
      
      // Emergency contact
      emergency_contact: data.emergency_contact || null,
      
      // Medical info (optional at registration)
      blood_type: data.blood_type || null,
      allergies: data.allergies || [],
      chronic_conditions: data.chronic_conditions || [],
      current_medications: [],
      medical_history: [],
      
      // Insurance
      insurance: data.insurance || null,
      
      // Status
      verification_status: 'verified', // Patients are auto-verified
      is_active: true,
      email_verified: false,
      email_verification_token,
      
      // Compliance
      consent_to_terms: data.consent_to_terms || false,
      consent_to_privacy: data.consent_to_privacy || false,
      hipaa_consent: data.hipaa_consent || false,
      consent_timestamp: data.consent_to_terms ? r.now() : null,
      
      // Timestamps
      created_at: r.now(),
      updated_at: r.now(),
      deleted_at: null
    };

    // Insert patient
    const result = await r.table('users').insert(patient).run(connection);
    
    if (result.inserted !== 1) {
      throw new Error('Failed to create patient account');
    }

    const userId = result.generated_keys[0];

    // Log activity
    await logActivity(connection, userId, 'account_created', 'Patient account created');

    return {
      id: userId,
      email: patient.email,
      user_type: 'patient',
      email_verification_token
    };

  } catch (err) {
    console.error('Error registering patient:', err);
    throw err;
  }
}

/**
 * Register a new doctor
 */
async function registerDoctor(data) {
  const connection = getConnection();
  
  try {
    // Check if email already exists
    const existingUser = await r.table('users')
      .filter({ email: data.email })
      .limit(1)
      .run(connection);
    
    const users = await existingUser.toArray();
    if (users.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // Generate email verification token
    const email_verification_token = uuidv4();

    // Create doctor document
    const doctor = {
      user_type: 'doctor',
      email: data.email,
      password_hash,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      
      // Doctor-specific info
      specialty: data.specialty,
      license_number: data.license_number,
      npi_number: data.npi_number || null,
      dea_number: data.dea_number || null,
      medical_school: data.medical_school || null,
      graduation_year: data.graduation_year || null,
      years_of_experience: data.years_of_experience || 0,
      board_certifications: data.board_certifications || [],
      languages_spoken: data.languages_spoken || ['English'],
      bio: data.bio || '',
      consultation_fee: data.consultation_fee || 0,
      
      // Verification (pending until admin approves)
      verification_status: 'pending',
      verification_documents: [],
      verified_at: null,
      verified_by: null,
      
      // Availability
      availability_schedule: data.availability_schedule || {},
      is_accepting_patients: false, // Only after verification
      
      // Rating
      average_rating: 0,
      total_reviews: 0,
      total_consultations: 0,
      
      // Status
      is_active: true,
      email_verified: false,
      email_verification_token,
      
      // Compliance
      consent_to_terms: data.consent_to_terms || false,
      consent_to_privacy: data.consent_to_privacy || false,
      hipaa_consent: data.hipaa_consent || false,
      consent_timestamp: data.consent_to_terms ? r.now() : null,
      
      // Timestamps
      created_at: r.now(),
      updated_at: r.now(),
      deleted_at: null
    };

    // Insert doctor
    const result = await r.table('users').insert(doctor).run(connection);
    
    if (result.inserted !== 1) {
      throw new Error('Failed to create doctor account');
    }

    const userId = result.generated_keys[0];

    // Log activity
    await logActivity(connection, userId, 'account_created', 'Doctor account created - pending verification');

    return {
      id: userId,
      email: doctor.email,
      user_type: 'doctor',
      verification_status: 'pending',
      email_verification_token
    };

  } catch (err) {
    console.error('Error registering doctor:', err);
    throw err;
  }
}

/**
 * Login user
 */
async function login(email, password, ipAddress = null, userAgent = null) {
  const connection = getConnection();
  
  try {
    // Find user by email
    const cursor = await r.table('users')
      .filter({ email, is_active: true })
      .limit(1)
      .run(connection);
    
    const users = await cursor.toArray();
    
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new Error('Please verify your email before logging in');
    }

    // Check if doctor is verified
    if (user.user_type === 'doctor' && user.verification_status !== 'verified') {
      throw new Error('Your doctor account is pending verification');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        verification_status: user.verification_status
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const session = {
      user_id: user.id,
      token,
      ip_address: ipAddress,
      user_agent: userAgent,
      device_info: null,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      created_at: r.now()
    };

    await r.table('user_sessions').insert(session).run(connection);

    // Update last login
    await r.table('users')
      .get(user.id)
      .update({
        last_login: r.now(),
        is_online: true
      })
      .run(connection);

    // Log activity
    await logActivity(connection, user.id, 'login', 'User logged in', { ip_address: ipAddress });

    // Return user data (without password_hash)
    const { password_hash, two_factor_secret, ...userData } = user;

    return {
      token,
      user: userData
    };

  } catch (err) {
    console.error('Error logging in:', err);
    throw err;
  }
}

/**
 * Verify email
 */
async function verifyEmail(token) {
  const connection = getConnection();
  
  try {
    // Find user by verification token
    const cursor = await r.table('users')
      .filter({ email_verification_token: token })
      .limit(1)
      .run(connection);
    
    const users = await cursor.toArray();
    
    if (users.length === 0) {
      throw new Error('Invalid verification token');
    }

    const user = users[0];

    if (user.email_verified) {
      throw new Error('Email already verified');
    }

    // Update user
    await r.table('users')
      .get(user.id)
      .update({
        email_verified: true,
        email_verified_at: r.now(),
        email_verification_token: null,
        updated_at: r.now()
      })
      .run(connection);

    // Log activity
    await logActivity(connection, user.id, 'email_verified', 'Email address verified');

    return {
      message: 'Email verified successfully',
      email: user.email
    };

  } catch (err) {
    console.error('Error verifying email:', err);
    throw err;
  }
}

/**
 * Logout user
 */
async function logout(token) {
  const connection = getConnection();
  
  try {
    // Find and delete session
    const result = await r.table('user_sessions')
      .filter({ token })
      .delete()
      .run(connection);

    // Decode token to get user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Update user status
    await r.table('users')
      .get(decoded.id)
      .update({
        is_online: false
      })
      .run(connection);

    // Log activity
    await logActivity(connection, decoded.id, 'logout', 'User logged out');

    return { message: 'Logged out successfully' };

  } catch (err) {
    console.error('Error logging out:', err);
    throw err;
  }
}

/**
 * Log user activity
 */
async function logActivity(connection, userId, activityType, description, metadata = {}) {
  try {
    await r.table('user_activity_log')
      .insert({
        user_id: userId,
        activity_type: activityType,
        description,
        metadata,
        created_at: r.now()
      })
      .run(connection);
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  verifyEmail,
  logout,
  verifyToken,
  logActivity
};
