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
  Fab,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore,
  Security,
  Shield,
  Lock,
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
  VpnKey,
  Storage,
  Share,
  Update,
  ContactSupport,
  AccountCircle,
  CloudUpload,
  DeleteForever,
  Visibility,
  VisibilityOff,
  Gavel,
  LocalHospital,
  Science,
  Psychology
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HipaaCompliancePage: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const complianceSteps = [
    'Data Collection',
    'Data Storage',
    'Data Transmission',
    'Data Access',
    'Data Disposal'
  ];

  const hipaaSections = [
    {
      id: 'overview',
      title: 'HIPAA Compliance Overview',
      icon: <Shield color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            The Telehealth Portal is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and the Health Information Technology for Economic and Clinical Health (HITECH) Act. Our platform implements comprehensive security measures to protect patient health information.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              HIPAA Certification Status
            </Typography>
            <Typography variant="body2">
              ✓ Business Associate Agreement (BAA) compliant<br/>
              ✓ Security Rule compliant<br/>
              ✓ Privacy Rule compliant<br/>
              ✓ Breach Notification Rule compliant
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'protected-health-info',
      title: 'Protected Health Information (PHI)',
      icon: <Lock color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We protect all forms of Protected Health Information (PHI) including:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Medical records and history" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Test results and lab reports" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Prescription information" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Billing and payment data" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Appointment schedules" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Video consultation recordings" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Communication records" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText primary="Demographic information" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'security-measures',
      title: 'Security Measures',
      icon: <Security color="primary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Technical Safeguards
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><VpnKey color="primary" /></ListItemIcon>
              <ListItemText
                primary="End-to-End Encryption"
                secondary="AES-256 encryption for data at rest and TLS 1.3 for data in transit"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Shield color="primary" /></ListItemIcon>
              <ListItemText
                primary="Access Controls"
                secondary="Role-based access control with multi-factor authentication"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Storage color="primary" /></ListItemIcon>
              <ListItemText
                primary="Secure Storage"
                secondary="Data stored in SOC 2 Type II certified facilities"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Update color="primary" /></ListItemIcon>
              <ListItemText
                primary="Regular Audits"
                secondary="Automated security monitoring and annual penetration testing"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Administrative Safeguards
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Assignment color="primary" /></ListItemIcon>
              <ListItemText
                primary="Security Policies"
                secondary="Comprehensive policies reviewed annually"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
              <ListItemText
                primary="Staff Training"
                secondary="Mandatory HIPAA training for all employees"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Gavel color="primary" /></ListItemIcon>
              <ListItemText
                primary="Business Associate Agreements"
                secondary="Signed BAAs with all third-party vendors"
              />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'data-lifecycle',
      title: 'Data Lifecycle Protection',
      icon: <Update color="primary" />,
      content: (
        <Box>
          <Stepper activeStep={-1} alternativeLabel sx={{ mb: 4 }}>
            {complianceSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h6" gutterBottom>
            Data Collection
          </Typography>
          <Typography variant="body1" paragraph>
            All PHI is collected through secure, encrypted channels with explicit user consent. We implement the minimum necessary standard, collecting only information required for healthcare services.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Data Storage
          </Typography>
          <Typography variant="body1" paragraph>
            PHI is stored in encrypted databases with access logging and audit trails. Data retention follows HIPAA guidelines with secure deletion protocols.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Data Transmission
          </Typography>
          <Typography variant="body1" paragraph>
            All data transmission uses TLS 1.3 encryption. Video consultations are end-to-end encrypted with additional security layers.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Data Access
          </Typography>
          <Typography variant="body1" paragraph>
            Access is limited to authorized healthcare providers and requires multi-factor authentication. All access is logged and monitored.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Data Disposal
          </Typography>
          <Typography variant="body1" paragraph>
            Data is securely disposed of using NIST-approved methods when no longer needed or upon patient request.
          </Typography>
        </Box>
      )
    },
    {
      id: 'patient-rights',
      title: 'Patient Rights Under HIPAA',
      icon: <VerifiedUser color="primary" />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            As a HIPAA-compliant healthcare provider, we ensure you have the following rights regarding your protected health information:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility color="primary" />
                    Right to Access
                  </Typography>
                  <Typography variant="body2">
                    You have the right to access your medical records and request copies of your health information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Update color="primary" />
                    Right to Amend
                  </Typography>
                  <Typography variant="body2">
                    You can request corrections to inaccurate or incomplete health information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Share color="primary" />
                    Right to Accounting
                  </Typography>
                  <Typography variant="body2">
                    You can request an accounting of disclosures of your health information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteForever color="primary" />
                    Right to Request Restrictions
                  </Typography>
                  <Typography variant="body2">
                    You can request restrictions on how we use or disclose your health information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'breach-notification',
      title: 'Breach Notification',
      icon: <Warning color="warning" />,
      content: (
        <Box>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Breach Notification Policy
            </Typography>
            <Typography variant="body2">
              In compliance with HIPAA Breach Notification Rule, we will notify affected individuals, the Department of Health and Human Services (HHS), and potentially the media within required timeframes if a breach of unsecured PHI occurs.
            </Typography>
          </Alert>
          <Typography variant="body1" paragraph>
            Our breach response plan includes:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Immediate investigation of potential breaches" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Risk assessment to determine notification requirements" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Prompt notification to affected individuals" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText primary="Coordination with regulatory authorities" />
            </ListItem>
          </List>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          HIPAA Compliance
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Protecting Your Health Information with Industry-Leading Security
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Chip icon={<VerifiedUser />} label="HIPAA Compliant" color="success" variant="outlined" />
          <Chip icon={<Security />} label="SOC 2 Certified" color="primary" variant="outlined" />
          <Chip icon={<Shield />} label="End-to-End Encrypted" color="secondary" variant="outlined" />
        </Box>
      </Box>

      {/* Compliance Status Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'success.lighter' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          HIPAA Compliance Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>100%</Typography>
              <Typography variant="body2" color="success.dark">Compliance Rate</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>256-bit</Typography>
              <Typography variant="body2" color="success.dark">AES Encryption</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>24/7</Typography>
              <Typography variant="body2" color="success.dark">Security Monitoring</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>Annual</Typography>
              <Typography variant="body2" color="success.dark">Security Audits</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Print Compliance Info
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([document.body.innerText], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = 'hipaa-compliance.txt';
            element.click();
          }}
        >
          Download Summary
        </Button>
      </Box>

      {/* HIPAA Sections */}
      <Box sx={{ mb: 4 }}>
        {hipaaSections.map((section) => (
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
          HIPAA Questions or Concerns?
        </Typography>
        <Typography variant="body1" paragraph>
          If you have questions about our HIPAA compliance or need to exercise your HIPAA rights, please contact our compliance team:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security color="primary" />
              <Box>
                <Typography variant="subtitle2">Compliance Officer</Typography>
                <Typography variant="body2" color="text.secondary">compliance@telehealthportal.com</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalServices color="primary" />
              <Box>
                <Typography variant="subtitle2">Privacy Officer</Typography>
                <Typography variant="body2" color="text.secondary">privacy@telehealthportal.com</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Trust Indicators */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark' }}>
          Why Choose Our HIPAA-Compliant Platform?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Healthcare-Grade Security</Typography>
              <Typography variant="body2" color="text.secondary">Same security standards as major hospitals</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Science sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Advanced Encryption</Typography>
              <Typography variant="body2" color="text.secondary">Military-grade encryption for all data</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Patient-Centered Privacy</Typography>
              <Typography variant="body2" color="text.secondary">You control your health information</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HipaaCompliancePage;