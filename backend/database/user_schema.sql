// =====================================================
// TELEHEALTH USER SCHEMA - RethinkDB
// Handles: Admin, Client/Patient, Doctor
// =====================================================

const r = require('rethinkdb');

/**
 * Initialize RethinkDB tables and indexes
 */
async function setupUserSchema(connection) {
  try {
    // Create 'users' table
    await r.tableCreate('users').run(connection);
    console.log('✅ Created users table');

    // Create indexes
    await r.table('users').indexCreate('email').run(connection);
    await r.table('users').indexCreate('user_type').run(connection);
    await r.table('users').indexCreate('verification_status').run(connection);
    await r.table('users').indexCreate('specialty').run(connection);
    await r.table('users').indexCreate('is_active').run(connection);
    await r.table('users').indexCreate('created_at').run(connection);
    await r.table('users').indexCreate('email_verification_token').run(connection);
    
    // Compound indexes
    await r.table('users').indexCreate('user_type_status', [
      r.row('user_type'),
      r.row('verification_status')
    ]).run(connection);
    
    console.log('✅ Created indexes');

    // Create 'user_sessions' table
    await r.tableCreate('user_sessions').run(connection);
    await r.table('user_sessions').indexCreate('user_id').run(connection);
    await r.table('user_sessions').indexCreate('token').run(connection);
    await r.table('user_sessions').indexCreate('expires_at').run(connection);
    console.log('✅ Created user_sessions table');

    // Create 'user_activity_log' table
    await r.tableCreate('user_activity_log').run(connection);
    await r.table('user_activity_log').indexCreate('user_id').run(connection);
    await r.table('user_activity_log').indexCreate('activity_type').run(connection);
    await r.table('user_activity_log').indexCreate('created_at').run(connection);
    console.log('✅ Created user_activity_log table');

  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('⚠️  Tables already exist');
    } else {
      throw err;
    }
  }
}

/**
 * User Document Schema (for reference)
 * This is the structure of documents stored in the 'users' table
 */
const userSchema = {
  // Primary Identification (RethinkDB auto-generates 'id')
  id: 'auto-generated-uuid',
  user_type: 'admin | patient | doctor',
  
  // Authentication
  email: 'unique-email@example.com',
  password_hash: 'bcrypt-hashed-password',
  phone: '+1-555-123-4567',
  
  // Basic Profile Information
  first_name: 'John',
  last_name: 'Doe',
  date_of_birth: '1990-01-15', // ISO date string
  gender: 'male | female | other | prefer_not_to_say',
  profile_picture_url: 'https://...',
  
  // Contact Information
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA'
  },
  
  // Emergency Contact (for Patients)
  emergency_contact: {
    name: 'Jane Doe',
    phone: '+1-555-987-6543',
    relationship: 'Spouse'
  },
  
  // Medical Information (for Patients)
  blood_type: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  chronic_conditions: ['Hypertension', 'Type 2 Diabetes'],
  current_medications: [
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribed_date: '2024-01-15'
    }
  ],
  medical_history: [
    {
      condition: 'Appendicitis',
      date: '2015-03-20',
      treatment: 'Appendectomy'
    }
  ],
  
  // Insurance Information (for Patients)
  insurance: {
    provider: 'Blue Cross Blue Shield',
    policy_number: 'BC123456789',
    group_number: 'GRP123'
  },
  
  // Doctor-Specific Information
  specialty: 'Cardiology',
  license_number: 'MD12345',
  npi_number: 'NPI1234567890',
  dea_number: 'DEA123456',
  medical_school: 'Harvard Medical School',
  graduation_year: 2010,
  years_of_experience: 15,
  board_certifications: [
    'American Board of Internal Medicine',
    'American Board of Cardiovascular Disease'
  ],
  languages_spoken: ['English', 'Spanish'],
  bio: 'Board-certified cardiologist...',
  consultation_fee: 150.00,
  
  // Verification & Status
  verification_status: 'pending | verified | rejected | suspended',
  verification_documents: [
    {
      type: 'medical_license',
      url: 'https://...',
      uploaded_at: '2024-01-15T10:00:00Z'
    }
  ],
  verified_at: '2024-01-15T10:00:00Z', // ISO timestamp
  verified_by: 'admin-user-id',
  
  // Account Status
  is_active: true,
  is_online: false,
  last_login: '2024-11-04T18:00:00Z',
  
  // Availability (for Doctors)
  availability_schedule: {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '17:00' }],
    thursday: [{ start: '09:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '17:00' }],
    saturday: [],
    sunday: []
  },
  is_accepting_patients: true,
  
  // Rating & Reviews (for Doctors)
  average_rating: 4.8,
  total_reviews: 156,
  total_consultations: 500,
  
  // Admin Specific
  admin_level: 'super_admin | moderator | support',
  permissions: ['manage_users', 'verify_doctors', 'view_analytics'],
  
  // Security
  two_factor_enabled: false,
  two_factor_secret: null,
  password_reset_token: null,
  password_reset_expires: null,
  email_verification_token: 'unique-token',
  email_verified: false,
  email_verified_at: null,
  
  // Privacy & Compliance
  consent_to_terms: true,
  consent_to_privacy: true,
  hipaa_consent: true,
  consent_timestamp: '2024-01-15T10:00:00Z',
  
  // Timestamps (RethinkDB style)
  created_at: r.now(), // RethinkDB function
  updated_at: r.now(),
  deleted_at: null
};

