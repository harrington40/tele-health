const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('./database'); // Your DB connection

/**
 * User Registration Service
 * Handles registration for Admin, Patient, and Doctor users
 */
class UserRegistrationService {
  
  /**
   * Register a new patient
   */
  async registerPatient(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      insurance
    } = data;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Missing required fields');
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert patient
    const query = `
      INSERT INTO users (
        id, user_type, email, password_hash, first_name, last_name,
        phone, date_of_birth, gender,
        address_street, address_city, address_state, address_zip, address_country,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        insurance_provider, insurance_policy_number, insurance_group_number,
        verification_status, is_active, email_verified,
        consent_to_terms, consent_to_privacy, hipaa_consent,
        consent_timestamp
      ) VALUES (?, 'patient', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', TRUE, FALSE, TRUE, TRUE, TRUE, NOW())
    `;

    const values = [
      userId,
      email,
      passwordHash,
      firstName,
      lastName,
      phone || null,
      dateOfBirth || null,
      gender || null,
      address?.street || null,
      address?.city || null,
      address?.state || null,
      address?.zip || null,
      address?.country || 'USA',
      emergencyContact?.name || null,
      emergencyContact?.phone || null,
      emergencyContact?.relationship || null,
      insurance?.provider || null,
      insurance?.policyNumber || null,
      insurance?.groupNumber || null
    ];

    await db.query(query, values);

    // Log activity
    await this.logActivity(userId, 'account_created', 'Patient account created');

    // Send verification email
    await this.sendVerificationEmail(email, userId);

    return {
      success: true,
      userId,
      message: 'Patient registered successfully. Please verify your email.'
    };
  }

  /**
   * Register a new doctor
   */
  async registerDoctor(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      specialty,
      licenseNumber,
      npiNumber,
      deaNumber,
      medicalSchool,
      graduationYear,
      yearsOfExperience,
      boardCertifications,
      languagesSpoken,
      bio,
      consultationFee
    } = data;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !specialty || !licenseNumber) {
      throw new Error('Missing required fields for doctor registration');
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert doctor
    const query = `
      INSERT INTO users (
        id, user_type, email, password_hash, first_name, last_name,
        phone, date_of_birth, gender, specialty, license_number,
        npi_number, dea_number, medical_school, graduation_year,
        years_of_experience, board_certifications, languages_spoken,
        bio, consultation_fee, verification_status, is_active,
        email_verified, is_accepting_patients,
        consent_to_terms, consent_to_privacy, hipaa_consent,
        consent_timestamp
      ) VALUES (?, 'doctor', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, NOW())
    `;

    const values = [
      userId,
      email,
      passwordHash,
      firstName,
      lastName,
      phone || null,
      dateOfBirth || null,
      gender || null,
      specialty,
      licenseNumber,
      npiNumber || null,
      deaNumber || null,
      medicalSchool || null,
      graduationYear || null,
      yearsOfExperience || 0,
      JSON.stringify(boardCertifications || []),
      JSON.stringify(languagesSpoken || ['English']),
      bio || null,
      consultationFee || 100.00
    ];

    await db.query(query, values);

    // Log activity
    await this.logActivity(userId, 'account_created', 'Doctor account created - pending verification');

    // Send verification email
    await this.sendVerificationEmail(email, userId);

    // Notify admin for verification
    await this.notifyAdminForDoctorVerification(userId);

    return {
      success: true,
      userId,
      message: 'Doctor registered successfully. Your account is pending verification.',
      nextStep: 'Please upload your credentials at /doctor/verification'
    };
  }

  /**
   * Register a new admin
   */
  async registerAdmin(data, createdBy) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      adminLevel,
      permissions
    } = data;

    // Only super_admin can create new admins
    const creator = await db.query('SELECT admin_level FROM users WHERE id = ? AND user_type = "admin"', [createdBy]);
    if (creator.length === 0 || creator[0].admin_level !== 'super_admin') {
      throw new Error('Unauthorized to create admin accounts');
    }

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Missing required fields');
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert admin
    const query = `
      INSERT INTO users (
        id, user_type, email, password_hash, first_name, last_name,
        phone, admin_level, permissions, verification_status,
        is_active, email_verified, consent_to_terms, consent_to_privacy
      ) VALUES (?, 'admin', ?, ?, ?, ?, ?, ?, ?, 'verified', TRUE, TRUE, TRUE, TRUE)
    `;

    const values = [
      userId,
      email,
      passwordHash,
      firstName,
      lastName,
      phone || null,
      adminLevel || 'support',
      JSON.stringify(permissions || [])
    ];

    await db.query(query, values);

    // Log activity
    await this.logActivity(userId, 'account_created', `Admin account created by ${createdBy}`);
    await this.logActivity(createdBy, 'admin_created', `Created admin account for ${email}`);

    return {
      success: true,
      userId,
      message: 'Admin registered successfully'
    };
  }

  /**
   * Log user activity
   */
  async logActivity(userId, activityType, description, metadata = {}) {
    const query = `
      INSERT INTO user_activity_log (user_id, activity_type, description, metadata)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(query, [userId, activityType, description, JSON.stringify(metadata)]);
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email, userId) {
    const token = uuidv4();
    const query = 'UPDATE users SET email_verification_token = ? WHERE id = ?';
    await db.query(query, [token, userId]);

    // TODO: Send email with verification link
    console.log(`Verification email sent to ${email} with token: ${token}`);
    // Email service integration here
  }

  /**
   * Notify admin for doctor verification
   */
  async notifyAdminForDoctorVerification(doctorId) {
    // TODO: Send notification to admins
    console.log(`Admin notification sent for doctor verification: ${doctorId}`);
    // Notification service integration here
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    const user = await db.query('SELECT id FROM users WHERE email_verification_token = ?', [token]);
    
    if (user.length === 0) {
      throw new Error('Invalid verification token');
    }

    const query = `
      UPDATE users 
      SET email_verified = TRUE, 
          email_verified_at = NOW(), 
          email_verification_token = NULL 
      WHERE id = ?
    `;
    await db.query(query, [user[0].id]);

    await this.logActivity(user[0].id, 'email_verified', 'Email verified successfully');

    return { success: true, message: 'Email verified successfully' };
  }
}

module.exports = new UserRegistrationService();
