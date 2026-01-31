import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  DeviceThermostat,
  MonitorHeart,
  Scale,
  MedicalServices,
  LocalPharmacy,
  TrendingUp,
  Notifications,
  VideoCall,
  Phone,
  Assessment,
  HealthAndSafety,
  Timeline,
  SmartToy,
  Schedule,
  Person,
  Close,
  Save,
  ContactEmergency,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VideoConsultation from '../components/VideoConsultation';
import { VideoSession } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getCountryFromPhoneNumber, Country, COUNTRIES } from '../types/countries';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { authAPI } from '../services/api';

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentHistory {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  diagnosis: string;
  notes: string;
  followUp: string;
  notification?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  remaining: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [healthScore] = useState(85);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [activeVideoSession, setActiveVideoSession] = useState<VideoSession | null>(null);

  // Emergency contact form state
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');
  const [emergencyRelationship, setEmergencyRelationship] = useState(user?.emergencyContact?.relationship || '');
  const [emergencyCountry, setEmergencyCountry] = useState<Country | null>(null);
  const [emergencyProvince, setEmergencyProvince] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');

  // Update form state when dialog opens
  useEffect(() => {
    if (showEmergencyDialog && user?.emergencyContact) {
      setEmergencyName(user.emergencyContact.name);
      setEmergencyPhone(user.emergencyContact.phone);
      setEmergencyRelationship(user.emergencyContact.relationship || '');
      
      // Detect country from existing phone number
      if (user.emergencyContact.phone) {
        const detectedCountry = getCountryFromPhoneNumber(user.emergencyContact.phone);
        if (detectedCountry) {
          setEmergencyCountry(detectedCountry);
        }
        // Extract raw phone number for formatting
        const phoneObj = parsePhoneNumberFromString(user.emergencyContact.phone);
        if (phoneObj) {
          setPhoneRaw(phoneObj.nationalNumber);
        }
      }
    } else if (showEmergencyDialog) {
      // Reset form for new contact
      setEmergencyName('');
      setEmergencyPhone('');
      setEmergencyRelationship('');
      setEmergencyCountry(null);
      setEmergencyProvince('');
      setPhoneRaw('');
    }
  }, [showEmergencyDialog, user?.emergencyContact]);

  // Phone formatting functions
  const formatEmergencyPhone = (value: string) => {
    if (!emergencyCountry) return value;
    return new AsYouType(emergencyCountry.code as any).input(value);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneRaw(value.replace(/\D/g, '')); // Store raw digits only
    const formatted = formatEmergencyPhone(value);
    setEmergencyPhone(formatted);
  };

  // Auto-detect country when phone number changes
  useEffect(() => {
    if (phoneRaw && phoneRaw.length >= 3) {
      // Try to detect country from phone number
      const testNumber = `+${phoneRaw}`;
      const detectedCountry = getCountryFromPhoneNumber(testNumber);
      if (detectedCountry && (!emergencyCountry || emergencyCountry.code !== detectedCountry.code)) {
        setEmergencyCountry(detectedCountry);
        // Reformat with detected country
        const formatted = formatEmergencyPhone(phoneRaw);
        setEmergencyPhone(formatted);
      }
    }
  }, [phoneRaw, emergencyCountry]);

  // Helper function to format user's name as "J. LastName"
  const formatUserName = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return 'User';
    if (!firstName) return lastName!;
    if (!lastName) return firstName;
    
    return `${firstName.charAt(0)}. ${lastName}`;
  };

  // Helper function to get country from phone number
  const getUserCountry = (phoneNumber?: string, storedCountry?: { code: string; name: string }): string => {
    // First check if country is already stored
    if (storedCountry?.name) {
      return storedCountry.name;
    }
    
    // If not stored, try to detect from phone number
    if (phoneNumber) {
      const detectedCountry = getCountryFromPhoneNumber(phoneNumber);
      if (detectedCountry) {
        return detectedCountry.name;
      }
    }
    
    return 'Country not set';
  };

  // Mock data - in real app, this would come from API
  const healthMetrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      trend: 'stable',
      icon: <Favorite color="error" />
    },
    {
      id: '2',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      trend: 'down',
      icon: <MonitorHeart color="primary" />
    },
    {
      id: '3',
      name: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal',
      trend: 'stable',
      icon: <DeviceThermostat color="warning" />
    },
    {
      id: '4',
      name: 'Weight',
      value: '165',
      unit: 'lbs',
      status: 'warning',
      trend: 'up',
      icon: <Scale color="info" />
    }
  ];

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-10-28',
      time: '10:00 AM',
      type: 'video',
      status: 'upcoming'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practice',
      date: '2024-11-02',
      time: '2:30 PM',
      type: 'phone',
      status: 'upcoming'
    }
  ];

  const medications: Medication[] = user?.currentMedications ? 
    user.currentMedications.map((med, index) => ({
      id: (index + 1).toString(),
      name: med,
      dosage: 'As prescribed', // In real app, this would come from API
      frequency: 'As directed', // In real app, this would come from API
      nextDose: 'Check schedule', // In real app, this would come from API
      remaining: 30 // Mock data
    })) : [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: '8:00 AM',
      remaining: 15
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: '6:00 PM',
      remaining: 30
    }
  ];

  const appointmentHistory: AppointmentHistory[] = [
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-10-15',
      diagnosis: 'Hypertension - Well Controlled',
      notes: 'Blood pressure improved significantly. Continue current medication regimen.',
      followUp: '3 months',
      notification: 'Your follow-up appointment is due in 2 weeks. Please schedule at your earliest convenience.'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practice',
      date: '2024-09-28',
      diagnosis: 'Annual Physical - All Clear',
      notes: 'Excellent overall health. Recommended lifestyle maintained.',
      followUp: '1 year',
      notification: 'Time for your annual flu shot. Schedule your vaccination appointment.'
    },
    {
      id: '3',
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      date: '2024-09-10',
      diagnosis: 'Minor Skin Condition - Resolved',
      notes: 'Treatment successful. No recurrence noted.',
      followUp: 'As needed',
      notification: 'Your prescription refill is ready for pickup at your preferred pharmacy.'
    }
  ];

  // Video call handlers
  const handleJoinCall = (appointment: Appointment) => {
    // Create a mock video session for the appointment
    const mockSession: VideoSession = {
      id: `session-${appointment.id}`,
      appointmentId: parseInt(appointment.id), // Convert string to number
      doctorId: 1, // Mock doctor ID
      patientId: 1, // Mock patient ID (current user)
      roomId: `room-${appointment.id}`,
      participants: [
        {
          id: '1', // Mock doctor ID
          name: appointment.doctor,
          role: 'Doctor',
          isConnected: false,
          hasVideo: true,
          hasAudio: true,
          joinedAt: new Date().toISOString()
        },
        {
          id: '1', // Mock patient ID (current user)
          name: user ? `${user.firstName} ${user.lastName}` : 'You', // Use real user name
          role: 'Patient',
          isConnected: true,
          hasVideo: true,
          hasAudio: true,
          joinedAt: new Date().toISOString()
        }
      ],
      startTime: new Date().toISOString(),
      status: 'waiting',
      settings: {
        enableChat: true,
        enableRecording: false,
        enableScreenShare: true,
        maxDuration: 60,
        autoStartRecording: false
      }
    };

    setActiveVideoSession(mockSession);
    setShowVideoDialog(true);
  };

  const handleEndVideoCall = () => {
    setActiveVideoSession(null);
    setShowVideoDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCall />;
      case 'phone': return <Phone />;
      default: return <MedicalServices />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {formatUserName(user?.firstName, user?.lastName)}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your health dashboard powered by AI insights
        </Typography>
      </Box>

      {/* AI Health Score */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SmartToy sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      AI Health Score
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Based on your recent vitals and medical history
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  {healthScore}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={healthScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Excellent! Your health metrics are within optimal ranges. Keep up the great work!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%, #fecfef 100%)',
            color: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              '&::before': {
                transform: 'scale(1.05)',
              }
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              transition: 'transform 0.3s ease-in-out',
            }
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', p: 3 }}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <HealthAndSafety sx={{ fontSize: 32, color: 'white' }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                🚨 Emergency Ready
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, lineHeight: 1.4 }}>
                {user?.emergencyContact
                  ? `Emergency contact: ${user.emergencyContact.name}`
                  : 'No emergency contact set'
                }
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: user?.emergencyContact ? '#4caf50' : '#ff9800',
                  boxShadow: `0 0 10px ${user?.emergencyContact ? '#4caf50' : '#ff9800'}50`
                }} />
                <Typography variant="caption" sx={{ fontWeight: 'medium', opacity: 0.9 }}>
                  {user?.emergencyContact ? 'Contacts Updated' : 'Setup Required'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                onClick={() => setShowEmergencyDialog(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  px: 2,
                  py: 0.75,
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {user?.emergencyContact ? 'Update Contacts' : 'Add Emergency Contact'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Profile Summary */}
      {user && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                  {/* Profile Avatar Section */}
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Avatar
                      src={user.profilePicture}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '4px solid rgba(255,255,255,0.3)',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        fontSize: '2.5rem'
                      }}
                    >
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </Avatar>
                    <Chip
                      label="Active Patient"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-label': { fontSize: '0.75rem' }
                      }}
                    />
                  </Box>

                  {/* Main Information Section */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Chip
                        label={user.userType || 'Patient'}
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.9)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    {/* Contact Information Grid */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            📧
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                              Email Address
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            📱
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                              Phone Number
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {user.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            🌍
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                              Location
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {getUserCountry(user.phone, user.country)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            📅
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                              Member Since
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Emergency Contact */}
                    {user.emergencyContact && (
                      <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        p: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        mb: 3
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          🚨 Emergency Contact
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {user.emergencyContact.name} • {user.emergencyContact.phone}
                          {user.emergencyContact.relationship && (
                            <span style={{ opacity: 0.8 }}> ({user.emergencyContact.relationship})</span>
                          )}
                        </Typography>
                        {(user.emergencyContact.country || user.emergencyContact.province) && (
                          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                            {user.emergencyContact.country?.flag} {user.emergencyContact.country?.name}
                            {user.emergencyContact.province && ` • ${user.emergencyContact.province}`}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<Person />}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<MedicalServices />}
                        sx={{
                          color: 'white',
                          borderColor: 'rgba(255,255,255,0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderColor: 'rgba(255,255,255,0.5)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        Medical Records
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Health Metrics */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Health Metrics <Assessment sx={{ ml: 1 }} />
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              },
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  {metric.icon}
                  <Chip
                    label={metric.status}
                    color={getStatusColor(metric.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value} <Typography component="span" variant="h6" color="text.secondary">{metric.unit}</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {metric.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color={metric.trend === 'up' ? 'error' : metric.trend === 'down' ? 'success' : 'action'} />
                  <Typography variant="caption" color="text.secondary">
                    {metric.trend === 'up' ? 'Increasing' : metric.trend === 'down' ? 'Decreasing' : 'Stable'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
            },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Upcoming Appointments
                </Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/doctors')}>
                  Book New
                </Button>
              </Box>
              <List>
                {upcomingAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getAppointmentIcon(appointment.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {appointment.doctor}
                            </Typography>
                            <Chip label={appointment.specialty} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {appointment.date} at {appointment.time}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => handleJoinCall(appointment)}
                              >
                                Join Call
                              </Button>
                              <Button size="small" variant="outlined">
                                Reschedule
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Medication Tracker */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
            },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Medication Tracker
                </Typography>
                <Button variant="outlined" size="small">
                  Refill All
                </Button>
              </Box>
              <List>
                {medications.map((medication, index) => (
                  <React.Fragment key={medication.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <LocalPharmacy />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {medication.name}
                            </Typography>
                            <Chip
                              label={`${medication.remaining} left`}
                              color={medication.remaining < 7 ? 'warning' : 'success'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {medication.dosage} • {medication.frequency}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Next dose: {medication.nextDose}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="contained" color="secondary">
                                Take Now
                              </Button>
                              <Button size="small" variant="outlined">
                                Refill
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < medications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Medical Information */}
      {user && ((user.medicalHistory && user.medicalHistory.length > 0) || (user.allergies && user.allergies.length > 0)) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              },
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <HealthAndSafety sx={{ mr: 1 }} />
                  Medical History
                </Typography>
                {user.medicalHistory && user.medicalHistory.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {user.medicalHistory.map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No medical history recorded
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              },
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Notifications sx={{ mr: 1 }} />
                  Allergies & Restrictions
                </Typography>
                {user.allergies && user.allergies.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {user.allergies.map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy}
                        variant="outlined"
                        color="warning"
                        size="small"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No allergies recorded
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Appointment History with Notifications */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', mt: 4 }}>
        Recent Appointments & Notifications <Notifications sx={{ ml: 1 }} />
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {appointmentHistory.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <Card sx={{
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
              },
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {appointment.doctor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.specialty}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={appointment.date} size="small" variant="outlined" />
                </Box>

                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {appointment.diagnosis}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  {appointment.notes}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Follow-up: {appointment.followUp}
                  </Typography>
                </Box>

                {appointment.notification && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2,
                      '& .MuiAlert-icon': {
                        color: 'info.main'
                      }
                    }}
                    icon={<Notifications />}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Doctor Notification
                    </Typography>
                    <Typography variant="body2">
                      {appointment.notification}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* AI Insights */}
      <Card sx={{ 
        mt: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        },
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SmartToy sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              AI Health Insights
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Risk Assessment
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Your cardiovascular risk is low. Continue with current lifestyle habits.
                </Typography>
                <Chip label="Low Risk" color="success" size="small" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Health Trends
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Your blood pressure has improved by 5% over the last month.
                </Typography>
                <Chip label="Improving" color="success" size="small" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Recommendations
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Consider scheduling a follow-up appointment in 3 months.
                </Typography>
                <Button variant="contained" color="secondary" size="small">
                  Schedule Now
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              sx={{ 
                py: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
              onClick={() => navigate('/doctors')}
            >
              <MedicalServices />
              Find Doctor
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ 
                py: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <VideoCall />
              Emergency Call
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ 
                py: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  backgroundColor: 'action.hover',
                },
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <LocalPharmacy />
              Refill Rx
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ 
                py: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  backgroundColor: 'action.hover',
                },
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Timeline />
              Health History
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Emergency Contact Dialog */}
      <Dialog
        open={showEmergencyDialog}
        onClose={() => setShowEmergencyDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ContactEmergency sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Emergency Contact
            </Typography>
          </Box>
          <IconButton
            onClick={() => setShowEmergencyDialog(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Add or update your emergency contact information. This person will be contacted in case of medical emergencies.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.1)',
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
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: 'white',
                },
              }}>
                Country
              </InputLabel>
              <Select
                value={emergencyCountry?.code || ''}
                onChange={(e) => {
                  const selectedCountry = COUNTRIES.find(c => c.code === e.target.value);
                  setEmergencyCountry(selectedCountry || null);
                  // Reformat phone with new country
                  if (phoneRaw) {
                    const formatted = formatEmergencyPhone(phoneRaw);
                    setEmergencyPhone(formatted);
                  }
                }}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <span style={{ opacity: 0.6 }}>(+{country.callingCode})</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={emergencyPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={emergencyCountry ? `+${emergencyCountry.callingCode} XXX XXX XXX` : "Select country first"}
              disabled={!emergencyCountry}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.1)',
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
                  '&.Mui-disabled': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  '&.Mui-disabled': {
                    color: 'rgba(255,255,255,0.5)',
                    WebkitTextFillColor: 'rgba(255,255,255,0.5)',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Province/State"
              variant="outlined"
              value={emergencyProvince}
              onChange={(e) => setEmergencyProvince(e.target.value)}
              placeholder="Enter province or state"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.1)',
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
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: 'white',
                },
              }}>
                Relationship
              </InputLabel>
              <Select
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              >
                <MenuItem value="Spouse">Spouse</MenuItem>
                <MenuItem value="Parent">Parent</MenuItem>
                <MenuItem value="Child">Child</MenuItem>
                <MenuItem value="Sibling">Sibling</MenuItem>
                <MenuItem value="Friend">Friend</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowEmergencyDialog(false)}
                sx={{
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  // Validate required fields
                  if (!emergencyName.trim() || !emergencyPhone.trim() || !emergencyCountry) {
                    alert('Please fill in all required fields');
                    return;
                  }

                  // Check if user is authenticated
                  if (!user) {
                    alert('You must be logged in to save emergency contacts');
                    return;
                  }

                  try {
                    // Convert to E164 format for storage
                    const phoneE164 = parsePhoneNumberFromString(emergencyPhone, emergencyCountry.code as any);
                    const finalPhone = phoneE164?.isValid() ? phoneE164.number : emergencyPhone;

                    const emergencyContactData = {
                      name: emergencyName.trim(),
                      phone: finalPhone,
                      relationship: emergencyRelationship,
                      country: emergencyCountry,
                      province: emergencyProvince.trim() || undefined,
                    };

                    // Save to backend API
                    const response = await authAPI.updateEmergencyContact(emergencyContactData);

                    // Update user context with new emergency contact
                    updateUser({
                      emergencyContact: response.emergencyContact
                    });

                    // Close dialog and show success message
                    setShowEmergencyDialog(false);
                    alert('Emergency contact updated successfully!');

                  } catch (error: any) {
                    console.error('Failed to save emergency contact:', error);
                    console.error('Error details:', error.response?.data || error.message);
                    
                    // More specific error messages
                    if (error.response?.status === 401) {
                      alert('Authentication required. Please log in again.');
                    } else if (error.response?.status === 400) {
                      alert('Invalid data provided. Please check all fields.');
                    } else if (error.response?.status === 404) {
                      alert('Service not available. Please try again later.');
                    } else {
                      alert('Failed to save emergency contact. Please try again.');
                    }
                  }
                }}
                startIcon={<Save />}
                sx={{
                  flex: 1,
                  bgcolor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 1)',
                  }
                }}
              >
                Save Contact
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Video Consultation Dialog */}
      <Dialog
        open={showVideoDialog}
        onClose={handleEndVideoCall}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none', margin: 0 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {activeVideoSession && (
            <VideoConsultation
              session={activeVideoSession}
              onEndCall={handleEndVideoCall}
              onUpdateSession={(session) => setActiveVideoSession(session)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;