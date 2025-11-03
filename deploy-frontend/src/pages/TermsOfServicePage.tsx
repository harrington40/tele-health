import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Fab,
} from '@mui/material';
import {
  Gavel,
  Shield,
  AccountBalance,
  MedicalServices,
  Security,
  Payment,
  Warning,
  CheckCircle,
  ExpandMore,
  Download,
  Print,
  Share,
  VerifiedUser,
  Policy,
  Business,
  LocationOn,
  Update,
  Schedule,
} from '@mui/icons-material';

const TermsOfServicePage: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>('panel1');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const lastUpdated = 'December 15, 2024';
  const effectiveDate = 'January 1, 2025';

  const termsSections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircle />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            By accessing and using Telehealth Portal's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Electronic Agreement:</strong> Your use of our services constitutes electronic acceptance of these terms. We recommend reviewing these terms periodically as they may change.
            </Typography>
          </Alert>
          <Typography variant="body1">
            These Terms of Service apply to all users of our telehealth platform, including patients, healthcare providers, and administrative users. Different terms may apply to healthcare providers - please contact us for provider-specific agreements.
          </Typography>
        </Box>
      )
    },
    {
      id: 'services',
      title: 'Our Services',
      icon: <MedicalServices />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Telehealth Portal provides comprehensive telehealth services designed to connect patients with healthcare providers through secure digital platforms:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <MedicalServices sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">Video Consultations</Typography>
                <Typography variant="body2">Real-time medical consultations with licensed providers</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Shield sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Secure Messaging</Typography>
                <Typography variant="body2">HIPAA-compliant communication with your care team</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <Payment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Prescription Services</Typography>
                <Typography variant="body2">Electronic prescriptions and medication management</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter' }}>
                <AccountBalance sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" color="info.dark">Health Records</Typography>
                <Typography variant="body2">Secure storage and access to your medical records</Typography>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Medical Disclaimer:</strong> Our services are not a substitute for emergency medical care. In case of medical emergency, call emergency services immediately (911 in the US).
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'user-eligibility',
      title: 'User Eligibility & Registration',
      icon: <VerifiedUser />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            To use our services, you must meet certain eligibility requirements and complete our registration process:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Patient Eligibility Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Age Requirements"
                    secondary="Must be 18 years or older, or have parental/guardian consent for minors"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Geographic Location"
                    secondary="Must be located in a jurisdiction where telehealth services are legally permitted"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Medical Necessity"
                    secondary="Services must be medically appropriate for telehealth delivery"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Technology Requirements"
                    secondary="Must have compatible device and internet connection for video consultations"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Account Registration Process</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Identity Verification"
                    secondary="Provide valid government-issued ID and contact information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Medical History"
                    secondary="Complete health questionnaire and medical history form"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Insurance Information"
                    secondary="Provide insurance details for billing purposes (optional)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Consent Forms"
                    secondary="Sign electronic consent for telehealth services and privacy policy"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.lighter' }}>
            <Typography variant="h6" color="warning.dark" gutterBottom>
              Account Security Requirements
            </Typography>
            <Typography variant="body2">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'user-obligations',
      title: 'User Obligations & Conduct',
      icon: <Policy />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            As a user of our telehealth platform, you agree to conduct yourself responsibly and follow these guidelines:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="h6" color="success.dark" gutterBottom>
                  <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Permitted Use
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Seek legitimate medical care and advice" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Provide accurate medical information" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Follow provider treatment recommendations" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Maintain appointment schedules" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'error.lighter' }}>
                <Typography variant="h6" color="error.dark" gutterBottom>
                  <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Prohibited Conduct
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Provide false or misleading information" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Use platform for illegal activities" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Harass or abuse healthcare providers" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Share account credentials" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Violation Consequences:</strong> Failure to comply with these terms may result in suspension or termination of your account and potential legal action.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'payment-terms',
      title: 'Payment Terms & Billing',
      icon: <Payment />,
      color: 'info',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our payment terms are designed to be transparent and fair for all users:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Consultation Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Fee Structure"
                    secondary="Consultation fees vary by provider specialty and consultation type"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Insurance Coverage"
                    secondary="We accept most major insurance plans - coverage verification required"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Self-Pay Options"
                    secondary="Transparent pricing for uninsured or out-of-network patients"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Payment Methods"
                    secondary="Credit cards, debit cards, HSA/FSA cards, and patient financing options"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Billing & Payment Policies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Payment Due"
                    secondary="Payment is due at the time of service unless prior arrangements are made"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Late Payments"
                    secondary="Late fees may apply for payments not received within 30 days"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Refunds"
                    secondary="Refunds processed within 5-7 business days for eligible services"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Disputes"
                    secondary="Billing disputes must be submitted within 90 days of service"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" color="info.dark" gutterBottom>
              Financial Responsibility
            </Typography>
            <Typography variant="body2">
              You are responsible for all charges incurred under your account. Contact our billing department at billing@telehealthportal.com for assistance with payments or billing questions.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Data Security',
      icon: <Security />,
      color: 'error',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your privacy and data security are our highest priorities. We are committed to protecting your health information:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <Shield sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">HIPAA Compliant</Typography>
                <Typography variant="body2">Full HIPAA compliance for all health data</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Security sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">End-to-End Encryption</Typography>
                <Typography variant="body2">256-bit encryption for all communications</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Access Controls</Typography>
                <Typography variant="body2">Role-based access and multi-factor authentication</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Update sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Regular Audits</Typography>
                <Typography variant="body2">Continuous security monitoring and testing</Typography>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="body1">
            For detailed information about how we collect, use, and protect your information, please review our Privacy Policy, which is incorporated into these Terms by reference.
          </Typography>
        </Box>
      )
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers & Limitations',
      icon: <Warning />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Please understand the limitations and disclaimers associated with telehealth services:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Medical Disclaimers</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Not Emergency Care"
                    secondary="Our services are not a substitute for emergency medical treatment"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Diagnostic Limitations"
                    secondary="Some conditions may require in-person examination for accurate diagnosis"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Treatment Limitations"
                    secondary="Certain treatments cannot be provided via telehealth"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Provider Discretion"
                    secondary="Healthcare providers may determine telehealth is not appropriate for your condition"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Technical Limitations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Technology Requirements"
                    secondary="Reliable internet connection and compatible devices required"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Service Interruptions"
                    secondary="Services may be interrupted due to technical issues or maintenance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Security"
                    secondary="While we use industry-leading security, no system is 100% secure"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Third-Party Services"
                    secondary="We are not responsible for third-party integrations or services"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Professional Judgment:</strong> Healthcare providers use their professional judgment to determine the most appropriate care for your specific situation.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'liability',
      title: 'Liability & Indemnification',
      icon: <Gavel />,
      color: 'error',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Understanding liability and legal responsibilities when using our telehealth services:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Limitation of Liability</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                To the maximum extent permitted by applicable law, Telehealth Portal shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Service Interruptions"
                    secondary="We are not liable for temporary service interruptions or technical issues"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Third-Party Actions"
                    secondary="We are not responsible for actions of healthcare providers or other third parties"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="User-Generated Content"
                    secondary="Users are responsible for content they submit to our platform"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Indemnification</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                You agree to indemnify and hold harmless Telehealth Portal, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Your violation of these Terms of Service" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Your use of our services in violation of applicable laws" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Any content you submit or share through our platform" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Your interactions with healthcare providers" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.lighter' }}>
            <Typography variant="h6" color="warning.dark" gutterBottom>
              Legal Jurisdiction
            </Typography>
            <Typography variant="body2">
              These terms are governed by the laws of the State of Delaware, USA. Any disputes shall be resolved in the courts of Delaware, subject to applicable state and federal laws.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: <Business />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Understanding when and how accounts may be terminated:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Termination by User</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Voluntary Termination"
                    secondary="You may terminate your account at any time through account settings"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Retention"
                    secondary="We will retain your medical records as required by law and our retention policies"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Outstanding Payments"
                    secondary="All outstanding payments must be settled before account closure"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Termination by Telehealth Portal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Violation of Terms"
                    secondary="Immediate termination for serious violations of these terms"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fraudulent Activity"
                    secondary="Termination for suspected fraudulent or illegal activities"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Non-Payment"
                    secondary="Termination for failure to pay for services rendered"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Provider Discretion"
                    secondary="Termination at the discretion of healthcare providers for patient safety"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Medical Records Access:</strong> Even after account termination, you may request access to your medical records in accordance with applicable laws and our privacy policy.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'updates',
      title: 'Terms Updates & Modifications',
      icon: <Update />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            How we handle updates to these Terms of Service:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon><Update color="primary" /></ListItemIcon>
              <ListItemText
                primary="Notification of Changes"
                secondary="We will notify you of material changes via email and platform notifications"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Schedule color="primary" /></ListItemIcon>
              <ListItemText
                primary="Review Period"
                secondary="You will have 30 days to review and accept updated terms"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText
                primary="Continued Use"
                secondary="Continued use of our services constitutes acceptance of updated terms"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Policy color="primary" /></ListItemIcon>
              <ListItemText
                primary="Version History"
                secondary="Previous versions are available upon request"
              />
            </ListItem>
          </List>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'primary.lighter' }}>
            <Typography variant="h6" color="primary.dark" gutterBottom>
              Current Terms Information
            </Typography>
            <Typography variant="body2">
              <strong>Last Updated:</strong> {lastUpdated}<br />
              <strong>Effective Date:</strong> {effectiveDate}<br />
              <strong>Version:</strong> 2.1<br />
              <strong>Contact for Questions:</strong> legal@telehealthportal.com
            </Typography>
          </Paper>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2
            }}>
              <Gavel sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Terms of Service
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
              Clear Terms for Quality Healthcare
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Last Updated: ${lastUpdated}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label={`Effective: ${effectiveDate}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label="Legally Binding"
                sx={{ bgcolor: 'success.main', color: 'white' }}
                icon={<VerifiedUser />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Terms Sections */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, boxShadow: 3 }}>
              {termsSections.map((section, index) => (
                <Accordion
                  key={section.id}
                  expanded={expandedPanel === `panel${index + 1}`}
                  onChange={handleAccordionChange(`panel${index + 1}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: `${section.color}.lighter`,
                      '&:hover': { bgcolor: `${section.color}.light` }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        bgcolor: `${section.color}.main`,
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {section.icon}
                      </Avatar>
                      <Typography variant="h6" color={`${section.color}.dark`}>
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {section.content}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Print Terms
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Share Terms
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="secondary">
                Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                If you have questions about these Terms of Service, please contact our legal team:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Email:</strong> legal@telehealthportal.com
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> 1-800-LEGAL-01
                </Typography>
                <Typography variant="body2">
                  <strong>Hours:</strong> Mon-Fri 9AM-6PM EST
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="success">
                Compliance Standards
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="HIPAA Compliant" color="primary" size="small" />
                <Chip label="GDPR Ready" color="secondary" size="small" />
                <Chip label="State Licensed" color="success" size="small" />
                <Chip label="Industry Standards" color="info" size="small" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Gavel />
      </Fab>
    </Box>
  );
};

export default TermsOfServicePage;