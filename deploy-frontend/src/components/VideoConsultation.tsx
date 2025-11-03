import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Fab,
  Snackbar,
  Badge,
  Divider,
  CircularProgress
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
  Info,
  SignalCellular4Bar,
  SignalCellular3Bar,
  SignalCellular2Bar,
  SignalCellular1Bar,
  SignalCellular0Bar,
  Wifi,
  WifiOff
} from '@mui/icons-material';
import { VideoSession, Participant, Message } from '../types';
import { webRTCService, ConnectionQuality } from '../services/webrtc.service';

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
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Mock current user (in real app, this would come from context/auth)
  const currentUser = { id: 1, role: 'patient' as const };

  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async () => {
    try {
      console.log('🎥 Initializing WebRTC for session:', session.id);
      setIsInitializing(true);
      setSnackbarMessage('Requesting camera and microphone access...');

      // Get local media stream
      console.log('📹 Getting local media stream...');
      const localStream = await webRTCService.getLocalStream(session.id);
      localStreamRef.current = localStream;

      console.log('✅ Local stream obtained:', localStream.getTracks().length, 'tracks');

      if (localVideoRef.current) {
        console.log('🎬 Setting video source...');
        localVideoRef.current.srcObject = localStream;
        console.log('✅ Video source set');
      } else {
        console.error('❌ Local video ref not found');
      }

      setSnackbarMessage('Camera and microphone access granted');

      // Initialize connections for remote participants only
      const remoteParticipants = session.participants.filter(p => p.id !== currentUser.id.toString());
      console.log('👥 Remote participants:', remoteParticipants.length);

      if (remoteParticipants.length === 0) {
        setSnackbarMessage('Waiting for other participants to join...');
        setIsConnected(true);
        setIsInitializing(false);
        console.log('✅ WebRTC initialized - waiting for participants');
        return;
      }

      // In a real implementation, you would wait for signaling server
      // For now, we'll just set up the local stream
      setIsConnected(true);
      setIsInitializing(false);
      setSnackbarMessage('Video consultation ready');
      console.log('✅ WebRTC fully initialized');

      // Note: Actual peer connections would be established through signaling
      // when remote participants join the call

    } catch (error) {
      console.error('❌ Failed to initialize WebRTC:', error);
      setIsInitializing(false);

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setSnackbarMessage('Camera and microphone access denied. Please allow access to start video call.');
        } else if (error.name === 'NotFoundError') {
          setSnackbarMessage('No camera or microphone found. Please connect a camera and microphone.');
        } else {
          setSnackbarMessage(`Failed to start video call: ${error.message}`);
        }
      } else {
        setSnackbarMessage('Failed to connect to video call. Please check your connection.');
      }
    }
  }, [session.id, session.participants, currentUser.id]);

  // Monitor connection quality
  useEffect(() => {
    if (!isConnected) return;

    const qualityCheck = setInterval(() => {
      const qualities = webRTCService.getAllConnectionQualities(session.id);
      if (qualities.length > 0) {
        // Use the worst quality as the overall quality
        const worstQuality = qualities.reduce((worst, current) =>
          (current.level === 'poor' ? 1 : current.level === 'fair' ? 2 : current.level === 'good' ? 3 : 4) <
          (worst.level === 'poor' ? 1 : worst.level === 'fair' ? 2 : worst.level === 'good' ? 3 : 4)
            ? current : worst
        );
        setConnectionQuality(worstQuality);
      }
    }, 2000);

    return () => clearInterval(qualityCheck);
  }, [isConnected, session.id]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      setChatMessages(prev => [...prev, message]);
    };

    window.addEventListener('webrtc-message', handleMessage as EventListener);
    return () => window.removeEventListener('webrtc-message', handleMessage as EventListener);
  }, []);

  useEffect(() => {
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Initialize WebRTC when component mounts
    initializeWebRTC();

    return () => {
      clearInterval(timer);
      // Cleanup WebRTC connections
      webRTCService.cleanup(session.id);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeWebRTC, session.id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityIcon = () => {
    return getQualityIcon(connectionQuality);
  };

  const getQualityIcon = (quality: ConnectionQuality | null) => {
    if (!quality) return <WifiOff color="error" />;

    switch (quality.level) {
      case 'excellent':
        return <SignalCellular4Bar color="success" />;
      case 'good':
        return <SignalCellular3Bar color="primary" />;
      case 'fair':
        return <SignalCellular2Bar color="warning" />;
      case 'poor':
        return <SignalCellular1Bar color="error" />;
      default:
        return <SignalCellular0Bar color="error" />;
    }
  };

      const getConnectionQualityColor = () => {
    if (!connectionQuality) return 'error';
    switch (connectionQuality.level) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'error';
    }
  };

  const toggleVideo = async () => {
    if (!localStreamRef.current) return;

    const videoTracks = localStreamRef.current.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !isVideoEnabled;
    });

    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = async () => {
    if (!localStreamRef.current) return;

    const audioTracks = localStreamRef.current.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !isAudioEnabled;
    });

    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }

        // Switch back to camera
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        setIsScreenSharing(false);
        setSnackbarMessage('Screen sharing stopped');
      } else {
        // Start screen sharing
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true
        });

        screenStreamRef.current = screenStream;

        // Replace video track in all peer connections
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        const screenAudioTrack = screenStream.getAudioTracks()[0];

        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // Handle screen share end
        screenVideoTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
        setSnackbarMessage('Screen sharing started');
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
      setSnackbarMessage('Screen sharing not supported or denied');
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        // Stop recording
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current = null;
        }
        setIsRecording(false);
        setSnackbarMessage('Recording stopped');
      } else {
        // Start recording
        const stream = localStreamRef.current;
        if (!stream) {
          setSnackbarMessage('No stream available for recording');
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });

        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);

          // In real implementation, upload to server
          console.log('Recording saved:', url);
          setSnackbarMessage('Recording saved');
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setSnackbarMessage('Recording started');
      }
    } catch (error) {
      console.error('Recording failed:', error);
      setSnackbarMessage('Recording not supported');
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id.toString(),
      receiverId: session.participants.find(p => p.id !== currentUser.id.toString())?.id || '0',
      content: chatMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true,
      isEncrypted: true
    };

    // Add to local chat
    setChatMessages(prev => [...prev, newMessage]);

    // Send via WebRTC data channel to all participants
    for (const participant of session.participants) {
      if (participant.id !== currentUser.id.toString()) {
        const sent = await webRTCService.sendMessage(session.id, participant.id, newMessage);
        if (!sent) {
          console.warn(`Failed to send message to ${participant.id}`);
        }
      }
    }

    setChatMessage('');
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end the consultation?')) {
      onEndCall();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
      {/* Loading Overlay */}
      {isInitializing && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: 'white'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Starting Video Consultation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Requesting camera and microphone access...
            </Typography>
          </Box>
        </Box>
      )}

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
            label={`${connectionQuality?.level.toUpperCase() || 'UNKNOWN'} Connection`}
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
        {/* Remote Videos */}
        <Box sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: remoteStreams.size > 1 ? '1fr 1fr' : '1fr',
          gap: 1,
          p: 1
        }}>
          {Array.from(remoteStreams.entries()).map(([participantId, stream]) => {
            const participant = session.participants.find(p => p.id === participantId);
            return (
              <Box key={participantId} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                <video
                  ref={(el) => {
                    if (el) remoteVideoRefs.current.set(participantId, el);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: '#333'
                  }}
                  autoPlay
                  playsInline
                />

                {/* Participant Info */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderRadius: 2,
                  p: 1,
                  color: 'white'
                }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {participant?.name[0]}
                  </Avatar>
                  <Typography variant="body2">
                    {participant?.name}
                  </Typography>
                  <Chip
                    label={participant?.role}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* No Remote Participants Message */}
        {remoteStreams.size === 0 && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            zIndex: 1
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Waiting for participants...
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Share the consultation link to invite others
            </Typography>
          </Box>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 200,
          height: 150,
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid white',
          boxShadow: 3
        }}>
          <video
            ref={localVideoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#333'
            }}
            autoPlay
            playsInline
            muted
            onLoadedData={() => console.log('🎬 Local video loaded successfully')}
            onError={(e) => console.error('❌ Local video error:', e)}
          />
          <Box sx={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}>
            <Typography variant="caption">You</Typography>
          </Box>
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
                severity={connectionQuality?.level === 'excellent' || connectionQuality?.level === 'good' ? 'success' :
                         connectionQuality?.level === 'fair' ? 'warning' : 'error'} 
                icon={getConnectionQualityIcon()}
              >
                Connection quality is {connectionQuality?.level || 'unknown'}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMessage('')}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoConsultation;