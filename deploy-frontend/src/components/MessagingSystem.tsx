import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Divider,
  Badge,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  LinearProgress,
  InputAdornment,
  Fab,
  Tab,
  Tabs,
  Grid
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Search,
  VideoCall,
  Phone,
  Info,
  Notifications,
  NotificationsOff,
  Star,
  StarBorder,
  Reply,
  Forward,
  Delete,
  Archive,
  UnarchiveOutlined,
  MarkEmailRead,
  MarkEmailUnread,
  PriorityHigh,
  ScheduleSend,
  Translate,
  VoiceChat,
  PhotoCamera,
  MicNone,
  Stop,
  PlayArrow,
  Download,
  VisibilityOff,
  Lock,
  CheckCircle,
  Schedule,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Message, ChatRoom, Participant, Doctor, Patient } from '../types';
import { webRTCService } from '../services/webrtc.service';

interface MessagingSystemProps {
  currentUser: { id: number; role: 'doctor' | 'patient'; name: string; avatar?: string };
  onStartVideoCall?: (participantId: number) => void;
  onStartVoiceCall?: (participantId: number) => void;
  sessionId?: string; // For WebRTC integration
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({
  currentUser,
  onStartVideoCall,
  onStartVoiceCall,
  sessionId
}) => {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [attachmentMenu, setAttachmentMenu] = useState<null | HTMLElement>(null);
  const [messageMenu, setMessageMenu] = useState<{ anchorEl: HTMLElement; messageId: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // WebRTC message handling
  useEffect(() => {
    if (!sessionId) return;

    const handleWebRTCMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      if (selectedChat && selectedChat.participants.includes(message.senderId)) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });

        // Mark as read if chat is active
        if (selectedChat.id === message.receiverId || selectedChat.participants.includes(message.senderId)) {
          // In real implementation, mark message as read on server
        }
      }
    };

    window.addEventListener('webrtc-message', handleWebRTCMessage as EventListener);
    setConnectionStatus('connected');
    setIsConnected(true);

