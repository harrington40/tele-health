import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Badge,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Fab,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  VideoCall,
  Phone,
  Schedule,
  Notifications,
  People,
  AccessTime,
  CheckCircle,
  Cancel,
  PlayArrow,
  Pause,
  SkipNext,
  Message,
  Assessment,
  TrendingUp,
  LocalHospital,
  Call,
  Chat,
  Settings,
  ExitToApp,
  SmartToy,
  Timer,
  Queue,
  PersonAdd,
  EventNote,
  Send
} from '@mui/icons-material';
import VideoConsultation from '../components/VideoConsultation';
import MessagingSystem from '../components/MessagingSystem';
import { VideoSession, QueueEntry } from '../types';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  appointmentTime: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  lastVisit?: string;
  notes?: string;
}

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  duration: number;
  notes?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderHours: number;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: false,
    reminderHours: 24,
  });

  // Video and chat state
  const [activeVideoSession, setActiveVideoSession] = useState<VideoSession | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatParticipant, setSelectedChatParticipant] = useState<number | null>(null);

  // Mock data - in real app, this would come from API
  const [waitingRoom, setWaitingRoom] = useState<Patient[]>([
    {
      id: 1,
      name: 'Maria Garcia',
      age: 34,
      condition: 'Routine Checkup',
      appointmentTime: '09:00',
      status: 'waiting',
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-20',
      notes: 'Follow-up on blood pressure medication',
    },
    {
      id: 2,
      name: 'John Smith',
      age: 45,
      condition: 'Cardiac Consultation',
      appointmentTime: '09:30',
      status: 'waiting',
      priority: 'high',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-15',
      notes: 'Chest pain evaluation',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      age: 28,
      condition: 'Mental Health Session',
      appointmentTime: '10:00',
      status: 'waiting',
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-25',
      notes: 'Anxiety management follow-up',
    },
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: 'Maria Garcia',
      time: '09:00 AM',
      type: 'video',
      status: 'scheduled',
      duration: 30,
      notes: 'Routine checkup',
    },
    {
      id: 2,
      patientName: 'John Smith',
      time: '09:30 AM',
      type: 'video',
      status: 'confirmed',
      duration: 45,
      notes: 'Cardiac consultation',
    },
    {
      id: 3,
      patientName: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'phone',
      status: 'scheduled',
      duration: 50,
      notes: 'Mental health session',
    },
    {
      id: 4,
      patientName: 'Robert Brown',
      time: '11:00 AM',
      type: 'video',
      status: 'scheduled',
      duration: 30,
      notes: 'Follow-up appointment',
    },
  ]);

  // Smart algorithm: Auto-sort waiting room by priority and time
  const sortedWaitingRoom = React.useMemo(() => {
    return [...waitingRoom].sort((a, b) => {
      // Priority sorting: urgent > high > medium > low
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by appointment time
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });
  }, [waitingRoom]);

  // Smart algorithm: Calculate provider efficiency metrics
  const efficiencyMetrics = React.useMemo(() => {
    const totalAppointments = upcomingAppointments.length;
    const completedToday = upcomingAppointments.filter(apt => apt.status === 'completed').length;
    const averageDuration = upcomingAppointments.reduce((sum, apt) => sum + apt.duration, 0) / totalAppointments;
    const onTimeRate = 85; // Mock percentage

    return {
      totalAppointments,
      completedToday,
      averageDuration: Math.round(averageDuration),
      onTimeRate,
      efficiency: Math.round((completedToday / totalAppointments) * 100),
    };
  }, [upcomingAppointments]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleStartConsultation = (patient: Patient) => {
    // Update patient status
    setWaitingRoom(prev =>
      prev.map(p =>
        p.id === patient.id
          ? { ...p, status: 'in-consultation' as const }
          : p
      )
    );

    // Navigate to consultation room
    navigate(`/consultation/${patient.id}`);
  };

  const handleCompleteConsultation = (patientId: number) => {
    setWaitingRoom(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, status: 'completed' as const }
          : p
      )
    );
  };

  const handleSendNotification = (patient: Patient) => {
    setSelectedPatient(patient);
    setNotificationDialog(true);
  };

  const handleNotificationSubmit = () => {
    // Mock notification sending
    console.log('Sending notification to:', selectedPatient?.name);
    setNotificationDialog(false);
    setSelectedPatient(null);
  };

  // Video and chat handlers
  const handleStartVideoCall = (patientId: number) => {
    const patient = waitingRoom.find(p => p.id === patientId);
    if (!patient) return;

    const videoSession: VideoSession = {
      id: `session-${Date.now()}`,
      appointmentId: patient.id,
      doctorId: 1, // Current doctor ID
      patientId: patient.id,
      roomId: `room-${patient.id}`,
      participants: [
        {
          id: '1',
          name: 'Dr. Provider',
          role: 'doctor',
          isConnected: true,
          hasVideo: true,
          hasAudio: true,
          joinedAt: new Date().toISOString()
        },
        {
          id: patient.id.toString(),
          name: patient.name,
          role: 'patient',
          isConnected: false,
          hasVideo: false,
          hasAudio: false,
          joinedAt: new Date().toISOString()
        }
      ],
      startTime: new Date().toISOString(),
      status: 'waiting',
      settings: {
        enableChat: true,
        enableRecording: true,
        enableScreenShare: true,
        maxDuration: 60,
        autoStartRecording: false
      }
    };

    setActiveVideoSession(videoSession);
    setShowVideoCall(true);

    // Update patient status
    setWaitingRoom(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, status: 'in-consultation' as const }
          : p
      )
    );
  };

  const handleStartChat = (patientId: number) => {
    setSelectedChatParticipant(patientId);
    setShowChat(true);
  };

  const handleEndVideoCall = () => {
    if (activeVideoSession) {
      // Update patient status back to waiting if call ended early
      setWaitingRoom(prev =>
        prev.map(p =>
          p.id === activeVideoSession.patientId
            ? { ...p, status: 'waiting' as const }
            : p
        )
      );
    }

    setActiveVideoSession(null);
    setShowVideoCall(false);
  };

  const handleUpdateVideoSession = (session: VideoSession) => {
    setActiveVideoSession(session);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'in-consultation': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Provider Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, Dr. Smith • {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SmartToy />}
              label="AI Smart Dashboard"
              color="primary"
              variant="outlined"
            />
            <Button
              variant={isOnline ? "contained" : "outlined"}
              color={isOnline ? "success" : "inherit"}
              startIcon={isOnline ? <CheckCircle /> : <Cancel />}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Button>
          </Box>
        </Box>

        {/* Efficiency Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.totalAppointments}
                    </Typography>
                    <Typography variant="body2">Today's Appointments</Typography>
                  </Box>
                  <Schedule fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.completedToday}
                    </Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <CheckCircle fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.onTimeRate}%
                    </Typography>
                    <Typography variant="body2">On-Time Rate</Typography>
                  </Box>
                  <Timer fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.averageDuration}m
                    </Typography>
                    <Typography variant="body2">Avg. Duration</Typography>
                  </Box>
                  <AccessTime fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Queue />} label="Waiting Room" />
          <Tab icon={<Schedule />} label="Today's Schedule" />
          <Tab icon={<Assessment />} label="Analytics" />
        </Tabs>

        {/* Waiting Room Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Patient Waiting Room ({sortedWaitingRoom.length} patients)
              </Typography>
              <Chip
                icon={<SmartToy />}
                label="Auto-sorted by priority & time"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {sortedWaitingRoom.map((patient, index) => (
                    <React.Fragment key={patient.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Chip
                                label={patient.priority.toUpperCase()}
                                size="small"
                                color={getPriorityColor(patient.priority) as any}
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            }
                          >
                            <Avatar src={patient.avatar} alt={patient.name}>
                              {patient.name.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {patient.name}
                              </Typography>
                              <Chip
                                label={patient.status.replace('-', ' ')}
                                size="small"
                                color={getStatusColor(patient.status) as any}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {patient.age} years • {patient.condition} • {patient.appointmentTime}
                              </Typography>
                              {patient.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  📝 {patient.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Send Notification">
                              <IconButton
                                size="small"
                                onClick={() => handleSendNotification(patient)}
                                color="primary"
                              >
                                <Notifications />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Start Chat">
                              <IconButton
                                size="small"
                                onClick={() => handleStartChat(patient.id)}
                                color="info"
                              >
                                <Chat />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Start Video Call">
                              <IconButton
                                size="small"
                                onClick={() => handleStartVideoCall(patient.id)}
                                color="success"
                              >
                                <VideoCall />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < sortedWaitingRoom.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        fullWidth
                      >
                        Add Walk-in Patient
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Message />}
                        fullWidth
                      >
                        Send Bulk Notifications
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<EventNote />}
                        fullWidth
                      >
                        Schedule Emergency
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Today's Schedule Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Today's Appointments
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.time}
                        </Typography>
                      </TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={appointment.type === 'video' ? <VideoCall /> : appointment.type === 'phone' ? <Phone /> : <LocalHospital />}
                          label={appointment.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{appointment.duration} min</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          size="small"
                          color={
                            appointment.status === 'completed' ? 'success' :
                            appointment.status === 'in-progress' ? 'primary' :
                            appointment.status === 'cancelled' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Message />
                          </IconButton>
                          <IconButton size="small" color="success">
                            <VideoCall />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Performance Analytics
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient Satisfaction
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        4.8/5
                      </Typography>
                      <TrendingUp color="success" />
                    </Box>
                    <LinearProgress variant="determinate" value={96} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Based on 127 reviews this month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Consultation Types
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip icon={<VideoCall />} label="Video: 65%" color="primary" />
                      <Chip icon={<Phone />} label="Phone: 30%" color="secondary" />
                      <Chip icon={<LocalHospital />} label="In-person: 5%" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Most patients prefer video consultations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Notification Dialog */}
      <Dialog open={notificationDialog} onClose={() => setNotificationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Notification to {selectedPatient?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message"
              defaultValue={`Hi ${selectedPatient?.name}, your appointment is coming up at ${selectedPatient?.appointmentTime}. Please be ready for your consultation.`}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Send via</InputLabel>
              <Select
                multiple
                value={Object.entries(notificationSettings).filter(([_, enabled]) => enabled).map(([key]) => key)}
                onChange={(e) => {
                  const selected = e.target.value as string[];
                  setNotificationSettings(prev => ({
                    ...prev,
                    email: selected.includes('email'),
                    sms: selected.includes('sms'),
                    push: selected.includes('push'),
                  }));
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="push">Push Notification</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Cancel</Button>
          <Button onClick={handleNotificationSubmit} variant="contained" startIcon={<Send />}>
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Consultation Dialog */}
      {showVideoCall && activeVideoSession && (
        <Dialog
          fullScreen
          open={showVideoCall}
          onClose={handleEndVideoCall}
        >
          <VideoConsultation
            session={activeVideoSession}
            onEndCall={handleEndVideoCall}
            onUpdateSession={handleUpdateVideoSession}
          />
        </Dialog>
      )}

      {/* Chat Dialog */}
      {showChat && selectedChatParticipant && (
        <Dialog
          fullScreen
          open={showChat}
          onClose={() => setShowChat(false)}
        >
          <MessagingSystem
            currentUser={{ id: 1, role: 'doctor', name: 'Dr. Provider' }}
            sessionId={`chat-${selectedChatParticipant}`}
            onStartVideoCall={(patientId) => {
              handleStartVideoCall(patientId);
              setShowChat(false);
            }}
          />
        </Dialog>
      )}

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setActiveTab(0)}
      >
        <Queue />
      </Fab>
    </Container>
  );
};

export default ProviderDashboard;