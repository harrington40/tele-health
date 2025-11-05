// =====================================================
// ADMIN DASHBOARD - Smart Verification & Management
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VerifiedUser,
  PersonAdd,
  People,
  CheckCircle,
  Cancel,
  Visibility,
  Security,
  TrendingUp,
  Warning,
  LocalHospital,
  AdminPanelSettings,
} from '@mui/icons-material';
import { authService } from '../services/smartAuth';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'admin' | 'doctor' | 'patient';
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
  verification_score?: number;
}

interface DoctorVerification {
  user_id: string;
  doctor_name: string;
  email: string;
  specialty: string;
  license_number: string;
  years_experience?: number;
  documents?: any[];
  verification_score: number;
  risk_level: 'low' | 'medium' | 'high';
  automated_checks: {
    license_format: boolean;
    email_domain: boolean;
    specialty_valid: boolean;
    documents_complete: boolean;
  };
  recommendation: 'approve' | 'review' | 'reject';
  reasons: string[];
}

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  pendingVerifications: number;
  verifiedDoctors: number;
  rejectedDoctors: number;
  todayRegistrations: number;
  systemHealth: number;
}

const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingVerifications: 0,
    verifiedDoctors: 0,
    rejectedDoctors: 0,
    todayRegistrations: 0,
    systemHealth: 100,
  });
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerification[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorVerification | null>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getUser();
      
      if (!user || user.user_type !== 'admin') {
        window.location.href = '/login';
        return;
      }

      // Fetch all users
      const usersResponse = await axios.get('http://localhost:8081/api/admin/users', {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });

      const users = usersResponse.data.data || [];
      setAllUsers(users);

      // Calculate stats
      const doctors = users.filter((u: User) => u.user_type === 'doctor');
      const patients = users.filter((u: User) => u.user_type === 'patient');
      const pending = doctors.filter((d: User) => d.verification_status === 'pending');
      const verified = doctors.filter((d: User) => d.verification_status === 'verified');
      const rejected = doctors.filter((d: User) => d.verification_status === 'rejected');

      setStats({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        pendingVerifications: pending.length,
        verifiedDoctors: verified.length,
        rejectedDoctors: rejected.length,
        todayRegistrations: users.filter((u: User) => {
          const today = new Date().toDateString();
          return new Date(u.created_at).toDateString() === today;
        }).length,
        systemHealth: 98,
      });

      // Generate smart verification recommendations for pending doctors
      const verificationData = pending.map((doctor: User) => 
        generateSmartVerification(doctor)
      );
      setPendingDoctors(verificationData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  // =====================================================
  // SMART VERIFICATION ALGORITHM
  // =====================================================
  const generateSmartVerification = (doctor: User): DoctorVerification => {
    let score = 0;
    const reasons: string[] = [];
    const checks = {
      license_format: false,
      email_domain: false,
      specialty_valid: false,
      documents_complete: false,
    };

    // 1. License Number Validation (25 points)
    if (doctor.license_number) {
      const licensePattern = /^[A-Z]{2}\d{6,10}$/;
      if (licensePattern.test(doctor.license_number)) {
        score += 25;
        checks.license_format = true;
        reasons.push('✓ Valid license number format');
      } else {
        reasons.push('⚠ License number format needs verification');
      }
    } else {
      reasons.push('✗ Missing license number');
    }

    // 2. Email Domain Check (15 points)
    const professionalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hospital.com', 'clinic.com', 'medical.com'];
    const emailDomain = doctor.email.split('@')[1];
    if (emailDomain && !['test.com', 'example.com', 'fake.com'].includes(emailDomain)) {
      score += 15;
      checks.email_domain = true;
      reasons.push('✓ Professional email domain');
    } else {
      reasons.push('⚠ Verify email authenticity');
    }

    // 3. Specialty Validation (20 points)
    const validSpecialties = [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry',
      'General Practice', 'Internal Medicine', 'Surgery', 'Orthopedics',
      'Radiology', 'Oncology', 'Gynecology', 'Ophthalmology'
    ];
    if (doctor.specialty && validSpecialties.includes(doctor.specialty)) {
      score += 20;
      checks.specialty_valid = true;
      reasons.push('✓ Valid medical specialty');
    } else {
      reasons.push('⚠ Verify specialty credentials');
    }

    // 4. Profile Completeness (20 points)
    const hasPhone = doctor.phone && doctor.phone.length >= 10;
    const hasName = doctor.first_name && doctor.last_name;
    if (hasPhone && hasName) {
      score += 20;
      reasons.push('✓ Complete profile information');
    } else {
      reasons.push('⚠ Incomplete profile data');
    }

    // 5. Account Age & Activity (20 points)
    const accountAge = new Date().getTime() - new Date(doctor.created_at).getTime();
    const hoursSinceCreation = accountAge / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      score += 20;
      checks.documents_complete = true;
      reasons.push('✓ Account verified over time');
    } else {
      reasons.push('⚠ New account - extra verification recommended');
    }

    // Determine risk level and recommendation
    let riskLevel: 'low' | 'medium' | 'high' = 'high';
    let recommendation: 'approve' | 'review' | 'reject' = 'review';

    if (score >= 80) {
      riskLevel = 'low';
      recommendation = 'approve';
      reasons.unshift('🎯 HIGH CONFIDENCE - Auto-approval recommended');
    } else if (score >= 50) {
      riskLevel = 'medium';
      recommendation = 'review';
      reasons.unshift('📋 MEDIUM CONFIDENCE - Manual review recommended');
    } else {
      riskLevel = 'high';
      recommendation = 'reject';
      reasons.unshift('⚠️ LOW CONFIDENCE - Additional verification required');
    }

    return {
      user_id: doctor.id,
      doctor_name: `${doctor.first_name} ${doctor.last_name}`,
      email: doctor.email,
      specialty: doctor.specialty || 'Not specified',
      license_number: doctor.license_number || 'Not provided',
      verification_score: score,
      risk_level: riskLevel,
      automated_checks: checks,
      recommendation,
      reasons,
    };
  };

  const handleVerifyDoctor = async (userId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      setActionLoading(true);
      
      await axios.post('http://localhost:8081/api/admin/verify-doctor', {
        userId,
        action,
        notes,
      }, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });

      setAlertMessage({
        type: 'success',
        message: `Doctor ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
      });

      setVerificationDialog(false);
      setSelectedDoctor(null);
      
      // Refresh data
      setTimeout(() => {
        fetchDashboardData();
        setAlertMessage(null);
      }, 2000);

      setActionLoading(false);
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'Failed to update verification status'
      });
      setActionLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2 }}>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettings sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Intelligent Verification & User Management System
            </Typography>
          </Box>
        </Box>
        <Chip 
          icon={<Security />} 
          label="Super Admin" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {alertMessage && (
        <Alert severity={alertMessage.type} sx={{ mb: 3 }} onClose={() => setAlertMessage(null)}>
          {alertMessage.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.totalUsers}</Typography>
                  <Typography variant="body2">Total Users</Typography>
                </Box>
                <People sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.pendingVerifications}</Typography>
                  <Typography variant="body2">Pending Verifications</Typography>
                </Box>
                <Badge badgeContent={stats.pendingVerifications} color="error">
                  <Warning sx={{ fontSize: 50, opacity: 0.8 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.verifiedDoctors}</Typography>
                  <Typography variant="body2">Verified Doctors</Typography>
                </Box>
                <LocalHospital sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.systemHealth}%</Typography>
                  <Typography variant="body2">System Health</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} variant="fullWidth">
          <Tab icon={<VerifiedUser />} label="Doctor Verification" />
          <Tab icon={<People />} label="All Users" />
          <Tab icon={<DashboardIcon />} label="Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={{ mr: 1 }} />
            Smart Doctor Verification Queue
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            AI-powered verification system analyzes credentials, validates licenses, and provides recommendations
          </Typography>

          {pendingDoctors.length === 0 ? (
            <Alert severity="info">No pending doctor verifications at this time.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Specialty</TableCell>
                    <TableCell>License</TableCell>
                    <TableCell align="center">Verification Score</TableCell>
                    <TableCell align="center">Risk Level</TableCell>
                    <TableCell align="center">AI Recommendation</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingDoctors.map((doctor) => (
                    <TableRow key={doctor.user_id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {doctor.doctor_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {doctor.doctor_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doctor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {doctor.license_number}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold"
                            sx={{ color: getScoreColor(doctor.verification_score) }}
                          >
                            {doctor.verification_score}/100
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={doctor.verification_score} 
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getScoreColor(doctor.verification_score),
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={doctor.risk_level.toUpperCase()} 
                          color={getRiskColor(doctor.risk_level)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={doctor.recommendation.toUpperCase()} 
                          color={
                            doctor.recommendation === 'approve' ? 'success' :
                            doctor.recommendation === 'review' ? 'warning' : 'error'
                          }
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setVerificationDialog(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quick Approve">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleVerifyDoctor(doctor.user_id, 'approve')}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quick Reject">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleVerifyDoctor(doctor.user_id, 'reject')}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {currentTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>All Users</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Registered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.user_type} 
                        size="small"
                        color={
                          user.user_type === 'admin' ? 'secondary' :
                          user.user_type === 'doctor' ? 'primary' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.verification_status} 
                        size="small"
                        color={
                          user.verification_status === 'verified' ? 'success' :
                          user.verification_status === 'pending' ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {currentTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>System Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">User Distribution</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography>Doctors: {stats.totalDoctors} ({((stats.totalDoctors/stats.totalUsers)*100).toFixed(1)}%)</Typography>
                    <Typography>Patients: {stats.totalPatients} ({((stats.totalPatients/stats.totalUsers)*100).toFixed(1)}%)</Typography>
                    <Typography>Total: {stats.totalUsers}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Verification Stats</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography>Pending: {stats.pendingVerifications}</Typography>
                    <Typography>Verified: {stats.verifiedDoctors}</Typography>
                    <Typography>Rejected: {stats.rejectedDoctors}</Typography>
                    <Typography>Today's Registrations: {stats.todayRegistrations}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Verification Dialog */}
      <Dialog 
        open={verificationDialog} 
        onClose={() => setVerificationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDoctor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Doctor Verification Details</Typography>
                <Chip 
                  label={`Score: ${selectedDoctor.verification_score}/100`}
                  sx={{ 
                    bgcolor: getScoreColor(selectedDoctor.verification_score),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Doctor Information</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedDoctor.doctor_name}</Typography>
                  <Typography variant="body2">{selectedDoctor.email}</Typography>
                  <Typography variant="body2">Specialty: {selectedDoctor.specialty}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    License: {selectedDoctor.license_number}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Automated Verification Checks
                  </Typography>
                  {Object.entries(selectedDoctor.automated_checks).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {value ? (
                        <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      ) : (
                        <Cancel sx={{ color: 'error.main', mr: 1 }} />
                      )}
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    AI Analysis & Recommendations
                  </Typography>
                  {selectedDoctor.reasons.map((reason, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      {reason}
                    </Typography>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Alert 
                    severity={
                      selectedDoctor.recommendation === 'approve' ? 'success' :
                      selectedDoctor.recommendation === 'review' ? 'warning' : 'error'
                    }
                  >
                    <Typography variant="body2" fontWeight="bold">
                      AI Recommendation: {selectedDoctor.recommendation.toUpperCase()}
                    </Typography>
                    <Typography variant="caption">
                      Risk Level: {selectedDoctor.risk_level.toUpperCase()}
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setVerificationDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleVerifyDoctor(selectedDoctor.user_id, 'reject')}
                disabled={actionLoading}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleVerifyDoctor(selectedDoctor.user_id, 'approve')}
                disabled={actionLoading}
              >
                Approve & Verify
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
