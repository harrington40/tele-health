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
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Modern Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #00BFA5 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: 32, md: 48 } }}>
            Access top-rated doctors anytime, anywhere — <span style={{ color: '#FFD600' }}>affordable</span>, secure, and fast.
          </Typography>
          <Typography variant="h5" component="h2" sx={{ opacity: 0.95, mb: 4, fontWeight: 400 }}>
            Connect instantly with licensed professionals — no waiting rooms, no paperwork.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/booking')}
              sx={{
                background: 'linear-gradient(90deg, #007AFF 0%, #00BFA5 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20,
                px: 5,
                py: 2.5,
                borderRadius: 99,
                boxShadow: 3,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #00BFA5 0%, #007AFF 100%)',
                  boxShadow: 6,
                },
              }}
              startIcon={<span style={{ fontSize: 24 }}>👉</span>}
            >
              FIND A DOCTOR NOW
            </Button>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.85, fontSize: 18 }}>
            Or <Button color="inherit" onClick={() => navigate('/doctors')} sx={{ textDecoration: 'underline', color: 'white', fontWeight: 500 }}>browse all doctors</Button>
          </Typography>
          {/* Optional: Add a soft medical illustration or floating icons here for extra polish */}
        </Container>
        {/* Decorative background illustration (optional) */}
        <Box sx={{
          position: 'absolute',
          right: -120,
          top: 40,
          width: 340,
          height: 340,
          opacity: 0.12,
          zIndex: 1,
          background: 'radial-gradient(circle at 60% 40%, #fff 0%, #00BFA5 60%, transparent 100%)',
          borderRadius: '50%',
        }} />
      </Box>


      {/* AI/Algorithm Highlight Section */}
      <Box sx={{
        background: 'linear-gradient(90deg, #007AFF 0%, #00BFA5 100%)',
        py: { xs: 6, md: 8 },
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        mb: 0
      }} id="ai">
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00BFA5 0%, #007AFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 4,
              mb: 2,
              animation: 'pulse 1.5s infinite',
            }}>
              <span style={{ fontSize: 44, color: '#4CAF50', filter: 'drop-shadow(0 0 8px #4CAF50)' }}>🤖</span>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Our AI-powered system connects you to the right specialist — faster, smarter, safer.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, mb: 2 }}>
              Experience next-generation telehealth: instant doctor matching, optimized scheduling, and secure care — all powered by our Smart Telehealth Algorithm.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                borderRadius: 99,
                px: 4,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: '#FFD600',
                  color: '#FFD600',
                },
              }}
              onClick={() => navigate('/services')}
            >
              Learn how it works
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular Services & Features Grid */}
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
                  p: 2,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px) scale(1.03)',
                  },
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

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }} id="testimonials">
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            What Our Users Say
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'center', mt: 4 }}>
            {/* Simple slider with 2–3 testimonials */}
            <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 2, p: 4, minWidth: 260, maxWidth: 340 }}>
              <Typography variant="body1" fontStyle="italic" gutterBottom>
                “I booked an appointment in 2 minutes — the doctor was amazing!”
              </Typography>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                ⭐⭐⭐⭐⭐ — Jane T., Orlando
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 2, p: 4, minWidth: 260, maxWidth: 340 }}>
              <Typography variant="body1" fontStyle="italic" gutterBottom>
                “The AI matched me to the perfect specialist. No waiting, no hassle!”
              </Typography>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                ⭐⭐⭐⭐⭐ — Mark S., Austin
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 2, p: 4, minWidth: 260, maxWidth: 340, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body1" fontStyle="italic" gutterBottom>
                “Affordable, fast, and secure. I’ll never go back to waiting rooms!”
              </Typography>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                ⭐⭐⭐⭐⭐ — Priya R., Seattle
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* App Download Section */}
      <Box sx={{ bgcolor: 'white', py: 6, borderTop: '1px solid #e0e7ef', borderBottom: '1px solid #e0e7ef' }} id="download">
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Download Our App
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Get care on the go. Book, chat, and consult from your phone — anytime, anywhere.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <a href="#" aria-label="Download on the App Store">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{ height: 48 }} />
            </a>
            <a href="#" aria-label="Get it on Google Play">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 48 }} />
            </a>
          </Box>
        </Container>
      </Box>


      {/* Modern Statistics Row */}
      <Box sx={{ backgroundColor: 'white', py: 6, borderBottom: '1px solid #e0e7ef' }}>
        <Container maxWidth="lg">
          <Grid container spacing={0} textAlign="center" alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 38, color: '#FFD600', marginBottom: 2 }}>⭐</span>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  4.9
                </Typography>
                <Typography variant="body2" color="text.secondary">App Store Rating</Typography>
                <Rating value={4.9} readOnly precision={0.1} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 34, color: '#00BFA5', marginBottom: 2 }}>💬</span>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  383+
                </Typography>
                <Typography variant="body2" color="text.secondary">Services</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 34, color: '#007AFF', marginBottom: 2 }}>🩺</span>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  95%
                </Typography>
                <Typography variant="body2" color="text.secondary">Satisfaction</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 34, color: '#00BFA5', marginBottom: 2 }}>👩‍⚕️</span>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  36
                </Typography>
                <Typography variant="body2" color="text.secondary">Specialties</Typography>
              </Box>
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