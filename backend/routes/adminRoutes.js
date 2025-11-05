// =====================================================
// Admin Routes - Secure User Management & Verification
// =====================================================

const express = require('express');
const router = express.Router();
const { r, getConnection } = require('../database/connection');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// =====================================================
// SECURITY MIDDLEWARE - Admin Only
// =====================================================
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const connection = getConnection();
    const cursor = await r.table('users')
      .get(decoded.id)
      .run(connection);
    
    const user = cursor;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is admin
    if (user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Check if admin account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Attach user to request
    req.user = user;
    
    // Log admin activity
    logAdminActivity(user.id, req.method, req.originalUrl, req.ip);
    
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// =====================================================
// ACTIVITY LOGGING
// =====================================================
async function logAdminActivity(adminId, action, resource, ipAddress) {
  try {
    const connection = getConnection();
    await r.table('admin_activity_logs').insert({
      admin_id: adminId,
      action,
      resource,
      ip_address: ipAddress,
      timestamp: new Date(),
    }).run(connection);
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
}

// =====================================================
// GET ALL USERS
// =====================================================
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    const cursor = await r.table('users')
      .orderBy(r.desc('created_at'))
      .run(connection);
    
    const users = await cursor.toArray();
    
    // Remove sensitive data
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      verification_status: user.verification_status,
      email_verified: user.email_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      last_login: user.last_login,
      phone: user.phone,
      specialty: user.specialty,
      license_number: user.license_number,
    }));

    res.json({
      success: true,
      data: sanitizedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// =====================================================
// VERIFY DOCTOR - Smart Approval/Rejection
// =====================================================
router.post('/verify-doctor', requireAdmin, async (req, res) => {
  try {
    const { userId, action, notes } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: 'userId and action are required'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "approve" or "reject"'
      });
    }

    const connection = getConnection();
    
    // Get doctor details
    const doctor = await r.table('users').get(userId).run(connection);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (doctor.user_type !== 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'User is not a doctor'
      });
    }

    // Update verification status
    const verification_status = action === 'approve' ? 'verified' : 'rejected';
    
    const updateData = {
      verification_status,
      verified_at: new Date(),
      verified_by: req.user.id,
      verification_notes: notes || '',
    };

    // If approved, activate accepting patients
    if (action === 'approve') {
      updateData.is_accepting_patients = true;
    }

    await r.table('users')
      .get(userId)
      .update(updateData)
      .run(connection);

    // Create verification history record
    await r.table('verification_history').insert({
      user_id: userId,
      admin_id: req.user.id,
      action: verification_status,
      notes: notes || '',
      timestamp: new Date(),
    }).run(connection);

    // Send notification email (implement email service)
    // await sendVerificationEmail(doctor.email, action);

    res.json({
      success: true,
      message: `Doctor ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      data: {
        userId,
        verification_status
      }
    });
  } catch (error) {
    console.error('Error verifying doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status'
    });
  }
});

// =====================================================
// GET PENDING DOCTOR VERIFICATIONS
// =====================================================
router.get('/pending-doctors', requireAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    const cursor = await r.table('users')
      .filter({
        user_type: 'doctor',
        verification_status: 'pending'
      })
      .orderBy('created_at')
      .run(connection);
    
    const pendingDoctors = await cursor.toArray();

    res.json({
      success: true,
      data: pendingDoctors,
      count: pendingDoctors.length
    });
  } catch (error) {
    console.error('Error fetching pending doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending doctors'
    });
  }
});

// =====================================================
// GET DASHBOARD STATISTICS
// =====================================================
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get all users
    const usersCursor = await r.table('users').run(connection);
    const users = await usersCursor.toArray();
    
    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      totalDoctors: users.filter(u => u.user_type === 'doctor').length,
      totalPatients: users.filter(u => u.user_type === 'patient').length,
      pendingVerifications: users.filter(u => 
        u.user_type === 'doctor' && u.verification_status === 'pending'
      ).length,
      verifiedDoctors: users.filter(u => 
        u.user_type === 'doctor' && u.verification_status === 'verified'
      ).length,
      rejectedDoctors: users.filter(u => 
        u.user_type === 'doctor' && u.verification_status === 'rejected'
      ).length,
      activeUsers: users.filter(u => u.is_active).length,
      inactiveUsers: users.filter(u => !u.is_active).length,
      todayRegistrations: users.filter(u => {
        const today = new Date();
        const userDate = new Date(u.created_at);
        return userDate.toDateString() === today.toDateString();
      }).length,
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// =====================================================
// DEACTIVATE/ACTIVATE USER
// =====================================================
router.post('/toggle-user-status', requireAdmin, async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const connection = getConnection();
    
    // Prevent admin from deactivating themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    await r.table('users')
      .get(userId)
      .update({ 
        is_active: isActive,
        updated_at: new Date()
      })
      .run(connection);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// =====================================================
// GET ADMIN ACTIVITY LOGS
// =====================================================
router.get('/activity-logs', requireAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    const limit = parseInt(req.query.limit) || 50;
    
    const cursor = await r.table('admin_activity_logs')
      .orderBy(r.desc('timestamp'))
      .limit(limit)
      .run(connection);
    
    const logs = await cursor.toArray();

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: true,
      data: []
    });
  }
});

// =====================================================
// UPDATE USER DETAILS (Admin Override)
// =====================================================
router.put('/user/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.password_hash;
    delete updates.created_at;
    
    updates.updated_at = new Date();
    updates.updated_by = req.user.id;

    const connection = getConnection();
    
    await r.table('users')
      .get(userId)
      .update(updates)
      .run(connection);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

module.exports = router;
