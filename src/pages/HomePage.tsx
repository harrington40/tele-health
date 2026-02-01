import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  LocalPharmacy,
  Psychology,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <VideoCall sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Video Consultations',
      description: 'Connect with licensed doctors through secure video calls',
      price: 'From $34',
    },
    {
      icon: <LocalPharmacy sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Prescription Refills',
      description: 'Get your prescriptions renewed quickly and easily',
      price: 'From $37',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Mental Health',
      description: 'Access mental health support and therapy sessions',
      price: 'From $47',
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Same-Day Visits',
      description: 'Book and see a doctor on the same day',
      price: 'From $50',
    },
  ];

  const popularServices = [
    'Telehealth Visit',
    'Weight Loss Program',
    'Prescription Refill',
    'UTI Treatment',
    'Mental Health Consult',
    'Urgent Care',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h1" component="h1" gutterBottom>
            Half-price healthcare is here.
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            See a doctor same-day for as low as $34.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/booking')}
              sx={{ 
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                }
              }}
            >
              Book Appointment
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/doctors')}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Find Doctors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular Services */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Popular Services
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            justifyContent: 'center',
            mb: 6 
          }}
        >
          {popularServices.map((service) => (
            <Chip
              key={service}
              label={service}
              variant="outlined"
              clickable
              onClick={() => navigate('/services')}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                className="feature-card"
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {feature.description}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {feature.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate('/booking')}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Membership Options */}
      <Box sx={{ backgroundColor: 'primary.light', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ color: 'white' }}>
            Choose Your Care Option
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Membership Plan
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  From $37/visit
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  $10 off all visits, free lab for annual members, dedicated care team
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Only $8.25/month
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/membership')}>
                  Learn More
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  One-Time Visit
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  From $47/visit
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Telehealth or in-person visit with a provider, prescription or lab referral if needed
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/booking')}>
                  Book Now
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                4.9
              </Typography>
              <Typography variant="body1">
                App Store Rating
              </Typography>
              <Rating value={4.9} readOnly precision={0.1} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                383
              </Typography>
              <Typography variant="body1">
                Services Available
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                95%
              </Typography>
              <Typography variant="body1">
                Patient Satisfaction
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                36
              </Typography>
              <Typography variant="body1">
                Specialties Offered
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          What Our Patients Say
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Rating value={5} readOnly />
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                "I have a busy schedule and high deductible insurance, the affordability of this service is amazing and my doctor was great! I'll book again and again."
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Andrea, Kansas City, KS
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Rating value={5} readOnly />
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                "Sesame made getting healthcare so easy and affordable. The doctor was professional and the video call was seamless."
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Michael, New York, NY
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Rating value={5} readOnly />
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                "Finally, healthcare that fits my budget! The mental health support has been life-changing."
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Sarah, Los Angeles, CA
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              p: 6,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Schedule sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Book the Best-Priced Telehealth Appointment Today
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
              >
                Find top-rated doctors available today. Pay less than anywhere else with our transparent pricing and no hidden fees.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip
                  icon={<CheckCircle sx={{ color: 'success.main' }} />}
                  label="No Insurance Required"
                  variant="outlined"
                  sx={{ borderColor: 'success.main', color: 'success.main' }}
                />
                <Chip
                  icon={<CheckCircle sx={{ color: 'success.main' }} />}
                  label="Same-Day Appointments"
                  variant="outlined"
                  sx={{ borderColor: 'success.main', color: 'success.main' }}
                />
                <Chip
                  icon={<CheckCircle sx={{ color: 'success.main' }} />}
                  label="Licensed Doctors"
                  variant="outlined"
                  sx={{ borderColor: 'success.main', color: 'success.main' }}
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/booking')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<VideoCall />}
              >
                Find Telehealth Appointment
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ✓ Free consultation • ✓ Secure & HIPAA compliant • ✓ 24/7 support
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;