import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Badge,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Assignment,
  Description,
  VideoCall,
  CheckCircle,
  Pending,
  Cancel,
  Download,
  Upload,
  Share,
  Verified,
  Warning,
  Notifications,
  Schedule,
  TrendingUp,
  AttachFile,
  Visibility,
  GetApp,
  Block,
  Person,
} from '@mui/icons-material';
import { doctorDashboardAPI } from '../services/api';
import { authService, User } from '../services/smartAuth';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  patientName: string;
  uploadedAt: string;
  sharedWith?: string;
  status: 'pending' | 'approved' | 'rejected';
  canDownload: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<string>('pending');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sharePatientId, setSharePatientId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [smartInsights, setSmartInsights] = useState<string[]>([]);
  
  // API state
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingDocuments: 0,
    averageRating: 0,
  });

  // Fetch dashboard data with smart authentication
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user from smart auth service
        const user = authService.getUser();
        if (!user || user.user_type !== 'doctor') {
          navigate('/login');
          return;
        }
        
        setCurrentUser(user);
        
        // Fetch doctor-specific dashboard data using actual user ID
        const data = await doctorDashboardAPI.getDashboard(user.id);
        
        setDoctorInfo({
          ...data.doctorInfo,
          ...user, // Merge with user data from auth
        });
        setStats(data.stats);
        setPatients(data.patients);
        setAppointments(data.appointments);
        setDocuments(data.documents);
        setVerificationStatus(user.verification_status || 'pending');
        
        // Generate smart insights
        generateSmartInsights(user, data);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Smart insights generation algorithm
  const generateSmartInsights = (user: User, dashboardData: any) => {
    const insights: string[] = [];
    const currentHour = new Date().getHours();
    
    // Time-based insights
    if (currentHour < 9) {
      insights.push('🌅 Good morning, Dr. ' + user.last_name + '! You have ' + stats.todayAppointments + ' appointments today');
    } else if (currentHour < 12) {
      insights.push('☕ Mid-morning update: ' + (stats.todayAppointments - appointments.filter(a => a.status === 'completed').length) + ' appointments remaining');
    } else if (currentHour < 17) {
      insights.push('🌤️ Afternoon session in progress. Keep up the great work!');
    } else {
      insights.push('🌙 Evening wrap-up. Review today\'s patient notes');
    }
    
    // Performance insights
    if (user.average_rating && user.average_rating >= 4.5) {
      insights.push(`⭐ Excellent rating of ${user.average_rating}/5.0! Your patients appreciate your care`);
    } else if (user.average_rating && user.average_rating < 4.0) {
      insights.push('📊 Consider reviewing recent patient feedback to improve satisfaction');
    }
    
    // Patient load insights
    if (stats.totalPatients > 100) {
      insights.push('👥 You have a large patient base. Consider adjusting availability');
    } else if (stats.totalPatients < 20) {
      insights.push('📈 Growing your practice. Enable "Accepting New Patients" to increase visibility');
    }
    
    // Specialty-specific insights
    if (user.specialty === 'Cardiology') {
      insights.push('❤️ Cardiology Focus: Schedule follow-ups for high-risk patients');
    } else if (user.specialty === 'Pediatrics') {
      insights.push('👶 Pediatrics Tip: Check vaccination schedules for upcoming appointments');
    }
    
    // Document workflow insights
    if (stats.pendingDocuments > 5) {
      insights.push('📄 You have ' + stats.pendingDocuments + ' pending documents. Review and approve them');
    }
    
    setSmartInsights(insights);
  };

  const handleShareDocument = async () => {
    try {
      if (selectedDocument) {
        const doctorId = '1'; // Mock doctor ID
        await doctorDashboardAPI.shareDocument(
          doctorId,
          selectedDocument.id,
          { patientId: sharePatientId, permissions: ['view', 'download'] }
        );
        setSuccessMessage('Document shared successfully! Awaiting patient approval.');
        setShowSuccess(true);
        setShowShareDialog(false);
      }
    } catch (error) {
      console.error('Error sharing document:', error);
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    if (doc.canDownload) {
      // API call to download
      setSuccessMessage('Downloading document...');
      setShowSuccess(true);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case 'approved':
        return (
          <Chip
            icon={<Verified />}
            label="Verified"
            color="success"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<Pending />}
            label="Verification Pending"
            color="warning"
            variant="outlined"
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<Warning />}
            label="Verification Required"
            color="error"
            variant="outlined"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : !doctorInfo ? (
        <Alert severity="error">Failed to load dashboard data. Please try again.</Alert>
      ) : (
        <>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={currentUser?.profile_picture_url}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {currentUser ? currentUser.first_name[0] + currentUser.last_name[0] : 'DR'}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Dr. {currentUser?.first_name} {currentUser?.last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {currentUser?.specialty} • License: {currentUser?.license_number}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  {getVerificationBadge()}
                  {currentUser?.is_accepting_patients && (
                    <Chip label="Accepting Patients" color="success" size="small" />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Notifications />}
                color="primary"
              >
                Notifications
              </Button>
              <Button
                variant="outlined"
                startIcon={<Verified />}
                onClick={() => navigate('/doctor/verification')}
              >
                Update Credentials
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Smart Insights Section */}
      {smartInsights.length > 0 && (
        <Alert 
          severity="info" 
          icon={<TrendingUp />} 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            🧠 Smart Insights & Recommendations
          </Typography>
          {smartInsights.map((insight, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              • {insight}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalPatients}
                  </Typography>
                  <Typography variant="body2">Total Patients</Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.todayAppointments}
                  </Typography>
                  <Typography variant="body2">Today's Appointments</Typography>
                </Box>
                <Schedule sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingDocuments}
                  </Typography>
                  <Typography variant="body2">Pending Documents</Typography>
                </Box>
                <Description sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2">Average Rating</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<People />} label="My Patients" />
            <Tab icon={<Schedule />} label="Appointments" />
            <Tab icon={<Description />} label="Documents" />
            <Tab icon={<VideoCall />} label="Video Consultations" />
          </Tabs>
        </Box>

        {/* Patients Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Patient Management</Typography>
            <TextField
              size="small"
              placeholder="Search patients..."
              sx={{ width: 300 }}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Next Appointment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar>{patient.name.charAt(0)}</Avatar>
                        <Typography>{patient.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{patient.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.nextAppointment || 'Not scheduled'}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        color={patient.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        View Profile
                      </Button>
                      <Button size="small" variant="contained">
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Appointments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upcoming Appointments
          </Typography>
          <List>
            {appointments.map((apt, index) => (
              <React.Fragment key={apt.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {apt.type === 'video' ? <VideoCall /> : <Person />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={apt.patientName}
                    secondary={`${apt.date} at ${apt.time} • ${apt.type === 'video' ? 'Video Call' : 'In-Person'}`}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={apt.type === 'video' ? <VideoCall /> : <Assignment />}
                    >
                      {apt.type === 'video' ? 'Join Call' : 'View Details'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < appointments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Medical Documents</Typography>
            <Button variant="contained" startIcon={<Upload />}>
              Upload Document
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachFile />
                        <Typography>{doc.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{doc.patientName}</TableCell>
                    <TableCell>
                      <Chip label={doc.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          doc.status === 'approved' ? (
                            <CheckCircle />
                          ) : doc.status === 'pending' ? (
                            <Pending />
                          ) : (
                            <Cancel />
                          )
                        }
                        label={doc.status}
                        color={
                          doc.status === 'approved'
                            ? 'success'
                            : doc.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Document">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={doc.canDownload ? 'Download' : 'Awaiting approval'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!doc.canDownload}
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <GetApp />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Share with Patient">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowShareDialog(true);
                          }}
                        >
                          <Share />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Video Consultations Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Video Consultation Room
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your next video consultation is scheduled for{' '}
            <strong>Today at 10:00 AM</strong> with <strong>John Doe</strong>
          </Alert>
          <Button variant="contained" size="large" startIcon={<VideoCall />}>
            Start Video Call
          </Button>
        </TabPanel>
      </Card>

      {/* Share Document Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Select Patient"
            value={sharePatientId}
            onChange={(e) => setSharePatientId(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Permission"
            defaultValue="download"
            sx={{ mb: 2 }}
          >
            <MenuItem value="view">View Only</MenuItem>
            <MenuItem value="download">View & Download</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            placeholder="Add any notes for the patient..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleShareDocument}
            disabled={!sharePatientId}
          >
            Share Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
      </>
      )}
    </Container>
  );
};

export default DoctorDashboard;
