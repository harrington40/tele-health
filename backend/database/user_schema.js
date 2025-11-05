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
