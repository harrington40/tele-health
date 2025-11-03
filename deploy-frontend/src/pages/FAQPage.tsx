import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Help,
  Schedule,
  Payment,
  Computer,
  LocalHospital,
  Person,
  QuestionAnswer,
} from '@mui/icons-material';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  helpful?: number;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    // Appointments
    {
      id: '1',
      category: 'appointments',
      question: 'How do I schedule a telehealth appointment?',
      answer: 'To schedule an appointment, log into your account, browse available doctors, select your preferred time slot, and confirm your booking. You\'ll receive a confirmation email and can join the video call from your dashboard.',
      tags: ['booking', 'schedule', 'video'],
    },
    {
      id: '2',
      category: 'appointments',
      question: 'Can I reschedule or cancel my appointment?',
      answer: 'Yes, you can reschedule or cancel appointments up to 24 hours before the scheduled time through your dashboard. Go to "My Appointments" and click the reschedule or cancel button. Cancellations within 24 hours may incur a fee.',
      tags: ['cancel', 'reschedule', 'policy'],
    },
    {
      id: '3',
      category: 'appointments',
      question: 'What should I prepare for my telehealth appointment?',
      answer: 'Prepare by ensuring you have a stable internet connection, working camera and microphone, and any relevant medical records or test results. Find a quiet, private space for your consultation.',
      tags: ['preparation', 'technical', 'privacy'],
    },

    // Billing & Payments
    {
      id: '4',
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets (PayPal, Apple Pay, Google Pay). All payments are processed securely through encrypted channels.',
      tags: ['payment', 'credit card', 'security'],
    },
    {
      id: '5',
      category: 'billing',
      question: 'Do you accept insurance?',
      answer: 'Yes, we accept most major insurance plans. During booking, you can select your insurance provider, and we\'ll handle the claims process. You\'ll only pay your copay or deductible amount.',
      tags: ['insurance', 'claims', 'copay'],
    },
    {
      id: '6',
      category: 'billing',
      question: 'How do I get a receipt for my appointment?',
      answer: 'Receipts are automatically emailed to you after payment. You can also download receipts from your account dashboard under "Billing History" at any time.',
      tags: ['receipt', 'email', 'billing'],
    },

    // Technical Support
    {
      id: '7',
      category: 'technical',
      question: 'What are the technical requirements for telehealth visits?',
      answer: 'You need a device with a camera and microphone (smartphone, tablet, or computer), stable internet connection (minimum 5 Mbps), and a modern web browser. We recommend Chrome or Firefox for the best experience.',
      tags: ['requirements', 'browser', 'internet'],
    },
    {
      id: '8',
      category: 'technical',
      question: 'I\'m having trouble with video/audio during my appointment',
      answer: 'First, check your internet connection and refresh your browser. Try clearing your browser cache or using a different browser. If issues persist, our technical support team can help troubleshoot during your appointment.',
      tags: ['video', 'audio', 'troubleshooting'],
    },
    {
      id: '9',
      category: 'technical',
      question: 'Is my data secure during telehealth appointments?',
      answer: 'Yes, all consultations use end-to-end encryption (HIPAA compliant). Our platform meets all healthcare privacy standards, and your medical information is never stored on your device.',
      tags: ['security', 'privacy', 'HIPAA'],
    },

    // Medical Questions
    {
      id: '10',
      category: 'medical',
      question: 'What types of medical conditions can be treated via telehealth?',
      answer: 'Telehealth is suitable for many conditions including routine check-ups, mental health consultations, chronic disease management, prescription refills, and follow-up appointments. Emergency conditions require immediate in-person care.',
      tags: ['conditions', 'treatment', 'emergency'],
    },
    {
      id: '11',
      category: 'medical',
      question: 'Can I get prescriptions through telehealth?',
      answer: 'Yes, licensed physicians can prescribe medications when medically appropriate. Prescriptions are sent electronically to your preferred pharmacy. Controlled substances may have additional requirements.',
      tags: ['prescription', 'medication', 'pharmacy'],
    },
    {
      id: '12',
      category: 'medical',
      question: 'What if I need lab work or tests?',
      answer: 'Your doctor can order lab work or imaging tests if needed. We\'ll provide you with lab orders and direct you to nearby testing facilities. Results will be shared securely with your healthcare provider.',
      tags: ['lab', 'tests', 'results'],
    },

    // Account & Profile
    {
      id: '13',
      category: 'account',
      question: 'How do I update my medical information?',
      answer: 'Log into your account and go to "Profile Settings." You can update your medical history, allergies, medications, emergency contacts, and insurance information. Keep this information current for better care.',
      tags: ['profile', 'medical history', 'insurance'],
    },
    {
      id: '14',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email. For security, password reset links expire after 24 hours.',
      tags: ['password', 'login', 'security'],
    },
    {
      id: '15',
      category: 'account',
      question: 'Can I have multiple family members on one account?',
      answer: 'Yes, you can add family members to your account. Each family member gets their own profile, medical history, and appointment scheduling. Contact support to set up family accounts.',
      tags: ['family', 'multiple users', 'profiles'],
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: <Help />, color: '#2196f3' },
    { id: 'appointments', label: 'Appointments', icon: <Schedule />, color: '#4caf50' },
    { id: 'billing', label: 'Billing & Payments', icon: <Payment />, color: '#ff9800' },
    { id: 'technical', label: 'Technical Support', icon: <Computer />, color: '#9c27b0' },
    { id: 'medical', label: 'Medical Questions', icon: <LocalHospital />, color: '#f44336' },
    { id: 'account', label: 'Account & Profile', icon: <Person />, color: '#00bcd4' },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : <Help />;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#2196f3';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          Find answers to common questions about our telehealth platform
        </Typography>

        {/* Search Bar */}
        <Paper sx={{ p: 2, maxWidth: 600, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Paper>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 4 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              icon={category.icon}
              label={category.label}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                color: selectedCategory === category.id ? 'white' : category.color,
                borderColor: category.color,
                '&:hover': {
                  backgroundColor: selectedCategory === category.id ? category.color : `${category.color}20`,
                },
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* FAQ List */}
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {filteredFAQs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <QuestionAnswer sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              No FAQs found matching your search.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Try adjusting your search terms or browse all categories.
            </Typography>
          </Paper>
        ) : (
          filteredFAQs.map((faq) => (
            <Accordion key={faq.id} sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: 'rgba(26, 35, 126, 0.04)',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.08)' },
                  minHeight: 64,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar sx={{ bgcolor: getCategoryColor(faq.category), width: 32, height: 32 }}>
                    {getCategoryIcon(faq.category)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {faq.question}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {faq.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(26, 35, 126, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                  {faq.answer}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Category: {categories.find(cat => cat.id === faq.category)?.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Was this helpful? 👍 👎
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* Contact Support */}
      <Paper sx={{ p: 4, mt: 6, textAlign: 'center', background: 'linear-gradient(135deg, #f5f5f5, #e8eaf6)' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
          Still need help?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<QuestionAnswer />}
            label="Live Chat"
            onClick={() => {/* Handle live chat */}}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e3f2fd' } }}
          />
          <Chip
            icon={<Schedule />}
            label="Schedule Call"
            onClick={() => {/* Handle schedule call */}}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#e8f5e8' } }}
          />
          <Chip
            icon={<Help />}
            label="Contact Support"
            onClick={() => {/* Handle contact support */}}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#fff3e0' } }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQPage;