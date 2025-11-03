import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Avatar,
  IconButton,
  Fab,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Search,
  ExpandMore,
  VideoCall,
  Chat,
  Schedule,
  Payment,
  Security,
  Phone,
  Email,
  WhatsApp,
  Support,
  LiveHelp,
  TrendingUp,
  AccessTime,
  Star,
  PlayArrow,
  Download,
  Article,
  QuestionAnswer,
  ContactSupport
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <Article />, count: 45 },
    { id: 'video-calls', name: 'Video Consultations', icon: <VideoCall />, count: 12 },
    { id: 'appointments', name: 'Appointments', icon: <Schedule />, count: 8 },
    { id: 'payments', name: 'Payments & Billing', icon: <Payment />, count: 7 },
    { id: 'technical', name: 'Technical Support', icon: <Support />, count: 10 },
    { id: 'security', name: 'Privacy & Security', icon: <Security />, count: 8 }
  ];

  const popularArticles = [
    {
      id: '1',
      title: 'How to join a video consultation',
      category: 'video-calls',
      views: 2847,
      helpful: 245,
      readTime: 3,
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Booking your first appointment',
      category: 'appointments',
      views: 2134,
      helpful: 198,
      readTime: 5,
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: 'Understanding your medical records',
      category: 'technical',
      views: 1876,
      helpful: 167,
      readTime: 7,
      difficulty: 'intermediate'
    },
    {
      id: '4',
      title: 'Payment methods and insurance',
      category: 'payments',
      views: 1654,
      helpful: 143,
      readTime: 4,
      difficulty: 'beginner'
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'How do I test my camera and microphone before a consultation?',
      answer: 'You can test your camera and microphone in the \'My Appointments\' section. Click on \'Test Equipment\' 15 minutes before your scheduled appointment.',
      category: 'video-calls'
    },
    {
      id: '2',
      question: 'What happens if I miss my appointment?',
      answer: 'If you miss your appointment, you can reschedule within 24 hours without additional charges. After 24 hours, standard booking fees apply.',
      category: 'appointments'
    },
    {
      id: '3',
      question: 'Is my health data secure?',
      answer: 'Yes, we use end-to-end encryption and are HIPAA compliant. Your data is stored securely and only accessible by authorized healthcare providers.',
      category: 'security'
    },
    {
      id: '4',
      question: 'How do I get a prescription refill?',
      answer: 'You can request prescription refills through your dashboard or by messaging your doctor directly. Most refill requests are processed within 24 hours.',
      category: 'technical'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: <ContactSupport />,
      action: () => navigate('/contact'),
      color: 'primary'
    },
    {
      title: 'WhatsApp Support',
      description: 'Chat with us on WhatsApp',
      icon: <WhatsApp />,
      action: () => window.open('https://wa.me/1234567890', '_blank'),
      color: 'success'
    },
    {
      title: 'Video Tutorial',
      description: 'Watch how-to videos',
      icon: <PlayArrow />,
      action: () => navigate('/tutorials'),
      color: 'info'
    },
    {
      title: 'Live Chat',
      description: 'Chat with support agent',
      icon: <LiveHelp />,
      action: () => {},
      color: 'warning'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = popularArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Help Center 🆘
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Find answers, get support, and learn how to make the most of your telehealth experience
        </Typography>

        {/* Search Bar */}
        <Paper 
          sx={{ 
            p: 1, 
            maxWidth: 600, 
            mx: 'auto',
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 3
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for help articles, FAQs, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
              sx: { border: 'none', '& fieldset': { border: 'none' } }
            }}
          />
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={action.action}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${action.color}.main`,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Browse by Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.id}>
              <Chip
                icon={category.icon}
                label={`${category.name} (${category.count})`}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  width: '100%',
                  height: 'auto',
                  py: 1,
                  '& .MuiChip-label': { whiteSpace: 'normal', px: 1 }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Popular Articles */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            📚 Popular Articles
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredArticles.map((article) => (
              <Card key={article.id} sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                      {article.title}
                    </Typography>
                    <Chip 
                      label={article.difficulty} 
                      size="small" 
                      color={article.difficulty === 'beginner' ? 'success' : article.difficulty === 'intermediate' ? 'warning' : 'error'}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {article.views} views
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {article.readTime} min read
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {article.helpful} helpful
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button size="small" endIcon={<Article />}>
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* FAQs */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            ❓ Frequently Asked Questions
          </Typography>
          <Box>
            {filteredFAQs.map((faq) => (
              <Accordion key={faq.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Emergency Support */}
      <Box sx={{ mt: 6 }}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'info.light'
          }}
          icon={<Support />}
        >
          <Typography variant="h6" gutterBottom>
            🚨 Need Immediate Help?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            For medical emergencies, call 911. For urgent technical support during consultations, use our instant chat or WhatsApp support.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<WhatsApp />}
              onClick={() => window.open('https://wa.me/1234567890?text=Hello, I need urgent technical support', '_blank')}
            >
              WhatsApp Support
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<LiveHelp />}
              onClick={() => navigate('/contact')}
            >
              Live Chat
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Phone />}
              href="tel:+1234567890"
            >
              Call Support
            </Button>
          </Box>
        </Alert>
      </Box>

      {/* WhatsApp Floating Button */}
      <Tooltip title="WhatsApp Technical Support" placement="left">
        <Fab
          color="success"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#128C7E' }
          }}
          onClick={() => window.open('https://wa.me/1234567890?text=Hello, I need help with the telehealth platform', '_blank')}
        >
          <WhatsApp />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default HelpCenterPage;