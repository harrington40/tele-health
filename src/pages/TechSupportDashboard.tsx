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
  Chip,
  IconButton,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  SupportAgent,
  Chat,
  Notifications,
  CheckCircle,
  HourglassEmpty,
  Error,
  Search,
  Send,
  Phone,
  VideoCall,
  Email,
  Assignment,
  PriorityHigh,
  MoreVert,
  FilterList,
  Refresh,
  PersonAdd,
  Settings,
  Analytics,
  Help
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import MessagingSystem from '../components/MessagingSystem';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'medical' | 'general';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  unreadCount: number;
}

interface UserSession {
  userId: string;
  userName: string;
  userEmail: string;
  status: 'online' | 'away' | 'offline';
  currentPage: string;
  lastActivity: Date;
  needsHelp: boolean;
}

const TechSupportDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  // Mock data - replace with real API calls
  useEffect(() => {
    // Mock support tickets
    const mockTickets: SupportTicket[] = [
      {
        id: 't1',
        userId: 'u1',
        userName: 'John Doe',
        userEmail: 'john.doe@email.com',
        subject: 'Cannot login to my account',
        message: 'I keep getting "Invalid credentials" error when trying to login.',
        status: 'open',
        priority: 'high',
        category: 'technical',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 1
      },
      {
        id: 't2',
        userId: 'u2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@email.com',
        subject: 'Billing question about subscription',
        message: 'I was charged twice for my monthly subscription.',
        status: 'in-progress',
        priority: 'medium',
        category: 'billing',
        assignedTo: user?.firstName + ' ' + user?.lastName,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        lastMessage: 'I will check your billing history.',
        unreadCount: 0
      },
      {
        id: 't3',
        userId: 'u3',
        userName: 'Bob Johnson',
        userEmail: 'bob.johnson@email.com',
        subject: 'Video call not working',
        message: 'Camera and microphone permissions are denied.',
        status: 'open',
        priority: 'urgent',
        category: 'technical',
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        updatedAt: new Date(Date.now() - 1000 * 60 * 45),
        unreadCount: 2
      }
    ];
    setTickets(mockTickets);

    // Mock active sessions
    const mockSessions: UserSession[] = [
      {
        userId: 'u4',
        userName: 'Alice Williams',
        userEmail: 'alice@email.com',
        status: 'online',
        currentPage: '/booking',
        lastActivity: new Date(),
        needsHelp: false
      },
      {
        userId: 'u5',
        userName: 'Charlie Brown',
        userEmail: 'charlie@email.com',
        status: 'online',
        currentPage: '/dashboard',
        lastActivity: new Date(Date.now() - 1000 * 60 * 5),
        needsHelp: true
      }
    ];
    setActiveSessions(mockSessions);
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    // Mark as read
    setTickets(prev =>
      prev.map(t => (t.id === ticket.id ? { ...t, unreadCount: 0 } : t))
    );
  };

  const handleStartChat = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowChat(true);
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    console.log('Sending reply to ticket:', selectedTicket.id, replyMessage);
    
    // Update ticket status
    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicket.id
          ? { ...t, status: 'in-progress', assignedTo: user?.firstName + ' ' + user?.lastName, lastMessage: replyMessage }
          : t
      )
    );

    setReplyMessage('');
    alert('Reply sent successfully!');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? { ...t, status: 'resolved', updatedAt: new Date() }
          : t
      )
    );
    setSelectedTicket(null);
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
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Error />;
      case 'in-progress': return <HourglassEmpty />;
      case 'resolved': return <CheckCircle />;
      case 'closed': return <CheckCircle />;
      default: return <HourglassEmpty />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    const searchMatch = searchQuery === '' ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTodayCount = tickets.filter(t => 
    t.status === 'resolved' && 
    new Date(t.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgent sx={{ fontSize: 40 }} />
          Tech Support Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.firstName}! Manage customer support tickets and assist users.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {openTicketsCount}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Open Tickets
                  </Typography>
                </Box>
                <Error sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {inProgressCount}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    In Progress
                  </Typography>
                </Box>
                <HourglassEmpty sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {resolvedTodayCount}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Resolved Today
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="white">
                    {activeSessions.length}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Active Users
                  </Typography>
                </Box>
                <PersonAdd sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Tickets List */}
        <Grid item xs={12} md={selectedTicket ? 5 : 8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="All Tickets" />
                <Tab label="Active Sessions" />
                <Tab label="Analytics" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <>
                {/* Filters */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={filterPriority}
                      label="Priority"
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton>
                    <Refresh />
                  </IconButton>
                </Box>

                {/* Tickets List */}
                <List>
                  {filteredTickets.map((ticket) => (
                    <React.Fragment key={ticket.id}>
                      <ListItem
                        button
                        onClick={() => handleTicketClick(ticket)}
                        selected={selectedTicket?.id === ticket.id}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge badgeContent={ticket.unreadCount} color="error">
                            <Avatar>{ticket.userName[0]}</Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {ticket.subject}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Chip
                                  size="small"
                                  label={ticket.priority}
                                  color={getPriorityColor(ticket.priority) as any}
                                />
                                <Chip
                                  size="small"
                                  icon={getStatusIcon(ticket.status)}
                                  label={ticket.status}
                                  color={getStatusColor(ticket.status) as any}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {ticket.userName} • {ticket.userEmail}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(ticket.createdAt).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                        <IconButton onClick={() => handleStartChat(ticket)}>
                          <Chat />
                        </IconButton>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}

            {activeTab === 1 && (
              <List>
                {activeSessions.map((session) => (
                  <ListItem key={session.userId}>
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        color={session.status === 'online' ? 'success' : 'default'}
                      >
                        <Avatar>{session.userName[0]}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={session.userName}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {session.userEmail} • {session.currentPage}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last activity: {new Date(session.lastActivity).toLocaleTimeString()}
                          </Typography>
                        </>
                      }
                    />
                    {session.needsHelp && (
                      <Chip label="Needs Help" color="warning" size="small" />
                    )}
                    <IconButton>
                      <Chat />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}

            {activeTab === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Analytics sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coming soon...
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Ticket Details */}
        {selectedTicket && (
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {selectedTicket.subject}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      size="small"
                      label={selectedTicket.priority}
                      color={getPriorityColor(selectedTicket.priority) as any}
                    />
                    <Chip
                      size="small"
                      icon={getStatusIcon(selectedTicket.status)}
                      label={selectedTicket.status}
                      color={getStatusColor(selectedTicket.status) as any}
                    />
                    <Chip size="small" label={selectedTicket.category} variant="outlined" />
                  </Box>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar>{selectedTicket.userName[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {selectedTicket.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedTicket.userEmail}
                    </Typography>
                  </Box>
                </Box>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body1">
                    {selectedTicket.message}
                  </Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Reply Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Reply to Customer
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your response here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                  >
                    Send Reply
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Chat />}
                    onClick={() => handleStartChat(selectedTicket)}
                  >
                    Start Live Chat
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideoCall />}
                  >
                    Video Call
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    disabled={selectedTicket.status === 'resolved'}
                  >
                    Mark Resolved
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Chat Dialog */}
      <Dialog
        open={showChat}
        onClose={() => setShowChat(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Live Chat with {selectedTicket?.userName}
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <MessagingSystem
              currentUser={{
                id: Number(user?.id) || 0,
                role: 'doctor',
                name: `${user?.firstName} ${user?.lastName}`,
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChat(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TechSupportDashboard;
