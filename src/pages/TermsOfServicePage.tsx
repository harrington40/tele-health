import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Avatar,
  Tooltip,
  Fab
} from '@mui/material';
import {
  ExpandMore,
  Gavel,
  Shield,
  Security,
  VerifiedUser,
  Assignment,
  CheckCircle,
  Info,
  Warning,
  Print,
  Download,
  BookmarkBorder,
  Bookmark,
  Language,
  Policy,
  MedicalServices,
  Lock,
  VpnKey,
  Storage,
  Share,
  Update,
  ContactSupport,
  AccountCircle,
  CloudUpload,
  DeleteForever,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircle color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            By accessing and using the Telehealth Portal services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: January 26, 2026
          </Typography>
        </Box>
      )
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: <MedicalServices color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            The Telehealth Portal provides telemedicine services including video consultations, prescription management, health record access, and appointment scheduling with licensed healthcare providers.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Video consultations with licensed physicians" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Electronic prescription services" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Secure health record management" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Appointment scheduling and management" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: <Assignment color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            As a user of our telehealth services, you agree to:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Provide accurate and complete medical information" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Maintain the confidentiality of your account credentials" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Use the service only for lawful medical purposes" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Respect the privacy and rights of healthcare providers" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Warning color="warning" /></ListItemIcon>
              <ListItemText primary="Not use the service for emergency medical situations" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'medical-disclaimer',
      title: 'Medical Disclaimer',
      icon: <Warning color="warning" />,
      content: (
        <Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Important Medical Disclaimer
            </Typography>
            <Typography variant="body2">
              The information provided through our telehealth services is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </Typography>
          </Alert>
          <Typography variant="body1" paragraph>
            Our telehealth services are designed for non-emergency medical consultations. In case of a medical emergency, please call emergency services immediately (911 in the US) or go to the nearest emergency room.
          </Typography>
        </Box>
      )
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: <Assignment color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Payment for telehealth services is due at the time of service unless otherwise arranged. We accept major credit cards, health savings accounts (HSA), and flexible spending accounts (FSA).
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Consultation fees are clearly displayed before booking" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Secure payment processing with PCI compliance" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Receipts provided for all transactions" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Refunds processed within 30 days for eligible services" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: <DeleteForever color="error" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upon termination, your right to use our services will cease immediately.
          </Typography>
        </Box>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Shield color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            In no event shall Telehealth Portal, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our total liability shall not exceed the amount paid by you for the services in the twelve months preceding the claim.
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Terms of Service
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Please read these terms carefully before using our telehealth services
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Chip icon={<VerifiedUser />} label="Legally Binding" color="primary" variant="outlined" />
          <Chip icon={<Security />} label="HIPAA Compliant" color="success" variant="outlined" />
          <Chip icon={<Language />} label="Last Updated: Jan 2026" variant="outlined" />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Print Terms
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([document.body.innerText], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = 'terms-of-service.txt';
            element.click();
          }}
        >
          Download
        </Button>
      </Box>

      {/* Terms Sections */}
      <Box sx={{ mb: 4 }}>
        {sections.map((section) => (
          <Accordion key={section.id} sx={{ mb: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                '&:hover': { bgcolor: 'action.hover' },
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 2
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                {section.icon}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(section.id);
                  }}
                  sx={{ ml: 'auto' }}
                >
                  {bookmarkedSections.includes(section.id) ? (
                    <Bookmark color="primary" />
                  ) : (
                    <BookmarkBorder />
                  )}
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pl: 7 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Contact Information */}
      <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContactSupport color="primary" />
          Questions About These Terms?
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about these Terms of Service, please contact our legal team:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Policy color="primary" />
              <Box>
                <Typography variant="subtitle2">Legal Department</Typography>
                <Typography variant="body2" color="text.secondary">legal@telehealthportal.com</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContactSupport color="primary" />
              <Box>
                <Typography variant="subtitle2">Support Team</Typography>
                <Typography variant="body2" color="text.secondary">support@telehealthportal.com</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Acceptance Confirmation */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          By continuing to use our services, you acknowledge that you have read and agree to these Terms of Service.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            I Agree - Continue to Services
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TermsOfServicePage;