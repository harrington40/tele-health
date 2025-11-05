import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  CalendarToday,
  MedicalServices,
  Assignment,
  Favorite,
  Person,
  Edit,
  Notifications,
  VideoCall,
  LocalPharmacy,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../services/smartAuth';
import axios from 'axios';

const API_BASE_URL = 'http://207.180.247.153:8081/api';

interface PatientStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  unreadMessages: number;
  healthScore: number;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
}

interface HealthMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'alert';
  lastUpdated: string;
}

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user from smart auth
      const currentUser = authService.getUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);

      // Fetch patient-specific data
      const token = authService.getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/patient/${currentUser.id}/stats`, { headers });
      setStats(statsResponse.data.data || {
        upcomingAppointments: 2,
        activePrescriptions: 3,
        unreadMessages: 5,
        healthScore: 85
      });

      // Fetch appointments
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/patient/${currentUser.id}/appointments`, { headers });
      setAppointments(appointmentsResponse.data.data || [
        {
          id: '1',
          doctor: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          date: '2025-11-10',
          time: '10:00 AM',
          status: 'upcoming',
          type: 'video'
        },
        {
          id: '2',
          doctor: 'Dr. Michael Chen',
          specialty: 'General Practice',
          date: '2025-11-15',
          time: '2:00 PM',
          status: 'upcoming',
          type: 'in-person'
        }
      ]);

      // Fetch health metrics
      const metricsResponse = await axios.get(`${API_BASE_URL}/patient/${currentUser.id}/health-metrics`, { headers });
      setHealthMetrics(metricsResponse.data.data || [
        { name: 'Blood Pressure', value: '120/80 mmHg', status: 'good', lastUpdated: '2 days ago' },
        { name: 'Heart Rate', value: '72 bpm', status: 'good', lastUpdated: '2 days ago' },
        { name: 'Blood Sugar', value: '95 mg/dL', status: 'good', lastUpdated: '1 week ago' },
        { name: 'Weight', value: '165 lbs', status: 'warning', lastUpdated: '1 month ago' }
      ]);

      // Generate smart recommendations based on user data
      generateSmartRecommendations(currentUser, appointmentsResponse.data.data || []);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartRecommendations = (user: User, appointments: Appointment[]) => {
    const recs: string[] = [];
    const currentHour = new Date().getHours();

    // Time-based recommendations
    if (currentHour < 9) {
      recs.push('🌅 Good morning! Remember to take your morning medications');
    } else if (currentHour < 12) {
      recs.push('☀️ Stay hydrated! Aim for 8 glasses of water today');
    } else if (currentHour < 18) {
      recs.push('🏃 Perfect time for a 30-minute walk to stay active');
    } else {
      recs.push('🌙 Wind down with some light stretching before bed');
    }

    // Appointment-based recommendations
    if (appointments.length === 0) {
      recs.push('📅 It\'s been a while since your last check-up. Schedule an appointment today!');
    } else {
      const nextAppointment = appointments[0];
      const daysUntil = Math.ceil((new Date(nextAppointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 2) {
        recs.push(`🔔 Your appointment with ${nextAppointment.doctor} is in ${daysUntil} days. Prepare your questions!`);
      }
    }

    // Insurance-based recommendations
    if (user.insurance) {
      recs.push(`💼 Your insurance with ${user.insurance.provider} is active. Review your coverage benefits`);
    } else {
      recs.push('⚠️ No insurance information on file. Add your insurance details for faster booking');
    }

    // Health metrics recommendations
    recs.push('📊 Update your health metrics weekly for better health tracking');

    setRecommendations(recs);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'action' => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'alert': return 'error';
      default: return 'action';
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user.profile_picture_url}
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
              >
                {user.first_name[0]}{user.last_name[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Welcome back, {user.first_name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Patient ID: {user.id.slice(0, 8)}...
                </Typography>
                <Chip
                  label={user.email_verified ? 'Verified' : 'Pending Verification'}
                  color={user.email_verified ? 'success' : 'warning'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate('/patient/profile')}
              sx={{ mb: 1, display: 'block', ml: 'auto' }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              onClick={() => navigate('/booking')}
              sx={{ display: 'block', ml: 'auto' }}
            >
              Book Appointment
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <Alert severity="info" icon={<Notifications />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            🧠 Smart Recommendations for You
          </Typography>
          {recommendations.map((rec, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              • {rec}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.upcomingAppointments || 0}
                  </Typography>
                  <Typography variant="body2">Upcoming Appointments</Typography>
                </Box>
                <CalendarToday sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.activePrescriptions || 0}
                  </Typography>
                  <Typography variant="body2">Active Prescriptions</Typography>
                </Box>
                <LocalPharmacy sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.unreadMessages || 0}
                  </Typography>
                  <Typography variant="body2">Unread Messages</Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.healthScore || 0}%
                  </Typography>
                  <Typography variant="body2">Health Score</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Appointments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Upcoming Appointments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {appointments.map((apt) => (
                <ListItem
                  key={apt.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 2,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {apt.type === 'video' ? <VideoCall /> : <MedicalServices />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {apt.doctor} - {apt.specialty}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          📅 {new Date(apt.date).toLocaleDateString()} at {apt.time}
                        </Typography>
                        <br />
                        <Chip
                          label={apt.type === 'video' ? 'Video Call' : 'In-Person'}
                          size="small"
                          color={apt.type === 'video' ? 'primary' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </>
                    }
                  />
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                </ListItem>
              ))}
            </List>
            {appointments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No upcoming appointments
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CalendarToday />}
                  onClick={() => navigate('/booking')}
                  sx={{ mt: 2 }}
                >
                  Book Now
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Health Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Health Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {healthMetrics.map((metric, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${getStatusColor(metric.status)}.light` }}>
                      <Favorite color={getStatusColor(metric.status)} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={metric.name}
                    secondary={
                      <>
                        <Typography variant="body1" component="span" fontWeight="bold">
                          {metric.value}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Updated {metric.lastUpdated}
                        </Typography>
                      </>
                    }
                  />
                  {metric.status === 'good' ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Warning color={metric.status === 'warning' ? 'warning' : 'error'} />
                  )}
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Edit />}
              onClick={() => navigate('/patient/health-metrics')}
              sx={{ mt: 2 }}
            >
              Update Metrics
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
