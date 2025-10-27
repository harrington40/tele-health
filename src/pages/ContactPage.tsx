import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  WhatsApp,
  Chat,
  VideoCall,
  Schedule,
  AccessTime,
  Send,
  AttachFile,
  EmojiEmotions,
  Support,
  LiveHelp,
  Headset,
  Language,
  Security,
  Groups,
  CheckCircle,
  Close
} from '@mui/icons-material';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    urgency: 'normal'
  });
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      title: 'WhatsApp Support',
      description: 'Get instant help via WhatsApp',
      icon: <WhatsApp />,
      contact: '+1 (555) 123-HELP',
      action: () => window.open('https://wa.me/15551234357?text=Hello, I need help with the telehealth platform', '_blank'),
      available: '24/7',
      responseTime: 'Immediate',
      color: '#25D366',
      popular: true
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support agents',
      icon: <LiveHelp />,
      contact: 'Available in app',
      action: () => setShowLiveChat(true),
      available: '6 AM - 10 PM EST',
      responseTime: '< 2 minutes',
      color: '#2196F3',
      popular: true
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone />,
      contact: '+1 (555) 123-4567',
      action: () => window.open('tel:+15551234567'),
      available: '8 AM - 8 PM EST',
      responseTime: 'Immediate',
      color: '#4CAF50',
      popular: false
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Email />,
      contact: 'support@telehealth.com',
      action: () => window.open('mailto:support@telehealth.com'),
      available: 'Always',
      responseTime: '< 24 hours',
      color: '#FF9800',
      popular: false
    },
    {
      title: 'Video Support',
      description: 'Screen sharing for technical issues',
      icon: <VideoCall />,
      contact: 'Schedule a session',
      action: () => {},
      available: 'By appointment',
      responseTime: 'Scheduled',
      color: '#9C27B0',
      popular: false
    },
    {
      title: 'Emergency Line',
      description: 'For urgent technical issues during consultations',
      icon: <Support />,
      contact: '+1 (555) 911-TECH',
      action: () => window.open('tel:+15559113824'),
      available: '24/7',
      responseTime: 'Immediate',
      color: '#F44336',
      popular: false
    }
  ];

  const supportTeam = [
    {
      name: 'Sarah Johnson',
      role: 'Technical Support Lead',
      specialties: ['Video calls', 'App issues', 'Account setup'],
      avatar: '/api/placeholder/64/64',
      languages: ['English', 'Spanish'],
      rating: 4.9
    },
    {
      name: 'Michael Chen',
      role: 'Medical Platform Specialist',
      specialties: ['Medical records', 'Prescriptions', 'Privacy'],
      avatar: '/api/placeholder/64/64',
      languages: ['English', 'Mandarin'],
      rating: 4.8
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient Experience Manager',
      specialties: ['Appointments', 'Billing', 'General help'],
      avatar: '/api/placeholder/64/64',
      languages: ['English', 'Spanish', 'French'],
      rating: 4.9
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        urgency: 'normal'
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Contact Us 📞
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          We're here to help! Choose your preferred way to get in touch with our support team
        </Typography>
      </Box>

      {/* Popular Contact Methods */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          🔥 Most Popular Ways to Reach Us
        </Typography>
        <Grid container spacing={3}>
          {contactMethods.filter(method => method.popular).map((method, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: 'transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    borderColor: method.color
                  }
                }}
                onClick={method.action}
              >
                <Chip
                  label="Popular"
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold'
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: method.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {method.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {method.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {method.contact}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Chip 
                        label={`Available: ${method.available}`} 
                        size="small" 
                        variant="outlined"
                        icon={<AccessTime />}
                      />
                      <Chip 
                        label={`Response: ${method.responseTime}`} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: method.color,
                      '&:hover': { bgcolor: method.color, opacity: 0.9 }
                    }}
                  >
                    Contact Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              📝 Send Us a Message
            </Typography>
            
            {submitted ? (
              <Alert 
                severity="success" 
                sx={{ mb: 3 }}
                icon={<CheckCircle />}
              >
                <Typography variant="h6" gutterBottom>
                  Message Sent Successfully! 🎉
                </Typography>
                <Typography>
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </Typography>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        label="Category"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      >
                        <MenuItem value="technical">Technical Support</MenuItem>
                        <MenuItem value="billing">Billing & Payments</MenuItem>
                        <MenuItem value="medical">Medical Records</MenuItem>
                        <MenuItem value="appointments">Appointments</MenuItem>
                        <MenuItem value="general">General Inquiry</MenuItem>
                        <MenuItem value="emergency">Emergency Support</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Urgency Level</InputLabel>
                      <Select
                        value={formData.urgency}
                        label="Urgency Level"
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                      >
                        <MenuItem value="low">Low - General question</MenuItem>
                        <MenuItem value="normal">Normal - Standard support</MenuItem>
                        <MenuItem value="high">High - Urgent issue</MenuItem>
                        <MenuItem value="critical">Critical - Emergency</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please describe your issue or question in detail..."
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={isSubmitting}
                      sx={{
                        mr: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        fontWeight: 'bold'
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AttachFile />}
                      disabled={isSubmitting}
                    >
                      Attach File
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Card>
        </Grid>

        {/* All Contact Methods */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            🌟 All Contact Options
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 3
                  }
                }}
                onClick={method.action}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: method.color,
                        width: 40,
                        height: 40,
                        mr: 2
                      }}
                    >
                      {method.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {method.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.contact}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={method.available} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={method.responseTime} 
                      size="small" 
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Support Team */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          👥 Meet Our Support Team
        </Typography>
        <Grid container spacing={3}>
          {supportTeam.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    src={member.avatar}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                      Specialties:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {member.specialties.map((specialty, idx) => (
                        <Chip key={idx} label={specialty} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Language fontSize="small" />
                      <Typography variant="caption">
                        {member.languages.join(', ')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="caption">
                        {member.rating} rating
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Live Chat Dialog */}
      <Dialog
        open={showLiveChat}
        onClose={() => setShowLiveChat(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LiveHelp color="primary" />
            Live Chat Support
          </Box>
          <IconButton onClick={() => setShowLiveChat(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You're connected to our live chat. Average response time is under 2 minutes.
          </Alert>
          
          <Box sx={{ 
            height: 300, 
            border: '1px solid #ddd', 
            borderRadius: 1, 
            p: 2, 
            mb: 2,
            backgroundColor: '#f5f5f5'
          }}>
            <Typography variant="body2" color="text.secondary">
              Chat messages will appear here...
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              size="small"
            />
            <IconButton color="primary">
              <EmojiEmotions />
            </IconButton>
            <IconButton color="primary">
              <AttachFile />
            </IconButton>
            <Button variant="contained" startIcon={<Send />}>
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Floating Button */}
      <Tooltip title="WhatsApp Technical Support" placement="left">
        <Fab
          color="success"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#128C7E' }
          }}
          onClick={() => window.open('https://wa.me/15551234357?text=Hello, I need technical support with the telehealth platform', '_blank')}
        >
          <WhatsApp />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default ContactPage;