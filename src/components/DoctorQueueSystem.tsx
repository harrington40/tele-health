import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  LinearProgress,
  Badge,
  Tooltip,
  Tab,
  Tabs,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  NotificationsActive,
  Schedule,
  Person,
  VideoCall,
  Phone,
  Message,
  PriorityHigh,
  CheckCircle,
  Cancel,
  Pause,
  PlayArrow,
  Timer,
  AccessTime,
  Group,
  PersonAdd,
  Edit,
  Delete,
  Refresh,
  Settings,
  NotificationImportant,
  Warning,
  Info,
  ExpandMore,
  DragIndicator,
  SwapVert,
  FilterList,
  Sort,
  Visibility,
  VisibilityOff,
  Send,
  CallMade,
  CallReceived,
  MoreVert,
  Star,
  StarBorder
} from '@mui/icons-material';
import { Doctor, Patient, NotificationQueue, QueueEntry } from '../types';

interface DoctorQueueSystemProps {
  doctor: Doctor;
  onStartConsultation: (patientId: number, type: 'video' | 'voice') => void;
  onSendMessage: (patientId: number) => void;
}

const DoctorQueueSystem: React.FC<DoctorQueueSystemProps> = ({
  doctor,
  onStartConsultation,
  onSendMessage
}) => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isQueueActive, setIsQueueActive] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [queueSettings, setQueueSettings] = useState({
    maxPatients: 10,
    averageConsultationTime: 15,
    autoNotifications: true,
    allowEmergency: true,
    workingHours: { start: '09:00', end: '17:00' }
  });
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'waitTime'>('time');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'warning' | 'info' });

  // Mock queue data
  useEffect(() => {
    const mockQueue: QueueEntry[] = [
      {
        id: '1',
        patientId: 101,
        patientName: 'Sarah Johnson',
        doctorId: doctor.id,
        position: 1,
        estimatedWaitTime: 5,
        priority: 'high',
        appointmentType: 'video',
        status: 'waiting',
        joinedAt: new Date(Date.now() - 300000).toISOString(),
        notificationsSent: 1,
        lastNotification: new Date(Date.now() - 120000).toISOString(),
        reason: 'Follow-up consultation for chest pain',
        patientNotes: 'Patient has been experiencing chest discomfort since yesterday'
      },
      {
        id: '2',
        patientId: 102,
        patientName: 'Michael Chen',
        doctorId: doctor.id,
        position: 2,
        estimatedWaitTime: 20,
        priority: 'medium',
        appointmentType: 'video',
        status: 'waiting',
        joinedAt: new Date(Date.now() - 600000).toISOString(),
        notificationsSent: 0,
        reason: 'Regular health checkup',
        patientNotes: 'Annual physical examination'
      },
      {
        id: '3',
        patientId: 103,
        patientName: 'Emily Davis',
        doctorId: doctor.id,
        position: 3,
        estimatedWaitTime: 35,
        priority: 'low',
        appointmentType: 'voice',
        status: 'waiting',
        joinedAt: new Date(Date.now() - 900000).toISOString(),
        notificationsSent: 0,
        reason: 'Prescription refill consultation',
        patientNotes: 'Needs refill for blood pressure medication'
      },
      {
        id: '4',
        patientId: 104,
        patientName: 'Robert Wilson',
        doctorId: doctor.id,
        position: 0,
        estimatedWaitTime: 0,
        priority: 'high',
        appointmentType: 'video',
        status: 'in-consultation',
        joinedAt: new Date(Date.now() - 1800000).toISOString(),
        notificationsSent: 2,
        consultationStarted: new Date(Date.now() - 600000).toISOString(),
        reason: 'Emergency consultation',
        patientNotes: 'Patient reporting severe headache and dizziness'
      }
    ];
    setQueue(mockQueue);
  }, [doctor.id]);

  const getPatientInfo = (patientId: number) => {
    const patients: { [key: number]: { name: string; avatar?: string; age: number; lastVisit: string } } = {
      101: { name: 'Sarah Johnson', age: 45, lastVisit: '2024-01-10' },
      102: { name: 'Michael Chen', age: 32, lastVisit: '2024-01-08' },
      103: { name: 'Emily Davis', age: 28, lastVisit: '2024-01-05' },
      104: { name: 'Robert Wilson', age: 67, lastVisit: '2024-01-12' }
    };
    return patients[patientId] || { name: 'Unknown Patient', age: 0, lastVisit: '' };
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <PriorityHigh color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <Info color="info" />;
      default: return <Schedule />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'in-consultation': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const updateQueuePosition = (entryId: string, newPosition: number) => {
    setQueue(prev => {
      const updated = [...prev];
      const entryIndex = updated.findIndex(e => e.id === entryId);
      if (entryIndex === -1) return prev;

      const entry = updated[entryIndex];
      updated.splice(entryIndex, 1);
      updated.splice(newPosition - 1, 0, { ...entry, position: newPosition });

      // Update positions for all affected entries
      return updated.map((e, index) => ({ ...e, position: index + 1 }));
    });
  };

  const sendNotification = (entry: QueueEntry, customMessage?: string) => {
    const message = customMessage || `Your appointment with ${doctor.name} is ready. Please join the consultation.`;
    
    setQueue(prev => prev.map(e => 
      e.id === entry.id 
        ? { 
            ...e, 
            notificationsSent: (e.notificationsSent || 0) + 1,
            lastNotification: new Date().toISOString()
          }
        : e
    ));

    setSnackbar({
      open: true,
      message: `Notification sent to ${getPatientInfo(entry.patientId).name}`,
      severity: 'success'
    });
  };

  const startConsultation = (entry: QueueEntry) => {
    setQueue(prev => prev.map(e => 
      e.id === entry.id 
        ? { 
            ...e, 
            status: 'in-consultation',
            consultationStarted: new Date().toISOString()
          }
        : e
    ));
    
    onStartConsultation(entry.patientId, (entry.appointmentType || 'video') as 'video' | 'voice');
  };

  const completeConsultation = (entry: QueueEntry) => {
    setQueue(prev => prev.filter(e => e.id !== entry.id));
    setSnackbar({
      open: true,
      message: `Consultation with ${getPatientInfo(entry.patientId).name} completed`,
      severity: 'success'
    });
  };

  const removeFromQueue = (entry: QueueEntry) => {
    setQueue(prev => prev.filter(e => e.id !== entry.id));
    setSnackbar({
      open: true,
      message: `${getPatientInfo(entry.patientId).name} removed from queue`,
      severity: 'info'
    });
  };

  const filteredQueue = queue
    .filter(entry => filterPriority === 'all' || entry.priority === filterPriority)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'waitTime':
          return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        default:
          return (a.position || 0) - (b.position || 0);
      }
    });

  const waitingQueue = filteredQueue.filter(e => e.status === 'waiting');
  const activeConsultations = filteredQueue.filter(e => e.status === 'in-consultation');

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h4" gutterBottom>
                Patient Queue Management
              </Typography>
              <Typography variant="subtitle1">
                {doctor.name} • {doctor.specialty}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isQueueActive}
                    onChange={(e) => setIsQueueActive(e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { color: 'white' } }}
                  />
                }
                label={
                  <Typography color="white">
                    Queue {isQueueActive ? 'Active' : 'Paused'}
                  </Typography>
                }
              />
              
              <Badge badgeContent={waitingQueue.length} color="error">
                <NotificationsActive sx={{ color: 'white', fontSize: 32 }} />
              </Badge>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h6">{waitingQueue.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Waiting Patients
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <VideoCall />
                </Avatar>
                <Box>
                  <Typography variant="h6">{activeConsultations.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Consultations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Timer />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {waitingQueue.length > 0 ? formatWaitTime(waitingQueue[0]?.estimatedWaitTime || 0) : '0m'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next Patient Wait
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <PriorityHigh />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {waitingQueue.filter(e => e.priority === 'high').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority Filter</InputLabel>
            <Select
              value={filterPriority}
              label="Priority Filter"
              onChange={(e) => setFilterPriority(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="time">Join Time</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="waitTime">Wait Time</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => {/* Open settings */}}
          >
            Settings
          </Button>
        </Box>
      </Paper>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Waiting Queue (${waitingQueue.length})`} />
        <Tab label={`Active Consultations (${activeConsultations.length})`} />
        <Tab label="Completed" />
        <Tab label="Analytics" />
      </Tabs>

      {/* Waiting Queue Tab */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patient Waiting Queue
            </Typography>
            
            {waitingQueue.length === 0 ? (
              <Alert severity="info">
                No patients currently waiting in the queue.
              </Alert>
            ) : (
              <List>
                {waitingQueue.map((entry, index) => {
                  const patient = getPatientInfo(entry.patientId);
                  
                  return (
                    <React.Fragment key={entry.id}>
                      <ListItem
                        sx={{
                          border: entry.priority === 'high' ? '2px solid red' : '1px solid #ddd',
                          borderRadius: 2,
                          mb: 2,
                          bgcolor: entry.priority === 'high' ? 'error.lighter' : 'background.paper'
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={entry.position}
                            color="primary"
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          >
                            <Avatar>{patient.name[0]}</Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {patient.name}
                              </Typography>
                              <Chip
                                icon={getPriorityIcon(entry.priority)}
                                label={entry.priority.toUpperCase()}
                                color={getPriorityColor(entry.priority)}
                                size="small"
                              />
                              <Chip
                                icon={entry.appointmentType === 'video' ? <VideoCall /> : <Phone />}
                                label={entry.appointmentType}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {entry.reason}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Joined: {formatTimeAgo(entry.joinedAt)} • Est. wait: {formatWaitTime(entry.estimatedWaitTime)}
                              </Typography>
                              {(entry.notificationsSent || 0) > 0 && (
                                <Typography variant="caption" color="warning.main">
                                  📧 {entry.notificationsSent || 0} notification(s) sent
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Send notification">
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setSelectedPatient(entry);
                                  setNotificationDialog(true);
                                }}
                              >
                                <Send />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Start consultation">
                              <IconButton
                                color="success"
                                onClick={() => startConsultation(entry)}
                              >
                                {entry.appointmentType === 'video' ? <VideoCall /> : <Phone />}
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Send message">
                              <IconButton
                                color="info"
                                onClick={() => onSendMessage(entry.patientId)}
                              >
                                <Message />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="More options">
                              <IconButton>
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Consultations Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Consultations
            </Typography>
            
            {activeConsultations.length === 0 ? (
              <Alert severity="info">
                No active consultations at the moment.
              </Alert>
            ) : (
              <List>
                {activeConsultations.map((entry) => {
                  const patient = getPatientInfo(entry.patientId);
                  const consultationDuration = entry.consultationStarted 
                    ? Math.floor((Date.now() - new Date(entry.consultationStarted).getTime()) / 60000)
                    : 0;
                  
                  return (
                    <ListItem
                      key={entry.id}
                      sx={{
                        border: '2px solid green',
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: 'success.lighter'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          {patient.name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {patient.name}
                            </Typography>
                            <Chip
                              label="IN CONSULTATION"
                              color="success"
                              size="small"
                            />
                            <Chip
                              icon={entry.appointmentType === 'video' ? <VideoCall /> : <Phone />}
                              label={entry.appointmentType}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {entry.reason}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Duration: {formatWaitTime(consultationDuration)} • Started: {formatTimeAgo(entry.consultationStarted || '')}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => completeConsultation(entry)}
                          >
                            Complete
                          </Button>
                          
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => removeFromQueue(entry)}
                          >
                            End
                          </Button>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notification Dialog */}
      <Dialog
        open={notificationDialog}
        onClose={() => setNotificationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Notification to {selectedPatient ? getPatientInfo(selectedPatient.patientId).name : ''}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Custom Message"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="Your appointment with Dr. Johnson is ready. Please join the consultation."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedPatient) {
                sendNotification(selectedPatient, notificationMessage);
              }
              setNotificationDialog(false);
              setNotificationMessage('');
              setSelectedPatient(null);
            }}
          >
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorQueueSystem;