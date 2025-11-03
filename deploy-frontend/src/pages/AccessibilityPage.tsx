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
  Switch,
  FormControlLabel,
  Slider,
} from '@mui/material';
import {
  Accessibility,
  Visibility,
  Hearing,
  TouchApp,
  Language,
  Settings,
  CheckCircle,
  ExpandMore,
  Download,
  Print,
  Share,
  Contrast,
  ZoomIn,
  VolumeUp,
  Keyboard,
  Mouse,
  Smartphone,
  Computer,
} from '@mui/icons-material';

const AccessibilityPage: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>('panel1');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const lastUpdated = 'December 15, 2024';

  const accessibilityFeatures = [
    {
      category: 'Visual Accessibility',
      icon: <Visibility />,
      color: 'primary',
      features: [
        'High contrast mode toggle',
        'Font size adjustment (14px - 24px)',
        'Screen reader compatibility',
        'Keyboard navigation support',
        'Color-blind friendly color schemes',
        'Reduced motion options',
        'Large click targets (44px minimum)',
        'Clear focus indicators',
      ]
    },
    {
      category: 'Hearing Accessibility',
      icon: <Hearing />,
      color: 'secondary',
      features: [
        'Closed captioning for videos',
        'Transcript availability',
        'Visual notifications',
        'Sign language interpretation',
        'Volume controls',
        'Alternative alert methods',
        'Text-based communication options',
        'Hearing aid compatibility',
      ]
    },
    {
      category: 'Motor Accessibility',
      icon: <TouchApp />,
      color: 'success',
      features: [
        'Keyboard-only navigation',
        'Voice control support',
        'Switch device compatibility',
        'Extended time limits',
        'Sticky keys support',
        'Mouse alternatives',
        'Gesture alternatives',
        'Adaptive technology integration',
      ]
    },
    {
      category: 'Cognitive Accessibility',
      icon: <Language />,
      color: 'warning',
      features: [
        'Simple language options',
        'Progressive disclosure',
        'Consistent navigation',
        'Error prevention',
        'Clear instructions',
        'Memory aids',
        'Distraction reduction',
        'Personalization options',
      ]
    }
  ];

  const wcagGuidelines = [
    {
      level: 'A (Essential)',
      description: 'Basic accessibility requirements that must be met',
      requirements: [
        'Text alternatives for non-text content',
        'Time-based media alternatives',
        'Adaptable content presentation',
        'Distinguishable content',
        'Keyboard accessible',
        'Enough time to complete tasks',
        'Seizure prevention',
        'Navigable content',
        'Readable content',
        'Predictable content',
        'Input assistance',
        'Compatible with assistive technology'
      ]
    },
    {
      level: 'AA (Recommended)',
      description: 'Enhanced accessibility for better user experience',
      requirements: [
        'Live audio/video alternatives',
        'Captions for prerecorded media',
        'Audio descriptions',
        'Live captions',
        'Extended time limits',
        'Sign language interpretation',
        'Extended session timeouts',
        'Language identification',
        'On focus and on input',
        'Consistent navigation',
        'Consistent identification',
        'Error identification',
        'Labels and instructions',
        'Error suggestions',
        'Error prevention',
        'Parsing valid code',
        'Name, role, value for form elements'
      ]
    },
    {
      level: 'AAA (Advanced)',
      description: 'Highest level of accessibility for specialized needs',
      requirements: [
        'Sign language for prerecorded media',
        'Extended audio descriptions',
        'Media alternatives for live content',
        'Real-time text support',
        'Plain language options',
        'Context-sensitive help',
        'Individualized presentation',
        'Impartial accessibility services'
      ]
    }
  ];

  const accessibilitySections = [
    {
      id: 'commitment',
      title: 'Our Accessibility Commitment',
      icon: <Accessibility />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            At Telehealth Portal, we are committed to ensuring our platform is accessible to everyone, regardless of ability. We follow WCAG 2.1 Level AA guidelines and continuously work to improve accessibility for all users.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>WCAG 2.1 AA Compliant:</strong> Our platform meets Level AA accessibility standards, with many Level AAA features implemented for enhanced accessibility.
            </Typography>
          </Alert>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <Accessibility sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">Inclusive Design</Typography>
                <Typography variant="body2">Built for all users from the start</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Settings sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Customizable</Typography>
                <Typography variant="body2">Personalize your experience</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Regular Testing</Typography>
                <Typography variant="body2">Continuous accessibility audits</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Language sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Multi-Language</Typography>
                <Typography variant="body2">Support for multiple languages</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'features',
      title: 'Accessibility Features',
      icon: <Settings />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our platform includes comprehensive accessibility features across all disability categories:
          </Typography>

          <Grid container spacing={3}>
            {accessibilityFeatures.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 2, bgcolor: `${category.color}.lighter` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${category.color}.main`, mr: 2 }}>
                      {category.icon}
                    </Avatar>
                    <Typography variant="h6" color={`${category.color}.dark`}>
                      {category.category}
                    </Typography>
                  </Box>
                  <List dense>
                    {category.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircle color={category.color as any} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      id: 'wcag-compliance',
      title: 'WCAG Guidelines Compliance',
      icon: <CheckCircle />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We adhere to the Web Content Accessibility Guidelines (WCAG) 2.1, the international standard for web accessibility:
          </Typography>

          {wcagGuidelines.map((level, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" color={`${level.level.includes('A') ? 'success' : level.level.includes('AA') ? 'primary' : 'secondary'}.dark`}>
                  Level {level.level} - {level.description}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  {level.description}
                </Typography>
                <List dense>
                  {level.requirements.map((req, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Compliance Status:</strong> Telehealth Portal is WCAG 2.1 Level AA compliant, with 95% of Level AAA guidelines implemented.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'assistive-tech',
      title: 'Assistive Technology Support',
      icon: <Computer />,
      color: 'info',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our platform is designed to work seamlessly with a wide range of assistive technologies:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: 'info.lighter' }}>
                <Typography variant="h6" color="info.dark" gutterBottom>
                  Screen Readers
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="NVDA (Windows)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="JAWS (Windows)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="VoiceOver (macOS/iOS)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="TalkBack (Android)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Orca (Linux)" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" color="primary.dark" gutterBottom>
                  Alternative Input Devices
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Keyboard navigation" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Switch devices" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Eye tracking systems" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Voice control" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Head pointers" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Testing & Compatibility</Typography>
          <Typography variant="body2" paragraph>
            We regularly test our platform with assistive technologies and maintain compatibility matrices. Our development process includes accessibility testing at every stage.
          </Typography>
        </Box>
      )
    },
    {
      id: 'customization',
      title: 'Personalization Options',
      icon: <Contrast />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Customize your experience to meet your specific accessibility needs:
          </Typography>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'warning.lighter' }}>
            <Typography variant="h6" color="warning.dark" gutterBottom>
              Live Accessibility Settings Demo
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="High Contrast Mode"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Increases contrast between text and background
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Font Size: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={(e, newValue) => setFontSize(newValue as number)}
                  min={14}
                  max={24}
                  step={2}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: 'warning.main' }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Additional Customization Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Color Themes"
                    secondary="Multiple color schemes including dark mode and color-blind friendly options"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Motion Preferences"
                    secondary="Reduce animations and motion for users sensitive to movement"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Audio Settings"
                    secondary="Adjust notification sounds and enable text-to-speech"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Focus Management"
                    secondary="Customize focus indicators and tab order"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Language Options"
                    secondary="Choose from multiple languages and simplified language modes"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      id: 'testing-feedback',
      title: 'Testing & User Feedback',
      icon: <CheckCircle />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We maintain rigorous accessibility testing processes and actively seek user feedback:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="h6" color="success.dark" gutterBottom>
                  Automated Testing
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="WCAG automated checks" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Color contrast analysis" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Keyboard navigation testing" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Screen reader compatibility" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Mobile accessibility tests" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" color="primary.dark" gutterBottom>
                  Manual Testing & User Research
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Expert accessibility audits" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="User testing with disabilities" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Cognitive walkthroughs" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Usability studies" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Feedback integration" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" color="info.dark" gutterBottom>
              Report Accessibility Issues
            </Typography>
            <Typography variant="body2" paragraph>
              Help us improve! If you encounter accessibility barriers, please contact our accessibility team.
            </Typography>
            <Button variant="contained" color="info" startIcon={<Share />}>
              Report Issue
            </Button>
          </Paper>
        </Box>
      )
    },
    {
      id: 'resources',
      title: 'Accessibility Resources',
      icon: <Language />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Resources to help you use our platform and understand accessibility:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">User Guides & Tutorials</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Getting Started Guide"
                    secondary="Step-by-step instructions for new users"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Accessibility Features Guide"
                    secondary="How to use all accessibility features"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Video Tutorials"
                    secondary="Visual guides with captions and transcripts"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Keyboard Shortcuts"
                    secondary="Complete list of keyboard navigation shortcuts"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">External Resources</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="WCAG Guidelines"
                    secondary="Official Web Content Accessibility Guidelines"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ADA Guidelines"
                    secondary="Americans with Disabilities Act information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Assistive Technology List"
                    secondary="Compatible assistive technologies and devices"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Accessibility Organizations"
                    secondary="Professional organizations and advocacy groups"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Continuous Improvement:</strong> We regularly update our accessibility features based on user feedback, technological advancements, and evolving standards.
            </Typography>
          </Alert>
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
              <Accessibility sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Accessibility
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
              Healthcare for Everyone
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Last Updated: ${lastUpdated}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label="WCAG 2.1 AA Compliant"
                sx={{ bgcolor: 'success.main', color: 'white' }}
                icon={<CheckCircle />}
              />
              <Chip
                label="95% AAA Features"
                sx={{ bgcolor: 'primary.main', color: 'white' }}
                icon={<Accessibility />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Accessibility Sections */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, boxShadow: 3 }}>
              {accessibilitySections.map((section, index) => (
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
                Accessibility Tools
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Download User Guide
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Print Accessibility Info
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Share with Caregiver
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="secondary">
                Contact Accessibility Team
              </Typography>
              <Typography variant="body2" paragraph>
                Questions about accessibility or need assistance?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Email:</strong> accessibility@telehealthportal.com
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> 1-800-ACCESS-01
                </Typography>
                <Typography variant="body2">
                  <strong>TTY:</strong> 1-888-TTY-ACCESS
                </Typography>
                <Typography variant="body2">
                  <strong>Hours:</strong> Mon-Fri 8AM-8PM EST
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="success">
                Accessibility Standards
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="WCAG 2.1 Level AA" color="success" size="small" />
                <Chip label="Section 508 Compliant" color="primary" size="small" />
                <Chip label="ADA Compliant" color="secondary" size="small" />
                <Chip label="EN 301 549 (EU)" color="info" size="small" />
                <Chip label="Regular Audits" color="warning" size="small" />
                <Chip label="User Testing" color="success" size="small" />
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
        <Accessibility />
      </Fab>
    </Box>
  );
};

export default AccessibilityPage;