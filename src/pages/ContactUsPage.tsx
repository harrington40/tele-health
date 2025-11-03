import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  WhatsApp,
  Chat,
  Schedule,
  Support,
  Send,
  CheckCircle,
  AccessTime,
  Language,
  Security,
  Verified,
} from '@mui/icons-material';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSnackbarOpen(true);
    setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm contacting you through your telehealth platform. I need assistance.");
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}?subject=Support Request`;
  };

  const contactMethods = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Instant messaging support',
      icon: <WhatsApp sx={{ fontSize: 40, color: '#25d366' }} />,
      action: handleWhatsAppClick,
      available: '24/7',
      responseTime: 'Usually within 5 minutes',
      color: '#25d366',
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone sx={{ fontSize: 40, color: '#1976d2' }} />,
      action: () => handlePhoneCall('+1-234-567-8900'),
      available: 'Mon-Fri 8AM-8PM EST',
      responseTime: 'Immediate connection',
      color: '#1976d2',
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Detailed inquiries and documentation',
      icon: <Email sx={{ fontSize: 40, color: '#ff9800' }} />,
      action: () => handleEmailClick('support@telehealthportal.com'),
      available: '24/7',
      responseTime: 'Within 24 hours',
      color: '#ff9800',
    },
    {
      id: 'livechat',
      title: 'Live Chat',
      description: 'Real-time text support',
      icon: <Chat sx={{ fontSize: 40, color: '#4caf50' }} />,
      action: () => setSelectedContact('livechat'),
      available: 'Mon-Fri 9AM-6PM EST',
      responseTime: 'Usually within 2 minutes',
      color: '#4caf50',
    },
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Healthcare Ave, Medical District, NY 10001',
      phone: '+1 (212) 555-0123',
      email: 'ny@telehealthportal.com',
      hours: 'Mon-Fri 8AM-8PM EST',
    },
    {
      city: 'Los Angeles',
      address: '456 Wellness Blvd, Health Plaza, CA 90210',
      phone: '+1 (310) 555-0456',
      email: 'la@telehealthportal.com',
      hours: 'Mon-Fri 8AM-8PM PST',
    },
    {
      city: 'London',
      address: '789 NHS Street, Healthcare Quarter, London EC1A 1BB',
      phone: '+44 20 7946 0123',
      email: 'uk@telehealthportal.com',
      hours: 'Mon-Fri 9AM-5PM GMT',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
          Contact Us
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Get in touch with our healthcare support team
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          We're here to help you with any questions about our telehealth services.
          Choose the contact method that works best for you.
        </Typography>
      </Box>

      {/* Contact Methods */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {contactMethods.map((method) => (
          <Grid item xs={12} sm={6} md={3} key={method.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  border: `2px solid ${method.color}`,
                },
                border: selectedContact === method.id ? `2px solid ${method.color}` : 'none',
              }}
              onClick={method.action}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: `${method.color}20`,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {method.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {method.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {method.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={method.available}
                    size="small"
                    sx={{ mb: 1, fontSize: '0.7rem' }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {method.responseTime}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: method.color,
                    '&:hover': { backgroundColor: method.color, opacity: 0.9 },
                  }}
                >
                  Contact Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Contact Form */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Send us a Message
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please describe your inquiry in detail..."
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Send />}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #0d47a1)',
                  },
                }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Office Locations */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Offices
        </Typography>
        <Grid container spacing={3}>
          {offices.map((office, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                  {office.city} Office
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <LocationOn sx={{ color: '#ff9800', mt: 0.5 }} />
                  <Typography variant="body2">{office.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Phone sx={{ color: '#4caf50' }} />
                  <Typography variant="body2">{office.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Email sx={{ color: '#ff5722' }} />
                  <Typography variant="body2">{office.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime sx={{ color: '#9c27b0' }} />
                  <Typography variant="body2">{office.hours}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Emergency Contact */}
      <Alert
        severity="warning"
        sx={{
          mb: 4,
          borderRadius: 3,
          '& .MuiAlert-icon': { fontSize: '2rem' }
        }}
        icon={<Support />}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Medical Emergency?
        </Typography>
        <Typography variant="body1">
          If you have a medical emergency, please call 911 immediately or go to your nearest emergency room.
          Our telehealth services are not a substitute for emergency medical care.
        </Typography>
      </Alert>

      {/* Floating WhatsApp Button */}
      <Tooltip title="WhatsApp Support" placement="left">
        <Fab
          onClick={handleWhatsAppClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #25d366, #128c7e)',
            '&:hover': {
              background: 'linear-gradient(45deg, #128c7e, #075e54)',
            },
            zIndex: 1000,
          }}
        >
          <WhatsApp sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
          icon={<CheckCircle />}
        >
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUsPage;