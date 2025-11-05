import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import { Lock, Error } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiresDoctor?: boolean;
  requiresVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresDoctor = false,
  requiresVerification = false 
}) => {
  // Check if user is logged in
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user_data');
  
  if (!token || !userStr) {
    // Not logged in - redirect to login
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if doctor role is required
    if (requiresDoctor && user.role !== 'doctor') {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Error sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This page is only accessible to verified doctors.
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              You need to be a verified doctor to access the Doctor Dashboard.
            </Alert>
            <Button variant="contained" href="/" size="large">
              Return to Home
            </Button>
          </Box>
        </Container>
      );
    }

    // Check if verification is required
    if (requiresVerification && user.verificationStatus !== 'verified') {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Lock sx={{ fontSize: 100, color: 'warning.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Verification Required
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account needs to be verified to access this feature.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Verification Status: <strong>{user.verificationStatus || 'pending'}</strong>
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" href="/doctor/verification" size="large">
                Complete Verification
              </Button>
              <Button variant="outlined" href="/" size="large">
                Return to Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    // All checks passed - render the protected component
    return children;
    
  } catch (error) {
    // Invalid user data - clear and redirect
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
