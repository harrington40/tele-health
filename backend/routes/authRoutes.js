// =====================================================
// Authentication Routes
// =====================================================

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

/**
 * POST /api/auth/register/patient
 * Register a new patient
 */
router.post('/register/patient', async (req, res) => {
  try {
    const result = await authService.registerPatient(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully. Please check your email to verify your account.',
      data: {
        id: result.id,
        email: result.email,
        user_type: result.user_type
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /api/auth/register/doctor
 * Register a new doctor
 */
router.post('/register/doctor', async (req, res) => {
  try {
    const result = await authService.registerDoctor(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted. Your account is pending verification. Please check your email.',
      data: {
        id: result.id,
        email: result.email,
        user_type: result.user_type,
        verification_status: result.verification_status
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    const result = await authService.login(email, password, ipAddress, userAgent);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const result = await authService.verifyEmail(token);
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: { email: result.email }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const result = await authService.logout(token);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = authService.verifyToken(token);
    
    // Get user from database
    const { r, getConnection } = require('../database/connection');
    const connection = getConnection();
    
    const user = await r.table('users').get(decoded.id).run(connection);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    const { password_hash, two_factor_secret, ...userData } = user;
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /api/auth/register/admin
 * Register a new admin (requires super_admin)
 * @access  Private (Super Admin only)
 */
router.post('/register/admin', async (req, res) => {
  try {
    const result = await authService.registerAdmin(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const result = await userRegistrationService.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  // Login implementation here
  res.json({ message: 'Login endpoint' });
});

module.exports = router;
