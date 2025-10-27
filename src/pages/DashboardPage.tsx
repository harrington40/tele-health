import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const [healthScore] = useState(85);

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

  const medications: Medication[] = [
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
          Welcome back, John! 👋
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            color: 'white',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <HealthAndSafety sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Emergency Ready
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Your emergency contacts are up to date
              </Typography>
              <Button variant="contained" color="secondary" size="small">
                Update Contacts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                              <Button size="small" variant="contained" color="primary">
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
    </Container>
  );
};

export default DashboardPage;