/**
 * User Session Document Schema
 */
const sessionSchema = {
  id: 'auto-generated-uuid',
  user_id: 'user-uuid',
  token: 'jwt-token-string',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  device_info: {
    type: 'desktop | mobile | tablet',
    os: 'Windows 10',
    browser: 'Chrome'
  },
  expires_at: '2024-11-05T18:00:00Z',
  created_at: r.now()
};

/**
 * User Activity Log Document Schema
 */
const activityLogSchema = {
  id: 'auto-generated-uuid',
  user_id: 'user-uuid',
  activity_type: 'login | logout | profile_update | etc',
  description: 'User logged in from new device',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  metadata: {
    // Additional contextual data
    previous_value: 'old-value',
    new_value: 'new-value'
  },
  created_at: r.now()
};

/**
 * Insert sample data
 */
async function insertSampleData(connection) {
  const bcrypt = require('bcrypt');
  
  // Sample Admin
  const admin = {
    user_type: 'admin',
    email: 'admin@telehealth.com',
    password_hash: await bcrypt.hash('Admin123!', 10),
    first_name: 'System',
    last_name: 'Administrator',
    admin_level: 'super_admin',
    permissions: ['all'],
    verification_status: 'verified',
    is_active: true,
    email_verified: true,
    consent_to_terms: true,
    consent_to_privacy: true,
    created_at: r.now(),
    updated_at: r.now()
  };

  // Sample Doctor
  const doctor = {
    user_type: 'doctor',
    email: 'dr.johnson@telehealth.com',
    password_hash: await bcrypt.hash('Doctor123!', 10),
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '+1-555-123-4567',
    date_of_birth: '1985-03-15',
    gender: 'female',
    specialty: 'Cardiology',
    license_number: 'MD12345',
    npi_number: 'NPI1234567890',
    medical_school: 'Harvard Medical School',
    graduation_year: 2010,
    years_of_experience: 15,
    bio: 'Board-certified cardiologist with 15 years of experience in preventive cardiology and heart disease management.',
    consultation_fee: 150.00,
    verification_status: 'verified',
    is_active: true,
    email_verified: true,
    consent_to_terms: true,
    consent_to_privacy: true,
    hipaa_consent: true,
    languages_spoken: ['English', 'Spanish'],
    board_certifications: [
      'American Board of Internal Medicine',
      'American Board of Cardiovascular Disease'
    ],
    average_rating: 4.8,
    total_reviews: 156,
    total_consultations: 500,
    is_accepting_patients: true,
    availability_schedule: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '12:00' }],
      saturday: [],
      sunday: []
    },
    created_at: r.now(),
    updated_at: r.now()
  };

  // Sample Patient
  const patient = {
    user_type: 'patient',
    email: 'john.doe@example.com',
    password_hash: await bcrypt.hash('Patient123!', 10),
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1-555-987-6543',
    date_of_birth: '1990-07-20',
    gender: 'male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    emergency_contact: {
      name: 'Jane Doe',
      phone: '+1-555-111-2222',
      relationship: 'Spouse'
    },
    blood_type: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    chronic_conditions: ['Hypertension', 'Type 2 Diabetes'],
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policy_number: 'BC123456789',
      group_number: 'GRP789'
    },
    verification_status: 'verified',
    is_active: true,
    email_verified: true,
    consent_to_terms: true,
    consent_to_privacy: true,
    hipaa_consent: true,
    created_at: r.now(),
    updated_at: r.now()
  };

  try {
    await r.table('users').insert([admin, doctor, patient]).run(connection);
    console.log('✅ Sample data inserted');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

/**
 * Example queries
 */
const exampleQueries = {
  // Find user by email
  findByEmail: async (connection, email) => {
    return await r.table('users')
      .filter({ email: email })
      .run(connection);
  },

  // Find all verified doctors
  findVerifiedDoctors: async (connection) => {
    return await r.table('users')
      .filter({
        user_type: 'doctor',
        verification_status: 'verified',
        is_active: true
      })
      .run(connection);
  },

  // Find doctors by specialty
  findDoctorsBySpecialty: async (connection, specialty) => {
    return await r.table('users')
      .filter({
        user_type: 'doctor',
        specialty: specialty,
        verification_status: 'verified'
      })
      .orderBy(r.desc('average_rating'))
      .run(connection);
  },

  // Update user profile
  updateProfile: async (connection, userId, updates) => {
    return await r.table('users')
      .get(userId)
      .update({
        ...updates,
        updated_at: r.now()
      })
      .run(connection);
  },

  // Log user activity
  logActivity: async (connection, userId, activityType, description, metadata = {}) => {
    return await r.table('user_activity_log')
      .insert({
        user_id: userId,
        activity_type: activityType,
        description: description,
        metadata: metadata,
        created_at: r.now()
      })
      .run(connection);
  }
};

module.exports = {
  setupUserSchema,
  insertSampleData,
  exampleQueries,
  userSchema,
  sessionSchema,
  activityLogSchema
};

    -- Primary Identification
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_type ENUM('admin', 'patient', 'doctor') NOT NULL,
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Basic Profile Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    profile_picture_url TEXT,
    
    -- Contact Information
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    address_country VARCHAR(100) DEFAULT 'USA',
    
    -- Emergency Contact (for Patients)
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- Medical Information (for Patients)
    blood_type VARCHAR(10),
    allergies TEXT, -- JSON array of allergies
    chronic_conditions TEXT, -- JSON array of conditions
    current_medications TEXT, -- JSON array of medications
    medical_history TEXT, -- JSON array of medical history
    
    -- Insurance Information (for Patients)
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    insurance_group_number VARCHAR(100),
    
    -- Doctor-Specific Information
    specialty VARCHAR(100), -- Cardiology, Pediatrics, etc.
    license_number VARCHAR(100),
    npi_number VARCHAR(50), -- National Provider Identifier
    dea_number VARCHAR(50), -- Drug Enforcement Administration number
    medical_school VARCHAR(255),
    graduation_year INT,
    years_of_experience INT,
    board_certifications TEXT, -- JSON array of certifications
    languages_spoken TEXT, -- JSON array of languages
    bio TEXT,
    consultation_fee DECIMAL(10, 2),
    
    -- Verification & Status
    verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'pending',
    verification_documents TEXT, -- JSON array of document URLs
    verified_at TIMESTAMP NULL,
    verified_by VARCHAR(36), -- admin user_id who verified
    
    -- Account Status
    is_active BOOLEAN DEFAULT TRUE,
    is_online BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    
    -- Availability (for Doctors)
    availability_schedule TEXT, -- JSON object with weekly schedule
    is_accepting_patients BOOLEAN DEFAULT TRUE,
    
    -- Rating & Reviews (for Doctors)
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_consultations INT DEFAULT 0,
    
    -- Admin Specific
    admin_level ENUM('super_admin', 'moderator', 'support') NULL,
    permissions TEXT, -- JSON array of permissions
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    email_verification_token VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    
    -- Privacy & Compliance
    consent_to_terms BOOLEAN DEFAULT FALSE,
    consent_to_privacy BOOLEAN DEFAULT FALSE,
    hipaa_consent BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_verification_status (verification_status),
    INDEX idx_specialty (specialty),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- USER SESSIONS TABLE
-- Track active sessions for security
-- =====================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(512) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- USER ACTIVITY LOG
-- Track important user actions
-- =====================================================

CREATE TABLE IF NOT EXISTS user_activity_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- login, logout, profile_update, etc.
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata TEXT, -- JSON object with additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Super Admin
INSERT INTO users (
    user_type, email, password_hash, first_name, last_name,
    admin_level, permissions, verification_status, is_active,
    email_verified, consent_to_terms, consent_to_privacy
) VALUES (
    'admin',
    'admin@telehealth.com',
    '$2b$10$example_hash_here', -- Should be bcrypt hashed
    'System',
    'Administrator',
    'super_admin',
    '["all"]',
    'verified',
    TRUE,
    TRUE,
    TRUE,
    TRUE
);

-- Insert Sample Doctor
INSERT INTO users (
    user_type, email, password_hash, first_name, last_name,
    phone, date_of_birth, gender, specialty, license_number,
    npi_number, medical_school, graduation_year, years_of_experience,
    bio, consultation_fee, verification_status, is_active,
    email_verified, consent_to_terms, consent_to_privacy, hipaa_consent,
    languages_spoken, board_certifications, average_rating, total_reviews
) VALUES (
    'doctor',
    'dr.johnson@telehealth.com',
    '$2b$10$example_hash_here',
    'Sarah',
    'Johnson',
    '555-123-4567',
    '1985-03-15',
    'female',
    'Cardiology',
    'MD12345',
    'NPI1234567890',
    'Harvard Medical School',
    2010,
    15,
    'Board-certified cardiologist with 15 years of experience in preventive cardiology and heart disease management.',
    150.00,
    'verified',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    '["English", "Spanish"]',
    '["American Board of Internal Medicine", "American Board of Cardiovascular Disease"]',
    4.8,
    156
);

-- Insert Sample Patient
INSERT INTO users (
    user_type, email, password_hash, first_name, last_name,
    phone, date_of_birth, gender, address_street, address_city,
    address_state, address_zip, emergency_contact_name,
    emergency_contact_phone, emergency_contact_relationship,
    blood_type, allergies, chronic_conditions, insurance_provider,
    insurance_policy_number, verification_status, is_active,
    email_verified, consent_to_terms, consent_to_privacy, hipaa_consent
) VALUES (
    'patient',
    'john.doe@example.com',
    '$2b$10$example_hash_here',
    'John',
    'Doe',
    '555-987-6543',
    '1990-07-20',
    'male',
    '123 Main St',
    'New York',
    'NY',
    '10001',
    'Jane Doe',
    '555-111-2222',
    'Spouse',
    'O+',
    '["Penicillin", "Peanuts"]',
    '["Hypertension", "Type 2 Diabetes"]',
    'Blue Cross Blue Shield',
    'BC123456789',
    'verified',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
);
