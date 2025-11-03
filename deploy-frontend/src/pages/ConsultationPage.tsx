import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ConsultationPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Video Consultation
      </Typography>
      <Box>
        <Typography variant="body1">
          Consultation page content coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ConsultationPage;