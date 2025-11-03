import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Chip,
  Avatar,
  Fade,
  Grow,
  Link as MuiLink,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Phone,
  Business,
  SmartToy,
  ArrowBack,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CountrySelector from '../components/UI/CountrySelector';
import { Country, getSmartCountrySuggestions } from '../types/countries';

interface RegisterPageProps {
  onRegister?: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: Country | null;
  userType: 'client' | 'provider';
  specialty?: string;
  licenseNumber?: string;
  agreeToTerms: boolean;
}

const steps = ['Account Type', 'Personal Info', 'Contact Details', 'Security'];

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: null,
    userType: 'client',
    specialty: '',
    licenseNumber: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [specialtySuggestions, setSpecialtySuggestions] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  // Smart specialty suggestions based on country
  useEffect(() => {
    if (formData.country && formData.userType === 'provider') {
      const countrySpecialties = formData.country.popularSpecialties || [];
      setSpecialtySuggestions(countrySpecialties);
    } else {
      setSpecialtySuggestions([]);
    }
  }, [formData.country, formData.userType]);

  // Smart registration suggestions and auto-detection
  useEffect(() => {
    const suggestions = [];
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLanguage = navigator.language;

    // Smart country detection
    const smartCountries = getSmartCountrySuggestions(userTimezone, userLanguage);
    if (smartCountries.length > 0 && !formData.country) {
      setFormData(prev => ({ ...prev, country: smartCountries[0] }));
      suggestions.push(`🌍 Auto-detected your location: ${smartCountries[0].name}`);
    }

    // User type specific suggestions
    if (formData.userType === 'provider') {
      suggestions.push('Healthcare providers: Ensure your license is current');
      suggestions.push('Specialty selection helps match you with the right patients');
    } else {
      suggestions.push('Patients: Complete profile for personalized healthcare');
      suggestions.push('Country selection enables local telemedicine options');
    }

    // Password strength feedback
    if (formData.password.length > 0) {
      if (passwordStrength < 3) {
        suggestions.push('💪 Strengthen your password for better security');
      } else {
        suggestions.push('✅ Strong password! Great security choice');
      }
    }

    // Timezone-based suggestions
    if (userTimezone.includes('America')) {
      suggestions.push('Americas user: Access to regional healthcare networks');
    } else if (userTimezone.includes('Africa')) {
      suggestions.push('Africa user: Specialized telemedicine for your region');
    }

    setSmartSuggestions(suggestions);
  }, [formData.userType, formData.password, formData.country, passwordStrength]);

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    const password = formData.password;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'agreeToTerms' ? event.target.checked : event.target.value,
    }));
    setError('');
  };

  const handleCountryChange = (country: Country) => {
    setFormData(prev => ({
      ...prev,
      country,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Account Type
        return !!formData.userType;
      case 1: // Personal Info
        return !!(formData.firstName && formData.lastName && formData.email);
      case 2: // Contact Details
        return !!(formData.phone && formData.country);
      case 3: // Security
        return !!(
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          passwordStrength >= 3 &&
          formData.agreeToTerms
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setError('Please fill in all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      setError('Please complete all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (onRegister) {
        await onRegister(formData);
      } else {
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Redirect based on user type
        if (formData.userType === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Account Type
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {t('register.accountType', 'Choose Account Type')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t('register.accountTypeDesc', 'Select whether you want to access healthcare services or provide them')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Paper
                elevation={formData.userType === 'client' ? 8 : 2}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  minWidth: 200,
                  transition: 'all 0.3s ease',
                  border: formData.userType === 'client' ? '2px solid' : '2px solid transparent',
                  borderColor: formData.userType === 'client' ? 'primary.main' : 'transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                  },
                }}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'client' }))}
              >
                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {t('register.patient', 'Patient')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('register.patientDesc', 'Book appointments and access healthcare services')}
                </Typography>
              </Paper>

              <Paper
                elevation={formData.userType === 'provider' ? 8 : 2}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  minWidth: 200,
                  transition: 'all 0.3s ease',
                  border: formData.userType === 'provider' ? '2px solid' : '2px solid transparent',
                  borderColor: formData.userType === 'provider' ? 'secondary.main' : 'transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                  },
                }}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'provider' }))}
              >
                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'secondary.main' }}>
                  <Business />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {t('register.provider', 'Healthcare Provider')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('register.providerDesc', 'Offer telemedicine services and manage patients')}
                </Typography>
              </Paper>
            </Box>
          </Box>
        );

      case 1: // Personal Info
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('register.personalInfo', 'Personal Information')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={t('register.firstName', 'First Name')}
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
              />
              <TextField
                fullWidth
                label={t('register.lastName', 'Last Name')}
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
              />
            </Box>

            <TextField
              fullWidth
              label={t('register.email', 'Email Address')}
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            {formData.userType === 'provider' && (
              <>
                <TextField
                  fullWidth
                  label={t('register.specialty', 'Medical Specialty')}
                  value={formData.specialty}
                  onChange={handleInputChange('specialty')}
                  required
                  sx={{ mb: specialtySuggestions.length > 0 ? 1 : 2 }}
                />

                {/* Specialty Suggestions */}
                {specialtySuggestions.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      💡 Popular specialties in {formData.country?.name}:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {specialtySuggestions.map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          onClick={() => setFormData(prev => ({ ...prev, specialty }))}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label={t('register.licenseNumber', 'Medical License Number')}
                  value={formData.licenseNumber}
                  onChange={handleInputChange('licenseNumber')}
                  required
                  sx={{ mb: 2 }}
                />
              </>
            )}
          </Box>
        );

      case 2: // Contact Details
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('register.contactDetails', 'Contact Details')}
            </Typography>

            <TextField
              fullWidth
              label={t('register.phone', 'Phone Number')}
              value={formData.phone}
              onChange={handleInputChange('phone')}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="body2" gutterBottom fontWeight="medium">
              {t('register.country', 'Country')}
            </Typography>
            <CountrySelector
              selectedCountry={formData.country}
              onCountryChange={handleCountryChange}
              showSmartSuggestions={true}
            />
          </Box>
        );

      case 3: // Security
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('register.security', 'Security & Password')}
            </Typography>

            <TextField
              fullWidth
              label={t('register.password', 'Password')}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              sx={{ mb: 2 }}
              InputProps={{
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  {t('register.passwordStrength', 'Password Strength')}:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: 2,
                        backgroundColor: passwordStrength >= level ? 'success.main' : 'grey.300',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {passwordStrength < 3 ? t('register.weakPassword', 'Weak') :
                   passwordStrength < 4 ? t('register.mediumPassword', 'Medium') :
                   t('register.strongPassword', 'Strong')}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              label={t('register.confirmPassword', 'Confirm Password')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              error={!!(formData.confirmPassword && formData.password !== formData.confirmPassword)}
              helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ?
                t('register.passwordMismatch', 'Passwords do not match') : ''}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange('agreeToTerms')}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  {t('register.agreeToTerms', 'I agree to the')}{' '}
                  <MuiLink href="/terms" target="_blank">
                    {t('register.termsAndConditions', 'Terms and Conditions')}
                  </MuiLink>{' '}
                  {t('register.and', 'and')}{' '}
                  <MuiLink href="/privacy" target="_blank">
                    {t('register.privacyPolicy', 'Privacy Policy')}
                  </MuiLink>
                </Typography>
              }
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Grow in={true} timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Smart AI Badge */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <Chip
              icon={<SmartToy />}
              label="AI Assisted"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Back Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/auth')}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Back to Home
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                backgroundColor: 'primary.main',
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              {t('register.createAccount', 'Create Your Account')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('register.joinCommunity', 'Join our healthcare community')}
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{t(`register.steps.${label.toLowerCase().replace(' ', '')}`, label)}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Smart Suggestions */}
          {smartSuggestions.length > 0 && (
            <Fade in={true} timeout={1000}>
              <Alert
                severity="info"
                icon={<SmartToy />}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Typography variant="body2" fontWeight="medium">
                  💡 {smartSuggestions[activeStep]}
                </Typography>
              </Alert>
            </Fade>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ minHeight: 300 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              {t('common.back', 'Back')}
            </Button>

            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                px: 4,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                t('register.createAccount', 'Create Account')
              ) : (
                t('common.next', 'Next')
              )}
            </Button>
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('register.haveAccount', 'Already have an account?')}{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                {t('auth.signIn', 'Sign In')}
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Grow>
    </Container>
  );
};

export default RegisterPage;