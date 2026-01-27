import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Chip,
  Paper,
  Divider,
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
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
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
          
          {/* Support & Legal */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
              Support & Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                component="button"
                onClick={() => navigate('/help')}
                sx={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0,
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main'
                  }
                }}
              >
                Help Center
              </Box>
              <RouterLink
                to="/contact"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2196f3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}
              >
                Contact Us
              </RouterLink>
              <RouterLink
                to="/privacy"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2196f3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}
              >
                Privacy Policy
              </RouterLink>
              <RouterLink
                to="/terms"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2196f3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}
              >
                Terms of Service
              </RouterLink>
              <RouterLink
                to="/hipaa"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2196f3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}
              >
                HIPAA Compliance
              </RouterLink>
              <RouterLink
                to="/accessibility"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2196f3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}
              >
                Accessibility
              </RouterLink>
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
    </Box>
  );
};

export default Footer;