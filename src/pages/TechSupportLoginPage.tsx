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
  Link as MuiLink
} from '@mui/material';
import {
  Email,
  Lock,
  SupportAgent,
  Visibility,
  VisibilityOff,
  Security
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TechSupportLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyCode, resendCode } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, false);

      if (result.requiresVerification) {
        setShowVerificationInput(true);
        setVerificationEmail(result.email || formData.email);
        setError('');
      } else {
        navigate('/tech-support-dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 7) {
      setError('Please enter the 7-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await verifyCode(verificationEmail, verificationCode, 'login');
      navigate('/tech-support-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resendCode(verificationEmail, 'login');
      setResendCooldown(60);
      setError('');
      
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
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            color: 'white',
          }}
        >
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
              <SupportAgent sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold">
              Tech Support Login
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Sign in to access the support dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange('email')}
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 'auto' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
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
                'Sign In'
              )}
            </Button>

            {/* Email Verification Section */}
            {showVerificationInput && (
              <Fade in={true} timeout={600}>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      '& .MuiAlert-icon': { color: '#4caf50' }
                    }}
                  >
                    <Typography variant="body2">
                      📧 A 7-digit verification code has been sent to <strong>{verificationEmail}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
                      The code will expire in 15 minutes
                    </Typography>
                  </Alert>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="verificationCode"
                    label="Verification Code"
                    name="verificationCode"
                    autoComplete="off"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setVerificationCode(value);
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

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleVerifyCode}
                      disabled={isLoading || verificationCode.length !== 7}
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
                        'Verify Code'
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
                      {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                    </Button>
                  </Box>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      onClick={() => {
                        setShowVerificationInput(false);
                        setVerificationCode('');
                        setError('');
                      }}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      ← Back to Login
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  },
                }}
              >
                ← Back to Regular Login
              </MuiLink>
            </Box>
          </Box>

          <Alert
            severity="info"
            sx={{
              mt: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            <Typography variant="body2">
              <strong>For Tech Support Staff Only</strong>
            </Typography>
            <Typography variant="caption">
              If you're a patient or healthcare provider, please use the regular login page.
            </Typography>
          </Alert>
        </Paper>
      </Fade>
    </Container>
  );
};

export default TechSupportLoginPage;