    return () => {
      window.removeEventListener('webrtc-message', handleWebRTCMessage as EventListener);
    };
  }, [sessionId, selectedChat]);

  // Handle chat selection and load messages
  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      // In real implementation, this would fetch from API
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedChat.participants[0],
          receiverId: selectedChat.participants[1],
          content: 'Hello! How are you feeling today?',
          type: 'text',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: true,
          isDelivered: true,
          isEncrypted: true
        },
        {
          id: '2',
          senderId: selectedChat.participants[1],
          receiverId: selectedChat.participants[0],
          content: 'I\'m doing better, thank you. The medication is helping.',
          type: 'text',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          isRead: true,
          isDelivered: true,
          isEncrypted: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  // Initialize mock data on component mount
  useEffect(() => {
    const mockChatRooms: ChatRoom[] = [
      {
        id: '1',
        participants: [
          currentUser.id.toString(),
          currentUser.role === 'doctor' ? '2' : '1'
        ],
        lastMessage: {
          id: '1',
          senderId: currentUser.role === 'doctor' ? '2' : '1',
          receiverId: currentUser.id.toString(),
          content: 'Thank you for the consultation today. When should I take the prescribed medication?',
          type: 'text',
          timestamp: new Date().toISOString(),
          isRead: false,
          isDelivered: true,
          isEncrypted: true
        },
        lastActivity: new Date().toISOString(),
        unreadCount: 2,
        type: 'direct',
        isActive: true,
        isArchived: false,
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        participants: [currentUser.id.toString(), currentUser.role === 'doctor' ? '3' : '4'],
        lastMessage: {
          id: '2',
          senderId: currentUser.id.toString(),
          receiverId: currentUser.role === 'doctor' ? '3' : '4',
          content: 'Your test results are ready. Please schedule a follow-up appointment.',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          isDelivered: true,
          isEncrypted: true
        },
        lastActivity: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        type: 'direct',
        isActive: true,
        isArchived: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setChatRooms(mockChatRooms);
  }, []); // Empty dependency array for initialization

  // Mock messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      const mockMessages: Message[] = [
      {
        id: '1',
        senderId: currentUser.role === 'doctor' ? '2' : '1',
        receiverId: currentUser.id.toString(),
        content: 'Hello! I wanted to follow up on our appointment yesterday.',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true,
        isDelivered: true,
        isEncrypted: true
      },
      {
        id: '2',
        senderId: currentUser.id.toString(),
        receiverId: currentUser.role === 'doctor' ? '2' : '1',
        content: 'Hi! How are you feeling today? Any improvement with the symptoms?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        isDelivered: true,
        isEncrypted: true
      },
      {
        id: '3',
        senderId: currentUser.role === 'doctor' ? '2' : '1',
        receiverId: currentUser.id.toString(),
        content: 'Much better! The medication is working well. When should I take the next dose?',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
        isDelivered: true,
        isEncrypted: true
      }
    ];
    setMessages(mockMessages);
    }
  }, [selectedChat]);

  // WebRTC message handling
  useEffect(() => {
    if (!sessionId) return;

    const handleWebRTCMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      if (selectedChat && selectedChat.participants.includes(message.senderId)) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });

        // Mark as read if chat is active
        if (selectedChat.id === message.receiverId || selectedChat.participants.includes(message.senderId)) {
          // In real implementation, mark message as read on server
        }
      }
    };

    window.addEventListener('webrtc-message', handleWebRTCMessage as EventListener);
    setConnectionStatus('connected');
    setIsConnected(true);

    return () => {
      window.removeEventListener('webrtc-message', handleWebRTCMessage as EventListener);
    };
  }, [sessionId, selectedChat]);

  // Handle chat selection and load messages
  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      // In real implementation, this would fetch from API
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedChat.participants[0],
          receiverId: selectedChat.participants[1],
          content: 'Hello! How are you feeling today?',
          type: 'text',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: true,
          isDelivered: true,
          isEncrypted: true
        },
        {
          id: '2',
          senderId: selectedChat.participants[1],
          receiverId: selectedChat.participants[0],
          content: 'I\'m doing better, thank you. The medication is helping.',
          type: 'text',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          isRead: true,
          isDelivered: true,
          isEncrypted: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id.toString(),
      receiverId: selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0',
      content: message,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: false,
      isEncrypted: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Send via WebRTC if in a session
    if (sessionId && isConnected) {
      const receiverId = selectedChat.participants.find(p => p !== currentUser.id.toString());
      if (receiverId) {
        const sent = await webRTCService.sendMessage(sessionId, receiverId, newMessage);
        if (sent) {
          setMessages(prev => prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg
          ));
        } else {
          // Handle send failure
          setMessages(prev => prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, isDelivered: false } : msg
          ));
        }
      }
    } else {
      // Fallback to API for non-WebRTC messaging
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg
        ));
      }, 1000);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingDuration > 0) {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id.toString(),
        receiverId: selectedChat?.participants.find(p => p !== currentUser.id.toString()) || '0',
        content: `Voice message (${formatRecordingTime(recordingDuration)})`,
        type: 'voice',
        timestamp: new Date().toISOString(),
        isRead: false,
        isDelivered: true,
        isEncrypted: true,
        attachments: [{
          name: `voice-${Date.now()}.mp3`,
          url: '#',
          size: 1024,
          type: 'audio'
        }]
      };
      setMessages(prev => [...prev, voiceMessage]);
    }
    setRecordingDuration(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedChat) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id.toString(),
        receiverId: selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0',
        content: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        timestamp: new Date().toISOString(),
        isRead: false,
        isDelivered: true,
        isEncrypted: true,
        attachments: [{
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type.startsWith('image/') ? 'image' : 'document'
        }]
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const getMessageIcon = (message: Message) => {
    if (!message.isDelivered) return <Schedule sx={{ fontSize: 16, color: 'grey.500' }} />;
    if (!message.isRead) return <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />;
    return <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />;
  };

  const getParticipantName = (participantId: string | number): string => {
    // Mock participant names
    const participants: { [key: string]: string } = {
      '1': 'Dr. Sarah Johnson',
      '2': 'John Smith',
      '3': 'Dr. Michael Chen',
      '4': 'Emily Davis'
    };
    return participants[participantId.toString()] || 'Unknown';
  };

  const filteredChatRooms = chatRooms.filter(chat =>
    searchQuery === '' ||
    getParticipantName(chat.participants.find(p => p !== currentUser.id.toString()) || '0')
      .toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabContent = [
    { label: 'All', rooms: filteredChatRooms },
    { label: 'Unread', rooms: filteredChatRooms.filter(chat => chat.unreadCount > 0) },
    { label: 'Pinned', rooms: filteredChatRooms.filter(chat => chat.isPinned) },
    { label: 'Archived', rooms: filteredChatRooms.filter(chat => chat.isArchived) }
  ];

  return (
    <Box sx={{ height: '80vh', display: 'flex', bgcolor: 'background.paper' }}>
      {/* Chat List */}
      <Paper sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        {/* Search Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
          <Typography variant="h6" gutterBottom>Messages</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #ddd', minHeight: 36 }}
        >
          {tabContent.map((tab, index) => (
            <Tab 
              key={index} 
              label={`${tab.label} (${tab.rooms.length})`} 
              sx={{ minHeight: 36, fontSize: '0.875rem' }}
            />
          ))}
        </Tabs>

        {/* Chat List */}
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {tabContent[activeTab].rooms.map((chat) => {
            const otherParticipant = chat.participants.find(p => p !== currentUser.id.toString());
            const participantName = getParticipantName(otherParticipant || '0');
            
            return (
              <ListItem
                key={chat.id}
                button
                selected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  borderBottom: '1px solid #f0f0f0',
                  '&.Mui-selected': { bgcolor: 'primary.lighter' }
                }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={chat.unreadCount} color="error">
                    <Avatar>
                      {participantName[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: chat.unreadCount > 0 ? 600 : 400 }}>
                        {participantName}
                      </Typography>
                      {chat.isPinned && <Star sx={{ fontSize: 16, color: 'warning.main' }} />}
                      {chat.isArchived && <Archive sx={{ fontSize: 16, color: 'grey.500' }} />}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {chat.lastMessage?.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(chat.lastMessage?.timestamp || '')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Chat Area */}
      {selectedChat ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #ddd',
            bgcolor: 'background.paper'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>
                {getParticipantName(selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0')[0]}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {getParticipantName(selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isTyping ? 'Typing...' : 'Online'}
                  </Typography>
                  {sessionId && (
                    <Chip
                      size="small"
                      label={connectionStatus}
                      color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'error'}
                      icon={connectionStatus === 'connected' ? <CheckCircle /> : connectionStatus === 'connecting' ? <Schedule /> : <ErrorIcon />}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Voice call">
                <IconButton onClick={() => onStartVoiceCall?.(parseInt(selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0'))}>
                  <Phone />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video call">
                <IconButton onClick={() => onStartVideoCall?.(parseInt(selectedChat.participants.find(p => p !== currentUser.id.toString()) || '0'))}>
                  <VideoCall />
                </IconButton>
              </Tooltip>
              <Tooltip title="More options">
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.senderId === currentUser.id.toString() ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: msg.senderId === currentUser.id.toString() ? 'primary.main' : 'grey.100',
                      color: msg.senderId === currentUser.id.toString() ? 'white' : 'text.primary',
                      borderRadius: 2,
                      position: 'relative'
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMessageMenu({ anchorEl: e.currentTarget as HTMLElement, messageId: msg.id });
                    }}
                  >
                    {msg.type === 'text' && (
                      <Typography variant="body2">{msg.content}</Typography>
                    )}
                    
                    {msg.type === 'voice' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                        <IconButton size="small" sx={{ color: 'inherit' }}>
                          <PlayArrow />
                        </IconButton>
                        <LinearProgress variant="determinate" value={0} sx={{ flex: 1 }} />
                        <Typography variant="caption">{msg.content}</Typography>
                      </Box>
                    )}
                    
                    {msg.type === 'image' && msg.attachments && (
                      <Box>
                        <img 
                          src={msg.attachments[0].url} 
                          alt={msg.attachments[0].name}
                          style={{ maxWidth: '100%', borderRadius: 8 }}
                        />
                        <Typography variant="caption" display="block" mt={1}>
                          {msg.attachments[0].name}
                        </Typography>
                      </Box>
                    )}
                    
                    {msg.type === 'file' && msg.attachments && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachFile />
                        <Box>
                          <Typography variant="body2">{msg.attachments[0].name}</Typography>
                          <Typography variant="caption">
                            {(msg.attachments[0].size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                        <IconButton size="small" sx={{ color: 'inherit' }}>
                          <Download />
                        </IconButton>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatTime(msg.timestamp)}
                      </Typography>
                      {msg.senderId === currentUser.id.toString() && (
                        <Box sx={{ ml: 1 }}>
                          {getMessageIcon(msg)}
                        </Box>
                      )}
                    </Box>
                    
                    {msg.isEncrypted && (
                      <Lock sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4, 
                        fontSize: 12, 
                        opacity: 0.5 
                      }} />
                    )}
                  </Paper>
                </ListItem>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
            {isRecording && (
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={stopRecording}>
                    Stop ({formatRecordingTime(recordingDuration)})
                  </Button>
                }
              >
                Recording voice message...
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                disabled={isRecording}
              />
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                
                <Tooltip title="Attach file">
                  <IconButton
                    onClick={(e) => setAttachmentMenu(e.currentTarget)}
                    disabled={isRecording}
                  >
                    <AttachFile />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Voice message">
                  <IconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    color={isRecording ? 'error' : 'default'}
                  >
                    {isRecording ? <Stop /> : <MicNone />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Send message">
                  <IconButton
                    onClick={sendMessage}
                    disabled={!message.trim() || isRecording}
                    color="primary"
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'text.secondary'
        }}>
          <Typography variant="h5" gutterBottom>
            Select a conversation
          </Typography>
          <Typography variant="body1">
            Choose a chat from the sidebar to start messaging
          </Typography>
        </Box>
      )}

      {/* Attachment Menu */}
      <Menu
        anchorEl={attachmentMenu}
        open={Boolean(attachmentMenu)}
        onClose={() => setAttachmentMenu(null)}
      >
        <MenuItem onClick={() => { fileInputRef.current?.click(); setAttachmentMenu(null); }}>
          <AttachFile sx={{ mr: 1 }} /> File
        </MenuItem>
        <MenuItem onClick={() => { 
          fileInputRef.current?.setAttribute('accept', 'image/*'); 
          fileInputRef.current?.click(); 
          setAttachmentMenu(null); 
        }}>
          <PhotoCamera sx={{ mr: 1 }} /> Photo
        </MenuItem>
      </Menu>

      {/* Message Context Menu */}
      <Menu
        anchorEl={messageMenu?.anchorEl}
        open={Boolean(messageMenu)}
        onClose={() => setMessageMenu(null)}
      >
        <MenuItem onClick={() => setMessageMenu(null)}>
          <Reply sx={{ mr: 1 }} /> Reply
        </MenuItem>
        <MenuItem onClick={() => setMessageMenu(null)}>
          <Forward sx={{ mr: 1 }} /> Forward
        </MenuItem>
        <MenuItem onClick={() => setMessageMenu(null)}>
          <Star sx={{ mr: 1 }} /> Star
        </MenuItem>
        <MenuItem onClick={() => setMessageMenu(null)}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessagingSystem;