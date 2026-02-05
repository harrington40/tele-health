import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
  Avatar,
  Fade,
} from '@mui/material';
import {
  Email,
  Security,
  ArrowBack,
  Lock,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      setStep('code');
      setSuccessMessage('A 7-digit verification code has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep('success');
      setSuccessMessage('Password reset successfully! You can now login with your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError('');

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      const response = await fetch(`${apiBaseUrl}/api/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'password_reset' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setSuccessMessage('Verification code resent successfully!');
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Fade in={true} timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              <Lock sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold">
              {step === 'email' && 'Reset Password'}
              {step === 'code' && 'Enter Reset Code'}
              {step === 'success' && 'Password Reset!'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'code' && 'Enter the code and your new password'}
              {step === 'success' && 'Your password has been updated'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          {step === 'email' && (
            <Box component="form" onSubmit={handleRequestReset}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                ) : (
                  'Send Reset Code'
                )}
              </Button>
            </Box>
          )}

          {step === 'code' && (
            <Box component="form" onSubmit={handleResetPassword}>
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              >
                <Typography variant="body2">
                  📧 Check your email for a 7-digit verification code
                </Typography>
              </Alert>

              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Verification Code"
                name="code"
                autoComplete="off"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                  setCode(value);
                }}
                placeholder="Enter 7-digit code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                  '& input': {
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || code.length !== 7}
                  sx={{
                    py: 1.5,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {resendCooldown > 0 ? `${resendCooldown}s` : 'Resend'}
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => setStep('email')}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  ← Change Email
                </Button>
              </Box>
            </Box>
          )}

          {step === 'success' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                ✅
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now login with your new password.
              </Typography>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Go to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

export default ForgotPasswordPage;
