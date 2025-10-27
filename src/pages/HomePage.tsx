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

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Book the best-priced telehealth appointment today.
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Find top-rated doctors available today. Pay less than anywhere else.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/booking')}
          sx={{ px: 4, py: 2 }}
        >
          Find Telehealth Appointment
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;