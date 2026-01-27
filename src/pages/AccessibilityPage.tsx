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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore,
  Accessibility,
  Visibility,
  Hearing,
  Accessible,
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
  Settings,
  Contrast,
  TextFields,
  VolumeUp,
  Keyboard,
  Mouse,
  TouchApp,
  ZoomIn,
  Computer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AccessibilityPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const accessibilityFeatures = [
    {
      id: 'visual-accessibility',
      title: 'Visual Accessibility',
      icon: <Visibility color="primary" />,
      features: [
        'High contrast mode support',
        'Screen reader compatibility (NVDA, JAWS, VoiceOver)',
        'Keyboard navigation for all interactive elements',
        'Adjustable text size and zoom up to 200%',
        'Color-blind friendly color schemes',
        'Reduced motion options for animations',
        'Focus indicators for keyboard navigation'
      ]
    },
    {
      id: 'hearing-accessibility',
      title: 'Hearing Accessibility',
      icon: <Hearing color="primary" />,
      features: [
        'Video consultation captions in real-time',
        'Transcript availability for all video calls',
        'Visual call indicators and notifications',
        'Text-based communication alternatives',
        'Sign language interpreter coordination',
        'Hearing aid compatible audio settings'
      ]
    },
    {
      id: 'motor-accessibility',
      title: 'Motor Accessibility',
      icon: <Accessible color="primary" />,
      features: [
        'Full keyboard navigation support',
        'Voice command integration',
        'Touch-friendly interface elements',
        'Extended click targets (44px minimum)',
        'Drag and drop alternatives',
        'Sticky keys and slow keys support',
        'One-handed operation modes'
      ]
    },
    {
      id: 'cognitive-accessibility',
      title: 'Cognitive Accessibility',
      icon: <MedicalServices color="primary" />,
      features: [
        'Simplified language options',
        'Step-by-step guidance for complex tasks',
        'Consistent navigation patterns',
        'Error prevention and clear error messages',
        'Progress indicators for multi-step processes',
        'Customizable dashboard layouts',
        'Reminder and notification preferences'
      ]
    }
  ];

  const wcagCompliance = [
    {
      level: 'A',
      title: 'Level A - Essential',
      description: 'Basic accessibility requirements that must be met',
      items: [
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
        'Compatible with assistive technologies'
      ]
    },
    {
      level: 'AA',
      title: 'Level AA - Standard',
      description: 'Enhanced accessibility for most users',
      items: [
        'Multiple ways to navigate',
        'Headings and labels descriptive',
        'Focus visible and in logical order',
        'Consistent identification',
        'Error identification and suggestions',
        'Live content announcements',
        'Content parsing possible',
        'Name, role, value available'
      ]
    },
    {
      level: 'AAA',
      title: 'Level AAA - Enhanced',
      description: 'Highest level of accessibility for specialized needs',
      items: [
        'Sign language interpretation',
        'Extended audio descriptions',
        'Media alternatives for all',
        'Content available without time limits',
        'No disruption of accessibility features',
        'Context-sensitive help',
        'Low or no background audio',
        'Visual presentation customizable',
        'Images of text only when essential',
        'Keyboard shortcuts customizable'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Accessibility Statement
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Making Healthcare Accessible to Everyone
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Chip icon={<Accessibility />} label="WCAG 2.1 AA Compliant" color="primary" variant="outlined" />
          <Chip icon={<Accessible />} label="ADA Compliant" color="success" variant="outlined" />
          <Chip icon={<Language />} label="Multi-Language Support" variant="outlined" />
        </Box>
      </Box>

      {/* Accessibility Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings color="primary" />
          Accessibility Controls
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Contrast />
                  High Contrast Mode
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextFields />
                  Large Text Mode
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              startIcon={<ZoomIn />}
              onClick={() => {
                const currentZoom = parseFloat(getComputedStyle(document.body).getPropertyValue('zoom') || '1');
                document.body.style.setProperty('zoom', (currentZoom + 0.1).toString());
              }}
            >
              Increase Zoom
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Commitment Statement */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Our Commitment to Accessibility
        </Typography>
        <Typography variant="body2">
          The Telehealth Portal is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
        </Typography>
      </Alert>

      {/* Accessibility Features */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Accessibility Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {accessibilityFeatures.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  {category.title}
                </Typography>
                <List dense>
                  {category.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* WCAG Compliance */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        WCAG 2.1 Compliance
      </Typography>
      <Box sx={{ mb: 4 }}>
        {wcagCompliance.map((level) => (
          <Accordion key={level.level} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={`Level ${level.level}`}
                  color={level.level === 'A' ? 'error' : level.level === 'AA' ? 'warning' : 'success'}
                  size="small"
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {level.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                {level.description}
              </Typography>
              <Grid container spacing={1}>
                {level.items.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle color="success" fontSize="small" />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Assistive Technology Support */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Assistive Technology Support
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Compatible Assistive Technologies
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Computer sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Screen Readers</Typography>
              <Typography variant="body2" color="text.secondary">
                NVDA, JAWS, VoiceOver, TalkBack
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Keyboard sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Keyboard Navigation</Typography>
              <Typography variant="body2" color="text.secondary">
                Full keyboard accessibility support
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <VolumeUp sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Voice Control</Typography>
              <Typography variant="body2" color="text.secondary">
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Accessibility color="primary" />
          Accessibility Support
        </Typography>
        <Typography variant="body1" paragraph>
          If you encounter accessibility barriers or need assistance using our platform, please contact our accessibility team:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Accessible color="primary" />
              <Box>
                <Typography variant="subtitle2">Accessibility Coordinator</Typography>
                <Typography variant="body2" color="text.secondary">accessibility@telehealthportal.com</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalServices color="primary" />
              <Box>
                <Typography variant="subtitle2">Support Hotline</Typography>
                <Typography variant="body2" color="text.secondary">1-800-ACCESSIBLE (24/7)</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Feedback Section */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark' }}>
          Help Us Improve Accessibility
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'primary.dark' }}>
          Your feedback is valuable in helping us make our platform more accessible. If you have suggestions or encounter issues, please let us know.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/contact')}
          >
            Provide Feedback
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('https://www.w3.org/WAI/WCAG21/quickref/', '_blank')}
          >
            WCAG Guidelines
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AccessibilityPage;