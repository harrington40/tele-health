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
import { AsYouType, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAuth } from '../contexts/AuthContext';

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

// Mock existing users for validation
const existingUsers = [
  { email: 'john.doe@example.com', phone: '+1234567890' },
  { email: 'jane.smith@example.com', phone: '+1987654321' },
  { email: 'provider@test.com', phone: '+1555123456' },
];

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

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
  const [phoneRaw, setPhoneRaw] = useState('');

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

    // Contact details smart suggestions
    if (activeStep === 2) {
      if (!formData.country) {
        suggestions.push('🌍 Select your country first for proper phone formatting');
      } else {
        const minDigits = getMinPhoneLength(formData.country.code);
        const maxDigits = getMaxPhoneDigits(formData.country.code);
        suggestions.push(`📱 ${formData.country.name}: Enter ${minDigits}-${maxDigits} digits`);
        suggestions.push('💡 Start typing your phone number - it will auto-format');
      }
      
      if (phoneRaw && formData.country) {
        const minDigits = getMinPhoneLength(formData.country.code);
        const maxDigits = getMaxPhoneDigits(formData.country.code);
        const currentLength = phoneRaw.length;
        
        if (currentLength < minDigits) {
          suggestions.push(`⚠️ Need ${minDigits - currentLength} more digit(s)`);
        } else if (currentLength > maxDigits) {
          suggestions.push(`⚠️ Too many digits (max ${maxDigits})`);
        } else {
          const phoneE164 = toE164(phoneRaw, formData.country.code);
          if (phoneE164) {
            suggestions.push('✅ Phone number format looks good!');
          } else {
            suggestions.push('⚠️ Phone number format needs correction');
          }
        }
      }
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
  }, [formData.userType, formData.password, formData.country, passwordStrength, activeStep, phoneRaw]);

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

  const formatPhone = (value: string, country: string) => {
    // formats in national style while typing
    return new AsYouType(country as any).input(value);
  };

  const toE164 = (value: string, country: string) => {
    const p = parsePhoneNumberFromString(value, country as any);
    return p?.isValid() ? p.number : null; // +2010...
  };

  const getPhonePlaceholder = (country: Country | null): string => {
    if (!country) return 'Select country first';
    
    const examples: { [key: string]: string } = {
      'US': '(555) 123-4567',
      'CA': '(555) 123-4567',
      'GB': '07123 456789',
      'FR': '06 12 34 56 78',
      'DE': '0151 23456789',
      'IT': '312 345 6789',
      'ES': '612 345 678',
      'NL': '06 12345678',
      'SE': '070 123 45 67',
      'NO': '412 34 567',
      'DK': '20 12 34 56',
      'IN': '98765 43210',
      'CN': '138 0013 8000',
      'JP': '090 1234 5678',
      'KR': '010-1234-5678',
      'BR': '(11) 91234-5678',
      'MX': '55 1234 5678',
      'ZA': '071 123 4567',
      'EG': '010 1234 5678',
      'NG': '0803 123 4567',
      'KE': '0712 345678',
      'AU': '0412 345 678',
      'NZ': '021 123 4567',
      'SG': '8123 4567',
      'MY': '012 345 6789',
      'TH': '081 234 5678',
      'VN': '091 234 5678',
      'PH': '0917 123 4567',
      'ID': '0812 3456 7890',
      'PK': '0300 1234567',
      'BD': '01712 345678',
      // African countries
      'DZ': '0551 234 567',
      'AO': '923 456 789',
      'BJ': '90 123 456',
      'BW': '71 234 567',
      'BF': '70 123 456',
      'BI': '79 123 456',
      'CV': '991 23 45',
      'CM': '67 123 45 67',
      'CF': '70 123 456',
      'TD': '66 123 456',
      'KM': '321 23 45',
      'CG': '06 123 45 67',
      'CD': '99 123 45 67',
      'DJ': '77 123 456',
      'GQ': '55 123 45 67',
      'ER': '71 234 56',
      'SZ': '76 123 456',
      'ET': '91 123 45 67',
      'GA': '06 123 456',
      'GM': '301 23 45',
      'GH': '20 123 45 67',
      'GN': '621 23 45 67',
      'GW': '951 23 45',
      'CI': '07 123 45 67',
      'LS': '50 123 456',
      'LR': '77 123 45 67',
      'LY': '91 123 45 67',
      'MG': '34 123 45 67',
      'MW': '99 123 45 67',
      'ML': '70 123 456',
      'MR': '45 123 456',
      'MU': '57 123 456',
      'MA': '612 345 678',
      'MZ': '84 123 45 67',
      'NA': '81 123 45 67',
      'NE': '90 123 456',
      'RW': '78 123 45 67',
      'ST': '981 23 45',
      'SN': '70 123 45 67',
      'SC': '2 512 345',
      'SL': '76 123 456',
      'SO': '61 234 56 78',
      'SS': '91 234 56 78',
      'SD': '91 123 45 67',
      'TZ': '71 234 56 78',
      'TG': '90 123 456',
      'TN': '20 123 456',
      'UG': '78 123 45 67',
      'ZM': '97 123 45 67',
      'ZW': '77 123 45 67',
    };
    
    return examples[country.code] || `${country.name} phone number`;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, check against mock data
    return existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    // Extract only digits
    const digitsOnly = input.replace(/\D/g, '');
    
    // Get the maximum allowed digits for this country
    const maxDigits = getMaxPhoneDigits(formData.country?.code || '');
    
    // Limit to maximum digits for the country
    const limitedDigits = digitsOnly.slice(0, maxDigits);
    
    setPhoneRaw(limitedDigits);
    
    // Smart country detection from phone number
    if (limitedDigits.length >= 3 && !formData.country) {
      const detectedCountry = detectCountryFromPhone(limitedDigits);
      if (detectedCountry) {
        setFormData(prev => ({ ...prev, country: detectedCountry }));
        setSmartSuggestions(prev => [...prev, `🌍 Auto-detected country: ${detectedCountry.name} from phone pattern`]);
      }
    }
    
    // Clear phone-related suggestions when typing
    setSmartSuggestions(prev => prev.filter(s => !s.includes('📱') && !s.includes('Phone format')));
  };

  const getMaxPhoneDigits = (countryCode: string): number => {
    // Maximum valid phone number digits for national numbers (excluding country code)
    const maxLengths: { [key: string]: number } = {
      'US': 10, 'CA': 10, 'GB': 10, 'FR': 9, 'DE': 10, 'IT': 9, 'ES': 9,
      'NL': 9, 'SE': 7, 'NO': 8, 'DK': 8, 'IN': 10, 'CN': 11, 'JP': 10,
      'KR': 10, 'BR': 10, 'MX': 10, 'ZA': 9, 'EG': 10, 'NG': 10, 'KE': 9,
      'AU': 9, 'NZ': 9, 'SG': 8, 'MY': 9, 'TH': 9, 'VN': 9, 'PH': 10,
      'ID': 10, 'PK': 10, 'BD': 10, 'GH': 9, 'TZ': 9, 'UG': 9, 'ZW': 9,
      'MA': 9, 'TN': 8, 'DZ': 9, 'LY': 9, 'AO': 9, 'MZ': 8, 'BW': 7,
      'NA': 7, 'ZM': 9
    };
    return maxLengths[countryCode] || 15; // Default maximum
  };

  const detectCountryFromPhone = (digits: string) => {
    // Common country code patterns
    const patterns = [
      { prefix: '1', country: 'US' }, // USA/Canada
      { prefix: '44', country: 'GB' }, // UK
      { prefix: '33', country: 'FR' }, // France
      { prefix: '49', country: 'DE' }, // Germany
      { prefix: '39', country: 'IT' }, // Italy
      { prefix: '34', country: 'ES' }, // Spain
      { prefix: '31', country: 'NL' }, // Netherlands
      { prefix: '46', country: 'SE' }, // Sweden
      { prefix: '47', country: 'NO' }, // Norway
      { prefix: '45', country: 'DK' }, // Denmark
      { prefix: '91', country: 'IN' }, // India
      { prefix: '86', country: 'CN' }, // China
      { prefix: '81', country: 'JP' }, // Japan
      { prefix: '82', country: 'KR' }, // South Korea
      { prefix: '55', country: 'BR' }, // Brazil
      { prefix: '52', country: 'MX' }, // Mexico
      { prefix: '27', country: 'ZA' }, // South Africa
      { prefix: '20', country: 'EG' }, // Egypt
      { prefix: '234', country: 'NG' }, // Nigeria
      { prefix: '254', country: 'KE' }, // Kenya
    ];
    
    for (const pattern of patterns) {
      if (digits.startsWith(pattern.prefix)) {
        // Import countries data to find the country object
        const countries = require('../types/countries').countries;
        return countries.find((c: Country) => c.code === pattern.country) || null;
      }
    }
    return null;
  };

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
    // Reset phone formatting when country changes
    setPhoneRaw('');
    
    // Smart suggestion for phone format
    if (country) {
      const suggestions = [`📱 Phone format: ${country.name} style (+${getCountryCallingCode(country.code as any)})`];
      setSmartSuggestions(prev => [...prev.filter(s => !s.includes('📱')), ...suggestions]);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Account Type
        return !!formData.userType;
      case 1: // Personal Info
        if (!formData.firstName || !formData.lastName || !formData.email) {
          return false;
        }
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address.');
          return false;
        }
        return true;
      case 2: // Contact Details
        if (!phoneRaw || !formData.country) return false;
        
        // Validate phone number format and length
        const phoneE164 = toE164(phoneRaw, formData.country.code);
        const minDigits = getMinPhoneLength(formData.country.code);
        const maxDigits = getMaxPhoneDigits(formData.country.code);
        
        // Check length first
        if (phoneRaw.length < minDigits) {
          setError(`Phone number too short for ${formData.country.name}. Minimum ${minDigits} digits required.`);
          return false;
        }
        
        if (phoneRaw.length > maxDigits) {
          setError(`Phone number too long for ${formData.country.name}. Maximum ${maxDigits} digits allowed.`);
          return false;
        }
        
        // Then check format validity
        if (!phoneE164) {
          setError(`Invalid phone number format for ${formData.country.name}. Please enter a valid ${minDigits}-${maxDigits} digit number.`);
          return false;
        }
        
        return true;
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

  const getMinPhoneLength = (countryCode: string): number => {
    // Minimum valid phone number digits for national numbers (excluding country code)
    const minLengths: { [key: string]: number } = {
      'US': 10, 'CA': 10, 'GB': 10, 'FR': 9, 'DE': 8, 'IT': 9, 'ES': 9,
      'NL': 9, 'SE': 7, 'NO': 8, 'DK': 8, 'IN': 8, 'CN': 8, 'JP': 9,
      'KR': 8, 'BR': 10, 'MX': 10, 'ZA': 9, 'EG': 10, 'NG': 10, 'KE': 9,
      'AU': 9, 'NZ': 8, 'SG': 8, 'MY': 7, 'TH': 9, 'VN': 8, 'PH': 10,
      'ID': 10, 'PK': 10, 'BD': 10, 'GH': 9, 'TZ': 9, 'UG': 9, 'ZW': 9,
      'MA': 9, 'TN': 8, 'DZ': 9, 'LY': 9, 'AO': 9, 'MZ': 8, 'BW': 7,
      'NA': 7, 'ZM': 9
    };
    return minLengths[countryCode] || 7; // Default minimum
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

    // Validate and format phone number
    const phoneE164 = formData.country ? toE164(phoneRaw, formData.country.code) : null;
    if (!phoneE164) {
      setError('Please enter a valid phone number.');
      return;
    }

    // Update formData with formatted phone
    setFormData(prev => ({ ...prev, phone: phoneE164 }));

    // Check if email is already registered
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setError('This email address is already registered. Please use a different email or try logging in.');
      return;
    }

    // Check if phone is already registered
    const phoneExists = existingUsers.some(user => user.phone === phoneE164);
    if (phoneExists) {
      setError('This phone number is already registered. Please use a different phone number.');
      return;
    }

    if (phoneExists) {
      setError('This phone number is already registered. Please use a different phone number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const finalFormData = { ...formData, phone: phoneE164 };
      if (onRegister) {
        await onRegister(finalFormData);
      } else {
        // Register with backend API
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
        const response = await fetch(`${apiBaseUrl}/api/auth/register/patient`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: finalFormData.email,
            password: finalFormData.password,
            first_name: finalFormData.firstName,
            last_name: finalFormData.lastName,
            phone: finalFormData.phone,
            consent_to_terms: true,
            consent_to_privacy: true,
            hipaa_consent: true
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();

        // Transform to frontend User format
        const newUser = {
          id: data.user.id,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
          phone: data.user.phone,
          userType: data.user.user_type === 'patient' ? 'client' : data.user.user_type === 'doctor' ? 'provider' : data.user.user_type,
          country: finalFormData.country ? {
            code: finalFormData.country.code,
            name: finalFormData.country.name
          } : undefined,
          profilePicture: '/api/placeholder/150/150',
          dateOfBirth: '', // Not collected in registration
          gender: '', // Not collected in registration
          address: '', // Not collected in registration
          emergencyContact: undefined, // Not collected in registration
          medicalHistory: [], // Not collected in registration
          allergies: [], // Not collected in registration
          currentMedications: [], // Not collected in registration
          insuranceInfo: undefined, // Not collected in registration
          preferences: {
            language: 'en',
            notifications: true,
            marketingEmails: false
          },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        // The cookie is set by the backend, AuthContext will load user via /me

        // Redirect based on user type
        if (finalFormData.userType === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/dashboard');
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
              error={formData.email !== '' && !validateEmail(formData.email)}
              helperText={formData.email !== '' && !validateEmail(formData.email) ? 'Please enter a valid email address' : ''}
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
              placeholder={getPhonePlaceholder(formData.country)}
              value={formData.country && phoneRaw ? formatPhone(phoneRaw, formData.country.code) : phoneRaw}
              onChange={handlePhoneChange}
              required
              sx={{ mb: 3 }}
              helperText={formData.country ? 
                `${formData.country.name} format (${getMinPhoneLength(formData.country.code)}-${getMaxPhoneDigits(formData.country.code)} digits)` : 
                "Select country first"}
              InputProps={{
                startAdornment: formData.country ? (
                  <InputAdornment position="start">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      +{getCountryCallingCode(formData.country.code as any)}
                    </Typography>
                  </InputAdornment>
                ) : null,
                endAdornment: phoneRaw && formData.country ? (
                  <InputAdornment position="end">
                    {(() => {
                      const minDigits = getMinPhoneLength(formData.country.code);
                      const maxDigits = getMaxPhoneDigits(formData.country.code);
                      const isValidLength = phoneRaw.length >= minDigits && phoneRaw.length <= maxDigits;
                      const phoneE164 = toE164(phoneRaw, formData.country.code);
                      const isValidFormat = !!phoneE164;
                      
                      if (isValidLength && isValidFormat) return <Typography variant="body2" color="success.main">✓</Typography>;
                      if (!isValidLength) return <Typography variant="body2" color="warning.main">📏</Typography>;
                      return <Typography variant="body2" color="error.main">⚠</Typography>;
                    })()}
                  </InputAdornment>
                ) : null,
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