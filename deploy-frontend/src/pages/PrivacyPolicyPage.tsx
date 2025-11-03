import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  ExpandMore,
  Security,
  LocationOn,
  Language,
  Verified,
  Shield,
  Lock,
  Public,
  Gavel,
  Info,
  CheckCircle,
  Storage,
  VpnKey,
  Share,
  Update,
  ContactSupport,
  MedicalServices,
  AccountCircle,
  Phone,
  Email,
  Visibility,
  CloudUpload,
  VerifiedUser,
  Policy,
  DeleteForever,
  Download,
  Print,
  Bookmark,
  BookmarkBorder,
  Analytics,
} from '@mui/icons-material';

const PrivacyPolicyPage: React.FC = () => {
  const [userCountry, setUserCountry] = useState<string>('US');
  const [userLanguage, setUserLanguage] = useState<string>('en');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | false>('smart-compliance');

  const lastUpdated = 'December 15, 2024';
  const effectiveDate = 'January 1, 2025';

  // Smart country detection (simplified for demo)
  useEffect(() => {
    // In a real app, this would use geolocation API
    const detectCountry = () => {
      // Mock country detection - in production, use a geolocation service
      const mockCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'AU'];
      const randomCountry = mockCountries[Math.floor(Math.random() * mockCountries.length)];
      setUserCountry(randomCountry);
    };

    detectCountry();
  }, []);

  const getCountrySpecificInfo = (country: string) => {
    const countryData: Record<string, any> = {
      US: {
        regulator: 'HIPAA',
        authority: 'Department of Health and Human Services (HHS)',
        laws: ['HIPAA', 'HITECH Act', '21st Century Cures Act'],
        retention: '7 years',
        flag: '🇺🇸',
      },
      CA: {
        regulator: 'PIPEDA',
        authority: 'Office of the Privacy Commissioner of Canada',
        laws: ['PIPEDA', 'Personal Health Information Protection Act'],
        retention: '5 years',
        flag: '🇨🇦',
      },
      GB: {
        regulator: 'ICO',
        authority: 'Information Commissioner\'s Office',
        laws: ['UK GDPR', 'Data Protection Act 2018', 'NHS Digital Code'],
        retention: '8 years',
        flag: '🇬🇧',
      },
      DE: {
        regulator: 'BfDI',
        authority: 'Federal Commissioner for Data Protection',
        laws: ['GDPR', 'German Federal Data Protection Act'],
        retention: '10 years',
        flag: '🇩🇪',
      },
      AU: {
        regulator: 'OAIC',
        authority: 'Office of the Australian Information Commissioner',
        laws: ['Privacy Act 1988', 'My Health Records Act'],
        retention: '7 years',
        flag: '🇦🇺',
      },
    };

    return countryData[country] || countryData.US;
  };

  const countryInfo = getCountrySpecificInfo(userCountry);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const privacySections = [
    {
      id: 'smart-compliance',
      title: 'Smart International Compliance',
      icon: <Public />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our platform automatically adapts to your location's privacy laws and regulations, ensuring compliance with international standards while maintaining HIPAA protection for healthcare data.
          </Typography>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.dark">
                Your Location: {countryInfo.flag} {countryInfo.regulator} Jurisdiction
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.dark">
              <strong>Regulatory Authority:</strong> {countryInfo.authority}<br />
              <strong>Applicable Laws:</strong> {countryInfo.laws.join(', ')}<br />
              <strong>Data Retention:</strong> {countryInfo.retention}
            </Typography>
          </Paper>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Auto-Compliance</Typography>
                <Typography variant="body2">Automatic adaptation to local laws</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter' }}>
                <Shield sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" color="info.dark">HIPAA Always</Typography>
                <Typography variant="body2">Healthcare data protected globally</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Update sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Real-time Updates</Typography>
                <Typography variant="body2">Compliance rules update automatically</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Language sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Multi-Language</Typography>
                <Typography variant="body2">Privacy notices in your language</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'regional-compliance',
      title: 'Regional Compliance Overview',
      icon: <Gavel />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our smart compliance system recognizes and adapts to major privacy frameworks worldwide:
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🇺🇸 United States - HIPAA + State Laws</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>HIPAA Compliance:</strong> Protected Health Information (PHI) safeguards, Business Associate Agreements, Security Rule compliance.
              </Typography>
              <Typography variant="body2">
                <strong>State Laws:</strong> CCPA (California), HIPAA (all states), state-specific privacy laws automatically applied.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🇪🇺 European Union - GDPR Compliance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Data Subject Rights:</strong> Right to access, rectification, erasure, portability, and objection to processing.
              </Typography>
              <Typography variant="body2">
                <strong>Legal Basis:</strong> Consent, legitimate interest, vital interests for health data processing.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🇬🇧 United Kingdom - UK GDPR + NHS Standards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>NHS Digital Code:</strong> Additional protections for NHS patients and data sharing.
              </Typography>
              <Typography variant="body2">
                <strong>ICO Oversight:</strong> Information Commissioner's Office regulates health data processing.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🇨🇦 Canada - PIPEDA + Provincial Laws</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>Personal Health Information:</strong> Provincial health privacy laws automatically applied.
              </Typography>
              <Typography variant="body2">
                <strong>OPC Oversight:</strong> Office of the Privacy Commissioner ensures compliance.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Global Standard:</strong> Regardless of location, all healthcare data receives HIPAA-level protection with additional local law compliance.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'data-collection',
      title: 'Smart Data Collection',
      icon: <Storage />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We collect only necessary information and automatically adjust collection based on your location's privacy requirements:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="h6" gutterBottom color="success.dark">
                  <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Healthcare Data
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Medical history and records" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Consultation notes and diagnoses" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Prescription and treatment data" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Emergency contact information" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'info.lighter' }}>
                <Typography variant="h6" gutterBottom color="info.dark">
                  <AccountCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Identity & Contact
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name, email, phone (required)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Address (location-based services)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Insurance information (optional)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Emergency contacts (optional)" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Location-Based Collection:</strong> Some data collection may vary by jurisdiction. For example, EU users have additional consent requirements for non-essential data.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'data-usage',
      title: 'Intelligent Data Usage',
      icon: <Analytics />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your data is used intelligently to provide better care while respecting privacy laws:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" color="primary.dark" gutterBottom>
                  Healthcare Services
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="AI-powered doctor matching" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Personalized treatment recommendations" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Automated appointment scheduling" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Health record management" />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, bgcolor: 'secondary.lighter' }}>
                <Typography variant="h6" color="secondary.dark" gutterBottom>
                  Platform Intelligence
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Fraud detection and prevention" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Service quality improvement" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Emergency response coordination" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Regulatory compliance monitoring" />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'error.lighter' }}>
            <Typography variant="h6" color="error.dark" gutterBottom>
              🚫 Never Used For
            </Typography>
            <Typography variant="body2">
              • Advertising or marketing without consent<br />
              • Sale to third parties<br />
              • Social media profiling<br />
              • Commercial data mining
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'data-sharing',
      title: 'Controlled Data Sharing',
      icon: <Share />,
      color: 'error',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Data sharing is strictly controlled and varies by jurisdiction:
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">✅ Always Allowed (with safeguards)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Healthcare Coordination"
                    secondary="Sharing with your care team, specialists, and referring physicians"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Emergency Services"
                    secondary="Immediate sharing when life or safety is at risk"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Legal Compliance"
                    secondary="Required disclosures to authorities under applicable laws"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🔒 Requires Explicit Consent</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Insurance Processing"
                    secondary="Billing and claims with insurance providers"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Family Access"
                    secondary="Sharing records with designated family members"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Research Studies"
                    secondary="Participation in medical research (anonymized)"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Zero Unauthorized Sharing:</strong> Your health data is never sold, traded, or shared for commercial purposes. All sharing requires legal justification or your explicit consent.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Dynamic Rights',
      icon: <Policy />,
      color: 'info',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your privacy rights automatically adapt to your location's strongest protections:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><Visibility color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Access"
                    secondary="View all your health data and processing activities"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Update color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Rectification"
                    secondary="Correct inaccurate or incomplete information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DeleteForever color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Erasure"
                    secondary="Delete your data (subject to legal requirements)"
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><VpnKey color="secondary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Restriction"
                    secondary="Limit processing of your personal data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Download color="secondary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Portability"
                    secondary="Receive your data in a transferable format"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ContactSupport color="secondary" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Object"
                    secondary="Object to processing based on legitimate interests"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" color="info.dark" gutterBottom>
              Exercising Your Rights
            </Typography>
            <Typography variant="body2">
              Contact our Data Protection Officer at{' '}
              <strong>privacy@telehealthportal.com</strong> or use our in-app privacy dashboard.
              Response time: 30 days (GDPR/UK GDPR) or 45 days (other jurisdictions).
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'security-tech',
      title: 'Advanced Security Technology',
      icon: <Shield />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Military-grade security with location-aware compliance monitoring:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <Lock sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">End-to-End Encryption</Typography>
                <Typography variant="body2">256-bit AES encryption for all data</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" color="info.dark">Zero-Knowledge Architecture</Typography>
                <Typography variant="body2">We cannot access your decrypted data</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Update sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Continuous Monitoring</Typography>
                <Typography variant="body2">24/7 security monitoring and alerts</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <CloudUpload sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Geo-Redundant Storage</Typography>
                <Typography variant="body2">Data replicated across secure regions</Typography>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Compliance Certifications</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="HIPAA Compliant" color="primary" icon={<CheckCircle />} />
            <Chip label="GDPR Compliant" color="secondary" icon={<CheckCircle />} />
            <Chip label="SOC 2 Type II" color="success" icon={<CheckCircle />} />
            <Chip label="ISO 27001" color="info" icon={<CheckCircle />} />
            <Chip label="HITRUST CSF" color="warning" icon={<CheckCircle />} />
          </Box>
        </Box>
      )
    },
    {
      id: 'policy-updates',
      title: 'Smart Policy Updates',
      icon: <Update />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our privacy policy automatically updates to reflect new laws and regulations:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" color="primary.dark" gutterBottom>
                  Automatic Updates
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Real-time regulatory monitoring" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Automatic policy adjustments" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Location-specific notifications" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Version control and history" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'info.lighter' }}>
                <Typography variant="h6" color="info.dark" gutterBottom>
                  Notification Methods
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="In-app notifications" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email alerts for major changes" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Privacy dashboard updates" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Support team assistance" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.lighter' }}>
            <Typography variant="h6" color="success.dark" gutterBottom>
              Current Policy Status
            </Typography>
            <Typography variant="body2">
              <strong>Version:</strong> 4.2 (Smart Compliance)<br />
              <strong>Last Updated:</strong> {lastUpdated}<br />
              <strong>Next Review:</strong> Continuous monitoring active<br />
              <strong>Coverage:</strong> 195+ countries and jurisdictions
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