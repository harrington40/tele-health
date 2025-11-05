import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  PersonAdd,
  LocalHospital,
} from '@mui/icons-material';
import { authService } from '../services/smartAuth';

const SmartLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Smart login with automatic routing
      const { user, route } = await authService.login(email, password);
      
      // Show success message with personalized greeting
      const greeting = `Welcome back, ${user.first_name}!`;
      setSuccess(greeting);

      // Log smart routing decision
      console.log('🚀 Smart Routing:', {
        user: user.email,
        type: user.user_type,
        status: user.verification_status,
        route: route
      });

      // Navigate to the determined route after brief delay
      setTimeout(() => {
        navigate(route, { replace: true });
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (testUser: 'admin' | 'doctor' | 'patient') => {
    const credentials = {
      admin: { email: 'admin@telehealth.com', password: 'Admin123!' },
      doctor: { email: 'dr.johnson@telehealth.com', password: 'Doctor123!' },
      patient: { email: 'john.doe@example.com', password: 'Patient123!' },
    };

    setEmail(credentials[testUser].email);
    setPassword(credentials[testUser].password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LocalHospital sx={{ fontSize: 60, color: '#667eea', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Smart Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intelligent routing to your personalized dashboard
            </Typography>
          </Box>

          {/* Quick Login Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Quick Login (Demo):
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Admin"
                onClick={() => handleQuickLogin('admin')}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label="Doctor"
                onClick={() => handleQuickLogin('doctor')}
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                label="Patient"
                onClick={() => handleQuickLogin('patient')}
                color="info"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Alert Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5568d3 30%, #65408b 90%)',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                  Forgot Password?
                </Typography>
              </Link>
            </Box>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Registration Links */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/register/patient')}
                sx={{ flex: 1 }}
              >
                Patient
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<LocalHospital />}
                onClick={() => navigate('/register/doctor')}
                sx={{ flex: 1 }}
              >
                Doctor
              </Button>
            </Box>
          </Box>

          {/* Smart Routing Info */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>🧠 Smart Login Features:</strong>
              <br />
              • Automatic role detection
              <br />
              • Personalized dashboard routing
              <br />
              • Profile completion tracking
              <br />• Verification status checking
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SmartLoginPage;
