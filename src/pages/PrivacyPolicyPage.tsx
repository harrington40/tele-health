import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Security,
  Shield,
  Lock,
  Visibility,
  VpnKey,
  Storage,
  Share,
  Update,
  ContactSupport,
  Print,
  Download,
  BookmarkBorder,
  Bookmark,
  Language,
  CheckCircle,
  Info,
  Warning,
  Policy,
  VerifiedUser,
  CloudUpload,
  DeleteForever,
  AccountCircle,
  MedicalServices,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const PrivacyPolicyPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const lastUpdated = "October 1, 2025";
  const effectiveDate = "October 1, 2025";

  const privacySections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <Info />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            At Telehealth Portal, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, protect, and disclose your information when you use our telehealth services.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>HIPAA Compliance:</strong> We are fully compliant with the Health Insurance Portability and Accountability Act (HIPAA) and maintain the highest standards of medical data protection.
            </Typography>
          </Alert>
          <Typography variant="body1">
            Your trust is fundamental to our mission of providing accessible, secure healthcare services. We only collect information necessary to provide you with exceptional medical care and never sell your personal data to third parties.
          </Typography>
        </Box>
      )
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Storage />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Personal Health Information (PHI)</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><MedicalServices color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Medical Records & History" 
                secondary="Diagnoses, treatments, medications, allergies, and consultation notes"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Personal Identifiers" 
                secondary="Name, date of birth, address, phone number, email, and insurance information"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Phone color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Communication Data" 
                secondary="Messages, video call recordings (with consent), and appointment scheduling"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Technical Information</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><Language color="secondary" /></ListItemIcon>
              <ListItemText 
                primary="Usage Analytics" 
                secondary="IP address, browser type, device information, and platform usage patterns"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><LocationOn color="secondary" /></ListItemIcon>
              <ListItemText 
                primary="Location Data" 
                secondary="General location for emergency services and regulatory compliance (with permission)"
              />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: <VpnKey />,
      color: 'success',
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="h6" gutterBottom color="success.dark">
                  <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Healthcare Services
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Provide medical consultations and diagnoses" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Maintain your medical records and history" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Coordinate care with other healthcare providers" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Process prescriptions and referrals" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" gutterBottom color="primary.dark">
                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Platform Operations
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Verify identity and prevent fraud" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Improve our services and user experience" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Ensure platform security and compliance" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Send important service notifications" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Marketing Communications:</strong> We will never use your health information for marketing purposes without your explicit opt-in consent. You can unsubscribe from non-essential communications at any time.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: <Shield />,
      color: 'error',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We implement industry-leading security measures to protect your sensitive health information:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter' }}>
                <Lock sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h6" color="error.dark">256-bit Encryption</Typography>
                <Typography variant="body2">End-to-end encryption for all data transmission</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <CloudUpload sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Secure Cloud Storage</Typography>
                <Typography variant="body2">HIPAA-compliant cloud infrastructure</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" color="info.dark">Access Controls</Typography>
                <Typography variant="body2">Multi-factor authentication and role-based access</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <Update sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Regular Audits</Typography>
                <Typography variant="body2">Continuous security monitoring and updates</Typography>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Security Certifications</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="HIPAA Compliant" color="primary" icon={<CheckCircle />} />
            <Chip label="SOC 2 Type II" color="secondary" icon={<CheckCircle />} />
            <Chip label="ISO 27001" color="success" icon={<CheckCircle />} />
            <Chip label="HITECH Act" color="info" icon={<CheckCircle />} />
          </Box>
        </Box>
      )
    },
    {
      id: 'sharing-disclosure',
      title: 'Information Sharing & Disclosure',
      icon: <Share />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We only share your information in specific, limited circumstances:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">✅ Authorized Sharing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Healthcare Providers" 
                    secondary="With your referring physician, specialists, or care team members for coordinated care"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Insurance Companies" 
                    secondary="For billing, claims processing, and coverage verification (with your consent)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Family Members" 
                    secondary="Only with your explicit written authorization"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Emergency Situations" 
                    secondary="When necessary to protect your health and safety"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">⚖️ Legal Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Court Orders" 
                    secondary="When required by law or valid court order"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Public Health" 
                    secondary="For disease prevention and public health reporting"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Law Enforcement" 
                    secondary="When required for criminal investigations (limited circumstances)"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>We Never:</strong> Sell your data to advertisers, share information for marketing purposes, or provide data to social media platforms without explicit consent.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: <Policy />,
      color: 'info',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Under HIPAA and applicable privacy laws, you have the following rights:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><Visibility color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Access" 
                    secondary="Request copies of your health records and see how your information is used"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Update color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Amend" 
                    secondary="Request corrections to inaccurate or incomplete information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DeleteForever color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Delete" 
                    secondary="Request deletion of your personal information (with certain exceptions)"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><VpnKey color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Restrict" 
                    secondary="Limit how your information is used or shared"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Download color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Portability" 
                    secondary="Receive your data in a portable format for transfer"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ContactSupport color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="Right to Complain" 
                    secondary="File complaints with us or regulatory authorities"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" color="info.dark" gutterBottom>
              How to Exercise Your Rights
            </Typography>
            <Typography variant="body2">
              To exercise any of these rights, contact our Privacy Officer at{' '}
              <strong>privacy@telehealthportal.com</strong> or call{' '}
              <strong>1-800-PRIVACY</strong>. We will respond within 30 days and may require identity verification.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: <Visibility />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to improve your experience and ensure platform functionality:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Essential Cookies</Typography>
                <Typography variant="body2">Required for login, security, and basic functionality</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                <Info sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Analytics Cookies</Typography>
                <Typography variant="body2">Help us understand usage patterns (anonymized)</Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
                <ContactSupport sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" color="info.dark">Preference Cookies</Typography>
                <Typography variant="body2">Remember your settings and preferences</Typography>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info">
            <Typography variant="body2">
              You can manage cookie preferences in your browser settings. Note that disabling essential cookies may affect platform functionality.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: <Update />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy to reflect changes in our practices, technology, or legal requirements. Here's how we handle updates:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon><Email color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Email Notification" 
                secondary="We'll notify you 30 days before significant changes take effect"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Language color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Website Notice" 
                secondary="Updated policy will be posted on our website with revision date"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ContactSupport color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Support Assistance" 
                secondary="Our support team can explain any changes if you have questions"
              />
            </ListItem>
          </List>

          <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.lighter' }}>
            <Typography variant="h6" color="primary.dark" gutterBottom>
              Version History
            </Typography>
            <Typography variant="body2">
              <strong>Current Version:</strong> 3.1 (October 1, 2025)<br />
              <strong>Previous Version:</strong> 3.0 (July 15, 2025)<br />
              <strong>Major Changes:</strong> Enhanced data portability rights, updated cookie policy
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
              <Shield sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Privacy Policy
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
              Your Privacy is Our Priority
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`Last Updated: ${lastUpdated}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                label={`Effective Date: ${effectiveDate}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                label="HIPAA Compliant" 
                sx={{ bgcolor: 'success.main', color: 'white' }} 
                icon={<VerifiedUser />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Quick Actions */}
      <Container maxWidth="lg" sx={{ mt: -3, mb: 4 }}>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button startIcon={<Print />} variant="outlined" size="small">
                Print Policy
              </Button>
              <Button startIcon={<Download />} variant="outlined" size="small">
                Download PDF
              </Button>
              <Button 
                startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                variant="outlined" 
                size="small"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Reading time: ~15 minutes
            </Typography>
          </Box>
        </Card>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Grid container spacing={4}>
          {/* Table of Contents */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Table of Contents
                </Typography>
                <List dense>
                  {privacySections.map((section) => (
                    <ListItem
                      key={section.id}
                      button
                      selected={expandedSection === section.id}
                      onClick={() => setExpandedSection(section.id)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: `${section.color}.main` }}>
                          {section.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={section.title}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Content Sections */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {privacySections.map((section) => (
                <Accordion
                  key={section.id}
                  expanded={expandedSection === section.id}
                  onChange={handleAccordionChange(section.id)}
                  sx={{ 
                    boxShadow: 3,
                    '&:before': { display: 'none' },
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      bgcolor: `${section.color}.lighter`,
                      '&:hover': { bgcolor: `${section.color}.light` }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${section.color}.main` }}>
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
            </Box>
          </Grid>
        </Grid>

        {/* Contact Section */}
        <Card sx={{ mt: 4, p: 3, textAlign: 'center', background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)' }}>
          <Typography variant="h5" gutterBottom>
            Questions About Your Privacy?
          </Typography>
          <Typography variant="body1" paragraph>
            Our Privacy Officer is here to help you understand your rights and address any concerns.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<Email />} size="large">
              privacy@telehealthportal.com
            </Button>
            <Button variant="outlined" startIcon={<Phone />} size="large">
              1-800-PRIVACY
            </Button>
            <Button variant="outlined" startIcon={<ContactSupport />} size="large">
              Live Chat Support
            </Button>
          </Box>
        </Card>
      </Container>

      {/* Floating Action Button */}
      <Tooltip title="Contact Privacy Officer">
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => window.location.href = 'mailto:privacy@telehealthportal.com'}
        >
          <ContactSupport />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default PrivacyPolicyPage;