import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  Business,
  Security,
  SmartToy,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
          py: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Welcome to Telehealth Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your healthcare journey starts here
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with healthcare providers worldwide through secure video consultations
          </Typography>
        </Box>

        {/* Main Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={handleLogin}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Person fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Sign In
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Access your account to book appointments, view consultations, and manage your healthcare
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Continue to Login
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={handleRegister}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'secondary.main',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Business fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Join Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create your account as a patient or healthcare provider to get started
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Paper sx={{ p: 3, width: '100%', mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Why Choose Our Telehealth Platform?
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Secure & Private
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  HIPAA-compliant video consultations with end-to-end encryption
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <SmartToy sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  AI-Powered
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smart country detection and personalized healthcare recommendations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Global Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with healthcare providers across North/South America and Africa
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer Links */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact our support team
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPage;