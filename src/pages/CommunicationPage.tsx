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
  Grid,
  Tab,
  Tabs,
  Paper,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  Fab
} from '@mui/material';
import {
  VideoCall,
  Message,
  Notifications,
  People,
  Schedule,
  Phone,
  Chat,
  Queue,
  NotificationImportant,
  AccessTime,
  OndemandVideo,
  VoiceChat,
  CallMade,
  CallReceived,
  History,
  Star,
  Settings,
  Refresh,
  Add,
  Close,
  AttachFile
} from '@mui/icons-material';
import VideoConsultation from '../components/VideoConsultation';
import MessagingSystem from '../components/MessagingSystem';
import DoctorQueueSystem from '../components/DoctorQueueSystem';
import { FileUpload } from '../components/UI/FileUpload';
import { FileManager } from '../components/UI/FileManager';
import { VideoSession, Message as MessageType, Doctor, Patient } from '../types';

const CommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeVideoSession, setActiveVideoSession] = useState<VideoSession | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [currentUser] = useState({
    id: 1,
    role: 'doctor' as const,
    name: 'Dr. Sarah Johnson',
    avatar: '/api/placeholder/40/40'
  });

  // Mock doctor data
  const doctor: Doctor = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Internal Medicine',
    rating: 4.8,
    reviews: 150,
    price: 150,
    availability: 'Mon-Fri 9AM-5PM',
    image: '/api/placeholder/200/200',
    location: 'Medical Center',
    country: 'US',
    countryName: 'United States',
    isOnline: true,
    bio: 'Experienced internal medicine physician specializing in preventive care.',
    education: ['MD from Harvard Medical School', 'Residency at Johns Hopkins'],
    experience: 12
  };

  const [communicationStats, setCommunicationStats] = useState({
    activeVideoSessions: 2,
    unreadMessages: 5,
    queuedPatients: 8,
    todayConsultations: 12,
    averageWaitTime: 15,
    patientSatisfaction: 4.7
  });

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'video_call',
      patientName: 'John Smith',
      time: '10 minutes ago',
      duration: '15 minutes',
      status: 'completed'
    },
    {
      id: '2',
      type: 'message',
      patientName: 'Emily Davis',
      time: '25 minutes ago',
      content: 'Thank you for the prescription',
      status: 'unread'
    },
    {
      id: '3',
      type: 'queue_join',
      patientName: 'Michael Chen',
      time: '1 hour ago',
      reason: 'Follow-up consultation',
      status: 'waiting'
    }
  ];

  const handleStartVideoCall = (patientId: number, type: 'video' | 'voice') => {
    const mockSession: VideoSession = {
      id: Date.now().toString(),
      appointmentId: 1,
      doctorId: currentUser.id,
      patientId: patientId,
      roomId: `room-${Date.now()}`,
      status: 'active',
      startTime: new Date().toISOString(),
      participants: [
        {
          id: currentUser.id.toString(),
          name: currentUser.name,
          role: currentUser.role,
          isConnected: true,
          hasVideo: true,
          hasAudio: true,
          joinedAt: new Date().toISOString()
        },
        {
          id: patientId.toString(),
          name: 'Patient Name',
          role: 'patient',
          isConnected: true,
          hasVideo: type === 'video',
          hasAudio: true,
          joinedAt: new Date().toISOString()
        }
      ],
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

  const handleSendMessage = (patientId: number) => {
    // Switch to messaging tab
    setActiveTab(1);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video_call': return <VideoCall color="primary" />;
      case 'message': return <Message color="info" />;
      case 'queue_join': return <Schedule color="warning" />;
      default: return <Notifications />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'unread': return 'error';
      case 'waiting': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h4" gutterBottom>
                Communication Center
              </Typography>
              <Typography variant="subtitle1">
                Manage video consultations, messages, and patient queue
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Emergency Consultation">
                <Fab 
                  color="error" 
                  size="small"
                  onClick={() => handleStartVideoCall(999, 'video')}
                >
                  <NotificationImportant />
                </Fab>
              </Tooltip>
              
              <Tooltip title="Refresh All">
                <Fab 
                  color="secondary" 
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  <Refresh />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <OndemandVideo sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{communicationStats.activeVideoSessions}</Typography>
              <Typography variant="body2">Active Sessions</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Badge badgeContent={communicationStats.unreadMessages} color="error">
                <Chat sx={{ fontSize: 40, mb: 1 }} />
              </Badge>
              <Typography variant="h6">{communicationStats.unreadMessages}</Typography>
              <Typography variant="body2">Unread Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Queue sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{communicationStats.queuedPatients}</Typography>
              <Typography variant="body2">Queue Length</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{communicationStats.todayConsultations}</Typography>
              <Typography variant="body2">Today's Consultations</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <AccessTime sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{communicationStats.averageWaitTime}m</Typography>
              <Typography variant="body2">Avg Wait Time</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Star sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{communicationStats.patientSatisfaction}</Typography>
              <Typography variant="body2">Satisfaction</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Communication Interface */}
        <Grid item xs={12} lg={9}>
          <Card sx={{ height: '80vh' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                <Tab 
                  icon={<Queue />} 
                  label={`Patient Queue (${communicationStats.queuedPatients})`} 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Badge badgeContent={communicationStats.unreadMessages} color="error"><Chat /></Badge>} 
                  label="Messages" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<VideoCall />} 
                  label="Video Consultations" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<History />} 
                  label="History" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<AttachFile />} 
                  label="Documents" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              <DoctorQueueSystem
                doctor={doctor}
                onStartConsultation={handleStartVideoCall}
                onSendMessage={handleSendMessage}
              />
            )}

            {activeTab === 1 && (
              <MessagingSystem
                currentUser={currentUser}
                onStartVideoCall={(participantId) => handleStartVideoCall(participantId, 'video')}
                onStartVoiceCall={(patientId) => handleStartVideoCall(patientId, 'voice')}
              />
            )}

            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Video Consultation Management
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Quick Start
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            startIcon={<VideoCall />}
                            onClick={() => handleStartVideoCall(101, 'video')}
                          >
                            Start Video Call
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Phone />}
                            onClick={() => handleStartVideoCall(101, 'voice')}
                          >
                            Voice Call
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Active Sessions
                        </Typography>
                        <Alert severity="info">
                          {communicationStats.activeVideoSessions} active video session(s)
                        </Alert>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Communication History
                </Typography>
                <Alert severity="info">
                  Communication history and analytics will be displayed here.
                </Alert>
              </Box>
            )}

            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Document Sharing
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload and share medical documents, prescriptions, and test results with patients.
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <FileUpload
                    category="medical_documents"
                    userId={currentUser.id.toString()}
                    onUploadComplete={(files) => {
                      console.log('Files uploaded:', files);
                      // Here you could update the UI to show uploaded files
                    }}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                    }}
                  />
                </Box>

                <FileManager
                  category="medical_documents"
                  userId={currentUser.id.toString()}
                  onFileDeleted={(fileId) => {
                    console.log('File deleted:', fileId);
                  }}
                  onFileDownloaded={(fileId) => {
                    console.log('File downloaded:', fileId);
                  }}
                />
              </Box>
            )}
          </Card>
        </Grid>

        {/* Activity Sidebar */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              
              <List sx={{ overflow: 'auto', flex: 1 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              {activity.patientName}
                            </Typography>
                            <Chip
                              label={activity.status}
                              size="small"
                              color={getActivityColor(activity.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.type === 'video_call' && `Call lasted ${activity.duration}`}
                              {activity.type === 'message' && activity.content}
                              {activity.type === 'queue_join' && activity.reason}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default CommunicationPage;