import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Chip,
  Avatar,
  Paper,
  Divider,
  Button,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Phone,
  Email,
  LocationOn,
  Security,
  Verified,
  SmartToy,
  MedicalServices,
  Psychology,
  LocalHospital,
  WhatsApp,
  Chat,
  Help,
  Support,
  QuestionAnswer,
  LiveHelp,
  ContactSupport,
  Schedule,
  AccessTime,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/1234567890?text=Hi%20I%20need%20help%20with%20Telehealth%20Portal', '_blank');
  };

  const handleLiveChatClick = () => {
    setLiveChatOpen(true);
  };

  const quickHelpOptions = [
    {
      icon: <QuestionAnswer />,
      title: 'FAQ',
      description: 'Find answers to common questions',
      action: () => navigate('/faq')
    },
    {
      icon: <Schedule />,
      title: 'Book Appointment',
      description: 'Schedule your consultation',
      action: () => navigate('/booking')
    },
    {
      icon: <MedicalServices />,
      title: 'Find Doctor',
      description: 'Browse available specialists',
      action: () => navigate('/doctors')
    },
    {
      icon: <Support />,
      title: 'Technical Support',
      description: 'Get help with the platform',
      action: () => setHelpDialogOpen(true)
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
        color: 'white',
        py: 8,
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4caf50, #2196f3, #ff9800)',
        }
      }}
    >
      <Container maxWidth="lg">
        {/* Smart Telehealth Algorithm Banner */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              display: 'inline-block',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <SmartToy sx={{ fontSize: 40, color: '#4caf50' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                Smart Telehealth Algorithm
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              AI-powered matching system connects you with the perfect healthcare professional based on your needs, location, and medical history.
            </Typography>
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {/* Company Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <MedicalServices sx={{ fontSize: 32, color: '#4caf50' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Telehealth Portal
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Revolutionizing healthcare accessibility with cutting-edge technology.
              Connect with licensed doctors and specialists from anywhere, anytime.
              Our platform ensures secure, confidential, and personalized medical care.
            </Typography>
            
            {/* Certification Badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                icon={<Verified sx={{ color: '#4caf50' }} />}
                label="HIPAA Compliant"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: '#4caf50',
                  '& .MuiChip-icon': { color: '#4caf50' }
                }}
              />
              <Chip
                icon={<Security sx={{ color: '#2196f3' }} />}
                label="SSL Secured"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: '#2196f3',
                  '& .MuiChip-icon': { color: '#2196f3' }
                }}
              />
            </Box>
          </Grid>
          
          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/services" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices sx={{ fontSize: 18 }} />
                Online Consultations
              </Link>
              <Link href="/services" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology sx={{ fontSize: 18 }} />
                Mental Health
              </Link>
              <Link href="/services" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital sx={{ fontSize: 18 }} />
                Urgent Care
              </Link>
              <Link href="/services" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Verified sx={{ fontSize: 18 }} />
                Prescription Refills
              </Link>
            </Box>
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#ff9800' }} />
                <Typography variant="body1">
                  <Link href="tel:+1234567890" color="inherit" underline="hover">
                    +1 (234) 567-8900
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#ff9800' }} />
                <Typography variant="body1">
                  <Link href="mailto:support@telehealthportal.com" color="inherit" underline="hover">
                    support@telehealthportal.com
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ color: '#ff9800' }} />
                <Typography variant="body1">
                  123 Healthcare Ave<br />
                  Medical District, MD 12345
                </Typography>
              </Box>
            </Box>
            
            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="inherit" aria-label="Facebook" sx={{ '&:hover': { color: '#1877f2' } }}>
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" aria-label="Twitter" sx={{ '&:hover': { color: '#1da1f2' } }}>
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" aria-label="LinkedIn" sx={{ '&:hover': { color: '#0077b5' } }}>
                  <LinkedIn />
                </IconButton>
                <IconButton color="inherit" aria-label="Instagram" sx={{ '&:hover': { color: '#e4405f' } }}>
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Modern Help Center */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
              Help Center
            </Typography>

            {/* Quick Help Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                sx={{
                  background: 'linear-gradient(45deg, #25d366, #128c7e)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #128c7e, #075e54)',
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                WhatsApp Support
              </Button>

              <Button
                variant="outlined"
                startIcon={<Chat />}
                onClick={handleLiveChatClick}
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Live Chat
              </Button>

              <Button
                variant="text"
                startIcon={<Help />}
                onClick={() => setHelpDialogOpen(true)}
                sx={{
                  color: '#ff9800',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.04)',
                  },
                  textTransform: 'none',
                }}
              >
                Quick Help
              </Button>
            </Box>

            {/* Emergency Contact */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Warning sx={{ color: '#f44336', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                  Emergency
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#f44336', mb: 1 }}>
                For medical emergencies, call:
              </Typography>
              <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                911
              </Typography>
            </Paper>

            {/* AI Support Badge */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Chip
                icon={<SmartToy sx={{ color: '#4caf50' }} />}
                label="AI-Powered Support"
                variant="outlined"
                sx={{
                  color: '#4caf50',
                  borderColor: '#4caf50',
                  background: 'rgba(76, 175, 80, 0.1)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            © 2024 Telehealth Portal. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Powered by advanced AI healthcare technology for better patient outcomes.
          </Typography>
        </Box>
      </Container>

      {/* Help Center Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1a237e, #0d47a1)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LiveHelp sx={{ fontSize: 28 }} />
            Quick Help Center
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Get instant help with our AI-powered support system. Choose from the options below:
          </Typography>

          <Grid container spacing={2}>
            {quickHelpOptions.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                      border: '1px solid #4caf50',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={option.action}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#4caf50' }}>
                      {option.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, color: '#4caf50' }}>
            Need More Help?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={handleWhatsAppClick}
              sx={{ background: 'linear-gradient(45deg, #25d366, #128c7e)' }}
            >
              WhatsApp Chat
            </Button>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              href="tel:+1234567890"
            >
              Call Support
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              href="mailto:support@telehealthportal.com"
            >
              Email Support
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog
        open={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #2196f3, #1976d2)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chat sx={{ fontSize: 28 }} />
            Live Chat Support
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ContactSupport sx={{ fontSize: 64, color: '#2196f3', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Connect with Our Support Team
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Our AI-powered chat system is currently connecting you with a healthcare support specialist.
              Average wait time: 2 minutes.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Chip
                icon={<AccessTime />}
                label="Connecting..."
                sx={{ backgroundColor: '#fff3e0', color: '#f57c00' }}
              />
              <Chip
                icon={<CheckCircle />}
                label="AI-Powered"
                sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              While you wait, feel free to browse our FAQ section or contact us via WhatsApp for immediate assistance.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLiveChatOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsAppClick}
            sx={{ background: 'linear-gradient(45deg, #25d366, #128c7e)' }}
          >
            Use WhatsApp Instead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating WhatsApp Button */}
      <Fab
        color="primary"
        aria-label="whatsapp"
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

      {/* Floating Help Button */}
      <Tooltip title="FAQ & Help" placement="left">
        <Fab
          color="secondary"
          aria-label="help"
          onClick={() => navigate('/faq')}
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            background: 'linear-gradient(45deg, #ff9800, #f57c00)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f57c00, #e65100)',
            },
            zIndex: 1000,
          }}
        >
          <Help sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default Footer;