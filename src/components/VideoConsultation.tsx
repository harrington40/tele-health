import React, { useState, useEffect, useRef } from 'react';
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
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Fab
} from '@mui/material';
import {
  VideoCall,
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  Phone,
  PhoneDisabled,
  Settings,
  MoreVert,
  PictureInPicture,
  Fullscreen,
  VolumeUp,
  VolumeOff,
  FiberManualRecord,
  Stop,
  Send,
  AttachFile,
  EmojiEmotions,
  Groups,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { VideoSession, Participant, Message } from '../types';

interface VideoConsultationProps {
  session: VideoSession;
  onEndCall: () => void;
  onUpdateSession: (session: VideoSession) => void;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({
  session,
  onEndCall,
  onUpdateSession
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Mock current user (in real app, this would come from context/auth)
  const currentUser = { id: 1, role: 'patient' as const };

  useEffect(() => {
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate connection quality monitoring
    const qualityCheck = setInterval(() => {
      const qualities: ('excellent' | 'good' | 'poor')[] = ['excellent', 'good', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(qualityCheck);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real implementation, this would control the actual video stream
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In real implementation, this would control the actual audio stream
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In real implementation, this would start/stop screen sharing
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In real implementation, this would start/stop recording
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id.toString(),
      receiverId: session.participants.find(p => p.role !== currentUser.role)?.id.toString() || '0',
      content: chatMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true,
      isEncrypted: true
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end the consultation?')) {
      onEndCall();
    }
  };

  const getConnectionQualityColor = (): 'success' | 'warning' | 'error' | 'info' => {
    switch (connectionQuality) {
      case 'excellent': return 'success';
      case 'good': return 'warning';
      case 'poor': return 'error';
      default: return 'info';
    }
  };

  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <CheckCircle />;
      case 'good': return <Warning />;
      case 'poor': return <Warning />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
      {/* Top Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        bgcolor: 'rgba(0,0,0,0.8)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            Telehealth Consultation
          </Typography>
          <Chip
            icon={getConnectionQualityIcon()}
            label={`${connectionQuality.toUpperCase()} Connection`}
            color={getConnectionQualityColor()}
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Duration: {formatDuration(callDuration)}
          </Typography>
          {isRecording && (
            <Chip
              icon={<FiberManualRecord />}
              label="Recording"
              color="error"
              size="small"
              sx={{ animation: 'pulse 2s infinite' }}
            />
          )}
          <IconButton color="inherit" onClick={() => setShowSettings(true)}>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Video Area */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex' }}>
        {/* Main Video (Remote) */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <video
            ref={remoteVideoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#333'
            }}
            autoPlay
            playsInline
          />
          
          {/* Remote Participant Info */}
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 2,
            p: 1,
            color: 'white'
          }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {session.participants.find(p => p.role !== currentUser.role)?.name[0]}
            </Avatar>
            <Typography variant="body2">
              {session.participants.find(p => p.role !== currentUser.role)?.name}
            </Typography>
            <Chip
              label={session.participants.find(p => p.role !== currentUser.role)?.role}
              size="small"
              color="primary"
            />
          </Box>

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <Box sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(255,0,0,0.8)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1
            }}>
              <Typography variant="body2">🖥️ Screen Sharing Active</Typography>
            </Box>
          )}
        </Box>

        {/* Local Video (Picture-in-Picture) */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: showChat ? 336 : 16,
          width: 200,
          height: 150,
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid white',
          transition: 'right 0.3s ease'
        }}>
          <video
            ref={localVideoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#333',
              transform: 'scaleX(-1)' // Mirror effect for local video
            }}
            autoPlay
            playsInline
            muted
          />
          
          {!isVideoEnabled && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white'
            }}>
              <VideocamOff />
            </Box>
          )}
        </Box>

        {/* Chat Panel */}
        {showChat && (
          <Paper sx={{
            width: 320,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
              <Typography variant="h6">Chat</Typography>
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              <List dense>
                {chatMessages.map((message) => (
                  <ListItem key={message.id} sx={{
                    justifyContent: message.senderId === currentUser.id.toString() ? 'flex-end' : 'flex-start'
                  }}>
                    <Paper sx={{
                      p: 1,
                      maxWidth: '80%',
                      bgcolor: message.senderId === currentUser.id.toString() ? 'primary.main' : 'grey.100',
                      color: message.senderId === currentUser.id.toString() ? 'white' : 'text.primary'
                    }}>
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>
            </Box>
            
            <Box sx={{ p: 1, borderTop: '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
                <IconButton size="small" color="primary" onClick={sendChatMessage}>
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Bottom Controls */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        p: 3,
        bgcolor: 'rgba(0,0,0,0.8)'
      }}>
        {/* Audio Control */}
        <Tooltip title={isAudioEnabled ? 'Mute' : 'Unmute'}>
          <IconButton
            onClick={toggleAudio}
            sx={{
              bgcolor: isAudioEnabled ? 'rgba(255,255,255,0.2)' : 'error.main',
              color: 'white',
              '&:hover': { bgcolor: isAudioEnabled ? 'rgba(255,255,255,0.3)' : 'error.dark' }
            }}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </IconButton>
        </Tooltip>

        {/* Video Control */}
        <Tooltip title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
          <IconButton
            onClick={toggleVideo}
            sx={{
              bgcolor: isVideoEnabled ? 'rgba(255,255,255,0.2)' : 'error.main',
              color: 'white',
              '&:hover': { bgcolor: isVideoEnabled ? 'rgba(255,255,255,0.3)' : 'error.dark' }
            }}
          >
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Tooltip>

        {/* Screen Share */}
        <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
          <IconButton
            onClick={toggleScreenShare}
            sx={{
              bgcolor: isScreenSharing ? 'primary.main' : 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: isScreenSharing ? 'primary.dark' : 'rgba(255,255,255,0.3)' }
            }}
          >
            {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
        </Tooltip>

        {/* Chat Toggle */}
        <Tooltip title="Toggle chat">
          <IconButton
            onClick={() => setShowChat(!showChat)}
            sx={{
              bgcolor: showChat ? 'primary.main' : 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: showChat ? 'primary.dark' : 'rgba(255,255,255,0.3)' }
            }}
          >
            <Chat />
          </IconButton>
        </Tooltip>

        {/* Recording */}
        <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
          <IconButton
            onClick={toggleRecording}
            sx={{
              bgcolor: isRecording ? 'error.main' : 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: isRecording ? 'error.dark' : 'rgba(255,255,255,0.3)' }
            }}
          >
            {isRecording ? <Stop /> : <FiberManualRecord />}
          </IconButton>
        </Tooltip>

        {/* End Call */}
        <Tooltip title="End consultation">
          <IconButton
            onClick={handleEndCall}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              mx: 2,
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            <PhoneDisabled />
          </IconButton>
        </Tooltip>

        {/* More Options */}
        <Tooltip title="More options">
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Video Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Audio & Video</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant={isVideoEnabled ? 'contained' : 'outlined'}
                  onClick={toggleVideo}
                  startIcon={<Videocam />}
                >
                  Camera
                </Button>
                <Button
                  variant={isAudioEnabled ? 'contained' : 'outlined'}
                  onClick={toggleAudio}
                  startIcon={<Mic />}
                >
                  Microphone
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Connection Quality</Typography>
              <Alert 
                severity={getConnectionQualityColor()} 
                icon={getConnectionQualityIcon()}
              >
                Connection quality is {connectionQuality}
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Recording</Typography>
              <Button
                variant={isRecording ? 'contained' : 'outlined'}
                color={isRecording ? 'error' : 'primary'}
                onClick={toggleRecording}
                startIcon={isRecording ? <Stop /> : <FiberManualRecord />}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoConsultation;