import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Chip,
  Avatar,
  Fade,
  Grow,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Apple,
  Fingerprint,
  SmartToy,
  Security,
  ArrowBack,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LoginPageProps {
  onLogin?: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onSocialLogin?: (provider: 'google' | 'apple') => Promise<void>;
  onBiometricLogin?: () => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onSocialLogin,
  onBiometricLogin,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Smart email suggestions and security monitoring
  useEffect(() => {
    // Simulate email domain suggestions based on common healthcare providers
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'healthcare.org', 'medical.com'];
    if (formData.email.includes('@')) {
      const [localPart, domain] = formData.email.split('@');
      if (domain && !domain.includes('.')) {
        const suggestions = commonDomains
          .filter(d => d.startsWith(domain))
          .map(d => `${localPart}@${d}`);
        setEmailSuggestions(suggestions);
      }
    } else {
      setEmailSuggestions([]);
    }
  }, [formData.email]);

  // Security monitoring
  useEffect(() => {
    if (loginAttempts >= 3) {
      setError('Multiple failed attempts detected. Please wait before trying again or reset your password.');
    }
  }, [loginAttempts]);

  // Smart login suggestions based on user behavior and context
  useEffect(() => {
    const suggestions = [];
    const currentHour = new Date().getHours();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLanguage = navigator.language;

    // Time-based suggestions
    if (currentHour < 6) {
      suggestions.push('Early bird! 🌅 Consider scheduling morning appointments');
    } else if (currentHour < 12) {
      suggestions.push('Good morning! ☀️ Start your day with health check');
    } else if (currentHour < 18) {
      suggestions.push('Good afternoon! 🌤️ Perfect time for consultations');
    } else {
      suggestions.push('Good evening! 🌙 Time for wellness routines');
    }

    // Location-based suggestions
    if (userTimezone.includes('America')) {
      suggestions.push('North/South America user detected - Local healthcare options available');
    } else if (userTimezone.includes('Africa')) {
      suggestions.push('African user detected - Specialized telemedicine services ready');
    }

    // Language-based suggestions
    if (userLanguage.startsWith('es')) {
      suggestions.push('Usuario español detectado - Servicios en español disponibles');
    } else if (userLanguage.startsWith('fr')) {
      suggestions.push('Utilisateur français détecté - Services en français disponibles');
    } else if (userLanguage.startsWith('pt')) {
      suggestions.push('Usuário português detectado - Serviços em português disponíveis');
    }

    // Security suggestions
    suggestions.push('Enable biometric login for instant access');
    suggestions.push('Use our AI-powered smart authentication');

    setSmartSuggestions(suggestions);

    // Check for biometric availability
    if (window.PublicKeyCredential) {
      setBiometricAvailable(true);
    }
  }, []);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'rememberMe' ? event.target.checked : event.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (onLogin) {
        await onLogin(formData.email, formData.password, formData.rememberMe);
      } else {
        // Mock login for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (formData.email && formData.password) {
          // Simple provider detection based on email domain
          const isProvider = formData.email.includes('doctor') ||
                           formData.email.includes('hospital') ||
                           formData.email.includes('clinic') ||
                           formData.email.includes('med') ||
                           formData.email.includes('healthcare');

          navigate(isProvider ? '/provider-dashboard' : '/dashboard');
        } else {
          throw new Error('Please fill in all fields');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      if (onSocialLogin) {
        await onSocialLogin(provider);
      } else {
        // Mock social login
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Social login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      if (onBiometricLogin) {
        await onBiometricLogin();
      } else {
        // Mock biometric login
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Grow in={true} timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
            }
          }}
        >
          {/* Smart AI Badge */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Chip
              icon={<SmartToy />}
              label="AI Smart"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Back Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/auth')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Back to Home
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
                <Security sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight="bold">
                {t('auth.welcomeBack', 'Welcome Back')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                {t('auth.signInToAccount', 'Sign in to your account')}
              </Typography>
            </Box>

            {/* Smart Suggestions */}
            {smartSuggestions.length > 0 && (
              <Fade in={true} timeout={1000}>
                <Alert
                  severity="info"
                  icon={<SmartToy />}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '& .MuiAlert-icon': { color: 'white' }
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    💡 {smartSuggestions[Math.floor(Math.random() * smartSuggestions.length)]}
                  </Typography>
                </Alert>
              </Fade>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('auth.email', 'Email Address')}
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
                    borderRadius: 2,
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
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  },
                }}
              />

              {/* Email Suggestions */}
              {emailSuggestions.length > 0 && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  {emailSuggestions.slice(0, 3).map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email: suggestion }));
                        setEmailSuggestions([]);
                      }}
                      sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('auth.password', 'Password')}
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
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
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
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={handleInputChange('rememberMe')}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {t('auth.rememberMe', 'Remember me')}
                    </Typography>
                  }
                />

                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'white',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'rgba(255,255,255,0.8)',
                    },
                  }}
                >
                  {t('auth.forgotPassword', 'Forgot password?')}
                </MuiLink>
              </Box>

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
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                ) : (
                  t('auth.signIn', 'Sign In')
                )}
              </Button>
            </Box>

            {/* Demo Provider Login Hint */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Alert
                severity="info"
                icon={<SmartToy />}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '& .MuiAlert-icon': { color: 'white' }
                }}
              >
                <Typography variant="body2">
                  💡 Demo: Use any email with "doctor", "hospital", or "clinic" to access Provider Dashboard
                </Typography>
              </Alert>
            </Box>

            {/* Biometric Login */}
            {biometricAvailable && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', px: 2 }}>
                    {t('auth.or', 'or')}
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  startIcon={<Fingerprint />}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('auth.biometricLogin', 'Biometric Login')}
                </Button>
              </Box>
            )}

            {/* Social Login */}
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', px: 2 }}>
                  {t('auth.continueWith', 'Continue with')}
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  startIcon={<Google />}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                  startIcon={<Apple />}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Apple
                </Button>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {t('auth.noAccount', "Don't have an account?")}{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    '&:hover': {
                      color: 'rgba(255,255,255,0.8)',
                    },
                  }}
                >
                  {t('auth.signUp', 'Sign up')}
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grow>
    </Container>
  );
};

export default LoginPage;