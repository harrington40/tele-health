import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
  Alert,
  Badge,
  LinearProgress,
  Tab,
  Tabs,
  Fade,
  Grow,
  Slide,
  Zoom,
  Skeleton,
  Rating,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  ContactSupport,
  Lightbulb,
  ThumbUp,
  ThumbDown,
  Bookmark,
  BookmarkBorder,
  Share,
  Psychology,
  SmartToy,
  Speed,
  Verified,
  LocalHospital,
  Healing,
  Science,
  Biotech,
  HealthAndSafety,
  MedicalServices,
  Favorite,
  FavoriteBorder,
  Visibility,
  GetApp,
  Launch,
  HelpOutline,
  CheckCircle,
  Error,
  Info,
  Warning,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Advanced search algorithm with relevance scoring
const calculateRelevanceScore = (content: string, query: string): number => {
  if (!query) return 1;

  const queryWords = query.toLowerCase().split(' ');
  const contentLower = content.toLowerCase();
  let score = 0;

  // Exact phrase match (highest weight)
  if (contentLower.includes(query.toLowerCase())) {
    score += 100;
  }

  // Individual word matches
  queryWords.forEach(word => {
    if (contentLower.includes(word)) {
      score += 20;
    }
  });

  // Title matches get bonus
  if (contentLower.startsWith(query.toLowerCase())) {
    score += 50;
  }

  return score;
};

// AI-powered recommendation algorithm
const generatePersonalizedRecommendations = (userHistory: string[], searchQuery: string) => {
  const recommendations = [];

  if (searchQuery.includes('video') || searchQuery.includes('call')) {
    recommendations.push({
      type: 'tutorial',
      title: 'Video Call Setup Guide',
      priority: 'high',
      reason: 'Based on your search for video consultations'
    });
  }

  if (searchQuery.includes('payment') || searchQuery.includes('billing')) {
    recommendations.push({
      type: 'article',
      title: 'Payment & Insurance Guide',
      priority: 'high',
      reason: 'Frequently asked about billing'
    });
  }

  return recommendations;
};

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [userFeedback, setUserFeedback] = useState<{[key: string]: 'helpful' | 'not-helpful' | null}>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  // New state for article modal and smart features
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [readingProgress, setReadingProgress] = useState<{[key: string]: number}>({});
  const [articleRatings, setArticleRatings] = useState<{[key: string]: number}>({});
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  // Enhanced categories with AI-driven insights
  const categories = [
    {
      id: 'all',
      name: 'All Topics',
      icon: <Article />,
      count: 67,
      color: '#2196F3',
      description: 'Complete help library'
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <PlayArrow />,
      count: 15,
      color: '#4CAF50',
      description: 'New user guides'
    },
    {
      id: 'video-calls',
      name: 'Video Consultations',
      icon: <VideoCall />,
      count: 18,
      color: '#FF9800',
      description: 'Video call setup & troubleshooting'
    },
    {
      id: 'appointments',
      name: 'Appointments',
      icon: <Schedule />,
      count: 12,
      color: '#9C27B0',
      description: 'Booking & managing appointments'
    },
    {
      id: 'payments',
      name: 'Payments & Billing',
      icon: <Payment />,
      count: 10,
      color: '#00BCD4',
      description: 'Payment methods & insurance'
    },
    {
      id: 'health-records',
      name: 'Health Records',
      icon: <MedicalServices />,
      count: 8,
      color: '#F44336',
      description: 'Medical records & privacy'
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: <Support />,
      count: 14,
      color: '#607D8B',
      description: 'App issues & troubleshooting'
    },
    {
      id: 'security',
      name: 'Privacy & Security',
      icon: <Security />,
      count: 9,
      color: '#3F51B5',
      description: 'Data protection & HIPAA'
    },
    {
      id: 'ai-features',
      name: 'AI-Powered Features',
      icon: <SmartToy />,
      count: 16,
      color: '#FF5722',
      description: 'AI health assistants & smart tools'
    }
  ];

  // AI-curated popular articles with engagement metrics
  const popularArticles = [
    {
      id: '1',
      title: 'Complete Guide to Video Consultations',
      category: 'video-calls',
      views: 5421,
      helpful: 487,
      readTime: 8,
      difficulty: 'beginner',
      rating: 4.8,
      tags: ['video', 'consultation', 'setup'],
      lastUpdated: '2024-01-20',
      author: 'Dr. Sarah Johnson',
      featured: true
    },
    {
      id: '2',
      title: 'Smart Appointment Booking Algorithm',
      category: 'appointments',
      views: 3892,
      helpful: 356,
      readTime: 6,
      difficulty: 'intermediate',
      rating: 4.6,
      tags: ['booking', 'algorithm', 'smart'],
      lastUpdated: '2024-01-18',
      author: 'AI Assistant',
      featured: true
    },
    {
      id: '3',
      title: 'Understanding Digital Health Records',
      category: 'health-records',
      views: 3124,
      helpful: 298,
      readTime: 10,
      difficulty: 'intermediate',
      rating: 4.7,
      tags: ['records', 'privacy', 'HIPAA'],
      lastUpdated: '2024-01-15',
      author: 'Privacy Team'
    },
    {
      id: '4',
      title: 'Payment Methods & Insurance Coverage',
      category: 'payments',
      views: 2765,
      helpful: 234,
      readTime: 7,
      difficulty: 'beginner',
      rating: 4.5,
      tags: ['payment', 'insurance', 'billing'],
      lastUpdated: '2024-01-12',
      author: 'Billing Department'
    },
    {
      id: '5',
      title: 'Troubleshooting Common App Issues',
      category: 'technical',
      views: 1987,
      helpful: 189,
      readTime: 5,
      difficulty: 'beginner',
      rating: 4.3,
      tags: ['troubleshooting', 'app', 'issues'],
      lastUpdated: '2024-01-10',
      author: 'Tech Support'
    },
    {
      id: '6',
      title: 'Advanced Security Features Explained',
      category: 'security',
      views: 1654,
      helpful: 167,
      readTime: 12,
      difficulty: 'advanced',
      rating: 4.9,
      tags: ['security', 'encryption', 'HIPAA'],
      lastUpdated: '2024-01-08',
      author: 'Security Team',
      featured: true
    },
    {
      id: '7',
      title: 'AI-Powered Health Insights: Understanding Your Data',
      category: 'ai-features',
      views: 4231,
      helpful: 412,
      readTime: 15,
      difficulty: 'intermediate',
      rating: 4.8,
      tags: ['AI', 'insights', 'data', 'analytics'],
      lastUpdated: '2024-01-25',
      author: 'AI Research Team',
      featured: true
    },
    {
      id: '8',
      title: 'Smart Medication Management with AI',
      category: 'ai-features',
      views: 3876,
      helpful: 378,
      readTime: 10,
      difficulty: 'beginner',
      rating: 4.7,
      tags: ['AI', 'medication', 'management', 'reminders'],
      lastUpdated: '2024-01-22',
      author: 'Pharmacy AI Team'
    },
    {
      id: '9',
      title: 'Mental Health AI: Your 24/7 Wellness Companion',
      category: 'ai-features',
      views: 3456,
      helpful: 334,
      readTime: 12,
      difficulty: 'intermediate',
      rating: 4.9,
      tags: ['AI', 'mental-health', 'wellness', 'support'],
      lastUpdated: '2024-01-20',
      author: 'Mental Health Team',
      featured: true
    },
    {
      id: '10',
      title: 'AI Symptom Analysis: When to Seek Help',
      category: 'ai-features',
      views: 2987,
      helpful: 289,
      readTime: 8,
      difficulty: 'beginner',
      rating: 4.6,
      tags: ['AI', 'symptoms', 'analysis', 'emergency'],
      lastUpdated: '2024-01-18',
      author: 'Medical AI Team'
    },
    {
      id: '11',
      title: 'Personalized Health Recommendations Powered by AI',
      category: 'ai-features',
      views: 2654,
      helpful: 256,
      readTime: 11,
      difficulty: 'intermediate',
      rating: 4.7,
      tags: ['AI', 'personalization', 'recommendations', 'lifestyle'],
      lastUpdated: '2024-01-15',
      author: 'Health AI Team'
    },
    {
      id: '12',
      title: 'AI-Enhanced Video Consultations: Best Practices',
      category: 'ai-features',
      views: 2345,
      helpful: 223,
      readTime: 9,
      difficulty: 'beginner',
      rating: 4.5,
      tags: ['AI', 'video', 'consultations', 'quality'],
      lastUpdated: '2024-01-12',
      author: 'Telemedicine Team'
    }
  ];

  // Intelligent FAQ system with context awareness
  const faqs = [
    {
      id: '1',
      question: 'How does the AI-powered appointment matching work?',
      answer: 'Our advanced algorithm analyzes your medical needs, preferred time slots, doctor availability, and historical data to find the optimal appointment. It considers factors like urgency, insurance coverage, and doctor ratings to provide personalized recommendations.',
      category: 'appointments',
      priority: 'high',
      tags: ['AI', 'algorithm', 'matching'],
      helpful: 234,
      views: 1245
    },
    {
      id: '2',
      question: 'What security measures protect my health data?',
      answer: 'We implement bank-level encryption, HIPAA compliance, biometric authentication, and AI-powered anomaly detection. Your data is stored in secure, geo-redundant facilities with 24/7 monitoring.',
      category: 'security',
      priority: 'high',
      tags: ['security', 'encryption', 'HIPAA'],
      helpful: 198,
      views: 987
    },
    {
      id: '3',
      question: 'How do I test my equipment before a video consultation?',
      answer: 'Use our built-in diagnostic tool in the appointment details page. It tests camera, microphone, speakers, and internet connection. Get real-time recommendations for optimal settings.',
      category: 'video-calls',
      priority: 'medium',
      tags: ['video', 'testing', 'equipment'],
      helpful: 156,
      views: 876
    },
    {
      id: '4',
      question: 'What happens if I need to reschedule an appointment?',
      answer: 'You can reschedule up to 24 hours before your appointment without fees. Our AI system will automatically suggest alternative times based on your preferences and doctor availability.',
      category: 'appointments',
      priority: 'medium',
      tags: ['reschedule', 'cancellation', 'fees'],
      helpful: 143,
      views: 654
    },
    {
      id: '5',
      question: 'How does prescription management work?',
      answer: 'Our integrated system allows doctors to send prescriptions directly to your preferred pharmacy. Track refill status, set up automatic reminders, and manage all your medications in one secure dashboard.',
      category: 'health-records',
      priority: 'medium',
      tags: ['prescription', 'medication', 'pharmacy'],
      helpful: 132,
      views: 543
    },
    {
      id: '6',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, digital wallets (Apple Pay, Google Pay), HSA/FSA cards, and insurance payments. Our AI system automatically detects and applies the best payment method for your situation.',
      category: 'payments',
      priority: 'medium',
      tags: ['payment', 'insurance', 'methods'],
      helpful: 128,
      views: 432
    },
    {
      id: '7',
      question: 'How do I access my medical records?',
      answer: 'Access all your records through the secure patient portal. Use advanced search with AI-powered filtering, download reports, and share with healthcare providers instantly.',
      category: 'health-records',
      priority: 'low',
      tags: ['records', 'access', 'portal'],
      helpful: 98,
      views: 321
    },
    {
      id: '8',
      question: 'What should I do if the app is running slowly?',
      answer: 'Clear cache, ensure stable internet, and use our performance diagnostic tool. Our AI system will identify bottlenecks and provide personalized optimization recommendations.',
      category: 'technical',
      priority: 'low',
      tags: ['performance', 'speed', 'optimization'],
      helpful: 87,
      views: 234
    },
    {
      id: '9',
      question: 'How does AI-powered symptom analysis work?',
      answer: 'Our AI analyzes your described symptoms, medical history, and vital signs to provide preliminary insights. It cross-references with millions of medical cases to suggest possible conditions and urgency levels, helping you decide when to seek immediate care.',
      category: 'ai-features',
      priority: 'high',
      tags: ['AI', 'symptoms', 'diagnosis', 'analysis'],
      helpful: 312,
      views: 1456
    },
    {
      id: '10',
      question: 'Can AI help with medication reminders and interactions?',
      answer: 'Yes! Our AI medication assistant tracks your prescriptions, sends smart reminders based on your schedule, and checks for potential drug interactions. It learns your habits to optimize reminder timing and provides refill alerts before you run out.',
      category: 'ai-features',
      priority: 'high',
      tags: ['AI', 'medication', 'reminders', 'interactions'],
      helpful: 267,
      views: 1234
    },
    {
      id: '11',
      question: 'How does the AI health assistant provide personalized recommendations?',
      answer: 'The AI analyzes your health data, lifestyle patterns, and medical history to offer tailored advice. It considers your age, conditions, medications, and goals to provide relevant health tips, exercise suggestions, and preventive care recommendations.',
      category: 'ai-features',
      priority: 'medium',
      tags: ['AI', 'personalization', 'recommendations', 'health'],
      helpful: 198,
      views: 987
    },
    {
      id: '12',
      question: 'What AI features help with appointment scheduling?',
      answer: 'Our AI scheduling assistant considers your preferences, medical urgency, doctor availability, travel time, and past appointment patterns. It suggests optimal times, handles rescheduling automatically, and even predicts when you might need follow-up appointments.',
      category: 'ai-features',
      priority: 'medium',
      tags: ['AI', 'scheduling', 'appointments', 'optimization'],
      helpful: 234,
      views: 876
    },
    {
      id: '13',
      question: 'How does AI enhance video consultation quality?',
      answer: 'AI-powered video enhancement improves lighting, reduces background noise, and optimizes bandwidth. It also provides real-time language translation, automatic note-taking during consultations, and quality monitoring to ensure clear communication.',
      category: 'ai-features',
      priority: 'medium',
      tags: ['AI', 'video', 'consultation', 'quality'],
      helpful: 189,
      views: 765
    },
    {
      id: '14',
      question: 'Can AI help with mental health support?',
      answer: 'Our AI mental health assistant offers 24/7 support with mood tracking, stress management techniques, mindfulness exercises, and crisis detection. It can suggest professional help when needed and track your mental wellness journey over time.',
      category: 'ai-features',
      priority: 'high',
      tags: ['AI', 'mental-health', 'support', 'wellness'],
      helpful: 345,
      views: 1567
    },
    {
      id: '15',
      question: 'How does AI protect patient privacy and security?',
      answer: 'AI continuously monitors for security threats, detects unusual access patterns, and ensures HIPAA compliance. It uses advanced encryption, biometric verification, and anomaly detection to protect your sensitive health information.',
      category: 'ai-features',
      priority: 'high',
      tags: ['AI', 'privacy', 'security', 'HIPAA'],
      helpful: 278,
      views: 1123
    },
    {
      id: '16',
      question: 'What AI tools help with health record management?',
      answer: 'AI organizes your medical records, extracts key information from documents, flags important trends in your health data, and creates easy-to-understand summaries. It can also predict potential health risks based on your medical history.',
      category: 'ai-features',
      priority: 'medium',
      tags: ['AI', 'records', 'management', 'analysis'],
      helpful: 156,
      views: 678
    }
  ];

  // Smart quick actions with AI recommendations
  const quickActions = [
    {
      title: 'AI Health Assistant',
      description: 'Get instant answers with our AI',
      icon: <Psychology />,
      action: () => navigate('/ai-assistant'),
      color: 'primary',
      featured: true
    },
    {
      title: 'Emergency Support',
      description: '24/7 emergency medical help',
      icon: <LocalHospital />,
      action: () => window.open('tel:911', '_blank'),
      color: 'error',
      urgent: true
    },
    {
      title: 'Live Video Support',
      description: 'Connect with support specialist',
      icon: <VideoCall />,
      action: () => navigate('/live-support'),
      color: 'secondary'
    },
    {
      title: 'AI Symptom Checker',
      description: 'Analyze symptoms with AI',
      icon: <SmartToy />,
      action: () => navigate('/symptom-checker'),
      color: 'info',
      featured: true
    },
    {
      title: 'WhatsApp Support',
      description: 'Quick chat support',
      icon: <WhatsApp />,
      action: () => window.open('https://wa.me/1234567890?text=Hello,%20I%20need%20help%20with%20the%20telehealth%20platform', '_blank'),
      color: 'success'
    },
    {
      title: 'AI Medication Assistant',
      description: 'Smart medication management',
      icon: <MedicalServices />,
      action: () => navigate('/medication-assistant'),
      color: 'warning'
    },
    {
      title: 'Schedule Callback',
      description: 'Book a call with our team',
      icon: <Schedule />,
      action: () => navigate('/schedule-callback'),
      color: 'info'
    },
    {
      title: 'Mental Health AI',
      description: '24/7 mental wellness support',
      icon: <Psychology />,
      action: () => navigate('/mental-health-ai'),
      color: 'secondary'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: <Chat />,
      action: () => navigate('/community'),
      color: 'warning'
    }
  ];

  // Advanced search with AI-powered results
  const performAISearch = async (query: string) => {
    setIsSearching(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    const allContent = [
      ...faqs.map(faq => ({ ...faq, type: 'faq', content: `${faq.question} ${faq.answer}` })),
      ...popularArticles.map(article => ({ ...article, type: 'article', content: article.title }))
    ];

    const scoredResults = allContent
      .map(item => ({
        ...item,
        relevanceScore: calculateRelevanceScore(item.content, query)
      }))
      .filter(item => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    setSearchResults(scoredResults);
    setIsSearching(false);
  };

  // Smart filtering with AI recommendations
  const filteredContent = useMemo(() => {
    let filteredFAQs = faqs;
    let filteredArticles = popularArticles;

    if (selectedCategory !== 'all') {
      filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);
      filteredArticles = popularArticles.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFAQs = filteredFAQs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return { filteredFAQs, filteredArticles };
  }, [selectedCategory, searchQuery]);

  // Personalized recommendations
  const recommendations = useMemo(() => {
    if (!showRecommendations) return [];

    return generatePersonalizedRecommendations([], searchQuery);
  }, [searchQuery, showRecommendations]);

  // Smart article click handler with AI-powered features
  const handleArticleClick = (article: any) => {
    // Update view count
    const updatedArticle = { ...article, views: article.views + 1 };
    
    // Add to recently viewed (keep only last 5)
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== article.id);
      return [updatedArticle, ...filtered].slice(0, 5);
    });
    
    // Generate related articles based on tags and category
    const related = popularArticles
      .filter(a => a.id !== article.id)
      .filter(a => 
        a.category === article.category || 
        a.tags.some((tag: string) => article.tags.includes(tag))
      )
      .sort((a, b) => {
        // Smart scoring: same category + shared tags
        const aScore = (a.category === article.category ? 2 : 0) + 
                      a.tags.filter((tag: string) => article.tags.includes(tag)).length;
        const bScore = (b.category === article.category ? 2 : 0) + 
                      b.tags.filter((tag: string) => article.tags.includes(tag)).length;
        return bScore - aScore;
      })
      .slice(0, 3);
    
    setRelatedArticles(related);
    setSelectedArticle(updatedArticle);
    setArticleModalOpen(true);
    
    // Simulate reading progress tracking
    setReadingProgress(prev => ({ ...prev, [article.id]: 0 }));
  };

  // Smart FAQ interaction handler
  const handleFAQInteraction = (faqId: string, action: 'expand' | 'helpful' | 'not-helpful') => {
    if (action === 'expand') {
      setExpandedFAQ(expandedFAQ === faqId ? false : faqId);
    } else {
      setUserFeedback(prev => ({ ...prev, [faqId]: action }));
      
      // AI-powered feedback analysis (simulate)
      if (action === 'helpful') {
        // Could send to analytics or improve recommendations
        console.log(`FAQ ${faqId} marked as helpful - improving recommendations`);
      }
    }
  };

  // Enhanced bookmarking with smart suggestions
  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(itemId)) {
        newBookmarks.delete(itemId);
      } else {
        newBookmarks.add(itemId);
        
        // Smart suggestion: when bookmarking, suggest related items
        const item = [...popularArticles, ...faqs].find(i => i.id === itemId);
        if (item && 'tags' in item) {
          const related = popularArticles
            .filter(a => !newBookmarks.has(a.id))
            .filter(a => a.tags.some((tag: string) => item.tags.includes(tag)))
            .slice(0, 2);
          
          if (related.length > 0) {
            // Could show a toast notification with suggestions
            console.log('Smart suggestion: You might also like:', related.map(r => r.title));
          }
        }
      }
      return newBookmarks;
    });
  };

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        performAISearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFeedback = (itemId: string, feedback: 'helpful' | 'not-helpful') => {
    setUserFeedback(prev => ({ ...prev, [itemId]: feedback }));
    // In a real app, this would send feedback to analytics
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      
      {/* Article Detail Modal with Smart Features */}
      <Dialog
        open={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedArticle && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedArticle.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <Article sx={{ fontSize: 14 }} />
                      </Avatar>
                      <Typography variant="body2">
                        {selectedArticle.author}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Updated {selectedArticle.lastUpdated}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setArticleModalOpen(false)}
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                {/* Article Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedArticle.views.toLocaleString()} views
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedArticle.readTime} min read
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: '#FFD700', fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedArticle.rating}/5.0
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedArticle.difficulty}
                    size="small"
                    color={
                      selectedArticle.difficulty === 'beginner' ? 'success' :
                      selectedArticle.difficulty === 'intermediate' ? 'warning' : 'error'
                    }
                  />
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {selectedArticle.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
                      }}
                    />
                  ))}
                </Box>

                {/* Article Content */}
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
                  {selectedArticle.content || `This comprehensive guide covers ${selectedArticle.title.toLowerCase()}. 
                  Our AI-powered system provides detailed insights and step-by-step instructions to help you navigate 
                  the telehealth platform effectively. This article includes practical examples, troubleshooting tips, 
                  and best practices based on user feedback and expert recommendations.`}
                </Typography>

                {/* Reading Progress */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Reading Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={readingProgress[selectedArticle.id] || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                      }
                    }}
                  />
                </Box>

                {/* Interactive Rating */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Rate this article
                  </Typography>
                  <Rating
                    value={articleRatings[selectedArticle.id] || selectedArticle.rating}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setArticleRatings(prev => ({ ...prev, [selectedArticle.id]: newValue }));
                      }
                    }}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFD700'
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Box sx={{ bgcolor: 'grey.50', p: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#667eea' }}>
                    🤖 Related Articles (AI Recommended)
                  </Typography>
                  <Grid container spacing={2}>
                    {relatedArticles.map((article) => (
                      <Grid item xs={12} sm={4} key={article.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 4
                            }
                          }}
                          onClick={() => {
                            setArticleModalOpen(false);
                            setTimeout(() => handleArticleClick(article), 300);
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                              {article.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={article.rating} readOnly size="small" />
                              <Typography variant="caption" color="text.secondary">
                                {article.readTime} min
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<ThumbUp />}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Helpful
                  </Button>
                  <Button
                    startIcon={<ThumbDown />}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Not Helpful
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => toggleBookmark(selectedArticle.id)}
                    sx={{ 
                      color: bookmarkedItems.has(selectedArticle.id) ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {bookmarkedItems.has(selectedArticle.id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <Share />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    sx={{ textTransform: 'none' }}
                  >
                    Download PDF
                  </Button>
                </Box>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Hero Section with AI Animation */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite'
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Zoom in={true} timeout={1000}>
              <Box>
                <SmartToy sx={{ fontSize: 80, mb: 2, color: '#FFD700' }} />
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFFFFF 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  AI-Powered Help Center
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Get instant answers with our intelligent search algorithm and personalized recommendations
                </Typography>
              </Box>
            </Zoom>

            {/* Advanced Search Bar */}
            <Grow in={true} timeout={1500}>
              <Paper
                elevation={8}
                sx={{
                  p: 1,
                  maxWidth: 700,
                  mx: 'auto',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Ask anything about telehealth, appointments, or our platform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    endAdornment: isSearching && (
                      <InputAdornment position="end">
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1
                    }
                  }}
                />
              </Paper>
            </Grow>

            {/* AI Search Results */}
            {searchResults.length > 0 && (
              <Fade in={true}>
                <Paper
                  elevation={6}
                  sx={{
                    mt: 3,
                    maxWidth: 700,
                    mx: 'auto',
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <List sx={{ py: 1 }}>
                    {searchResults.slice(0, 5).map((result, index) => (
                      <ListItem
                        key={result.id}
                        button
                        sx={{
                          borderBottom: index < 4 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                          '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' }
                        }}
                      >
                        <ListItemIcon>
                          {result.type === 'faq' ? <QuestionAnswer color="primary" /> : <Article color="secondary" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={result.type === 'faq' ? result.question : result.title}
                          secondary={`Relevance: ${Math.round(result.relevanceScore)}%`}
                        />
                        <Chip
                          label={result.type}
                          size="small"
                          color={result.type === 'faq' ? 'primary' : 'secondary'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Fade>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* AI Recommendations Banner */}
        {recommendations.length > 0 && showRecommendations && (
          <Fade in={true}>
            <Alert
              severity="info"
              sx={{
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '1px solid #2196f3'
              }}
              icon={<Lightbulb sx={{ color: '#1976d2' }} />}
              onClose={() => setShowRecommendations(false)}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                🤖 Personalized Recommendations
              </Typography>
              {recommendations.map((rec, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • <strong>{rec.title}</strong> - {rec.reason}
                </Typography>
              ))}
            </Alert>
          </Fade>
        )}

        {/* Smart Category Navigation */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Explore Help Topics
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Grow in={true} timeout={500 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: selectedCategory === category.id
                        ? `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`
                        : 'white',
                      border: selectedCategory === category.id
                        ? `2px solid ${category.color}`
                        : '1px solid rgba(0,0,0,0.12)',
                      transform: selectedCategory === category.id ? 'translateY(-4px)' : 'none',
                      boxShadow: selectedCategory === category.id
                        ? `0 8px 25px rgba(0,0,0,0.15)`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px rgba(0,0,0,0.15)`
                      }
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: category.color,
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2,
                          boxShadow: `0 4px 14px ${category.color}40`
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {category.description}
                      </Typography>
                      <Badge
                        badgeContent={category.count}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: category.color,
                            color: 'white'
                          }
                        }}
                      >
                        <Chip
                          label={`${category.count} articles`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: category.color, color: category.color }}
                        />
                      </Badge>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Content Tabs */}
        <Box sx={{ mb: 6 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64,
                borderRadius: 2,
                mx: 1,
                transition: 'all 0.3s ease'
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
              }
            }}
          >
            <Tab
              icon={<Article />}
              label="Knowledge Base"
              iconPosition="start"
            />
            <Tab
              icon={<QuestionAnswer />}
              label="Smart FAQ"
              iconPosition="start"
            />
            <Tab
              icon={<Support />}
              label="Support Options"
              iconPosition="start"
            />
          </Tabs>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Fade in={true}>
              <Grid container spacing={4}>
                {/* Featured Articles */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                    🔥 Featured Articles
                  </Typography>
                  <Grid container spacing={3}>
                    {filteredContent.filteredArticles
                      .filter(article => article.featured)
                      .map((article, index) => (
                        <Grid item xs={12} md={6} key={article.id}>
                          <Slide direction="up" in={true} timeout={500 + index * 100}>
                            <Card
                              sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 8
                                }
                              }}
                              onClick={() => handleArticleClick(article)}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                      {article.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                      <Rating value={article.rating} readOnly size="small" />
                                      <Typography variant="body2" color="text.secondary">
                                        ({article.rating})
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(article.id);
                                    }}
                                    sx={{ color: bookmarkedItems.has(article.id) ? 'primary.main' : 'text.secondary' }}
                                  >
                                    {bookmarkedItems.has(article.id) ? <Bookmark /> : <BookmarkBorder />}
                                  </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                  {article.tags.slice(0, 3).map(tag => (
                                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                                  ))}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Visibility fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {article.views.toLocaleString()}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <AccessTime fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary">
                                        {article.readTime} min
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Button
                                    endIcon={<Launch />}
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                  >
                                    Read More
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Slide>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>

                {/* All Articles */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                    📚 All Articles
                  </Typography>
                  <Grid container spacing={2}>
                    {filteredContent.filteredArticles.map((article) => (
                      <Grid item xs={12} sm={6} md={4} key={article.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 4
                            }
                          }}
                          onClick={() => handleArticleClick(article)}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                              {article.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Rating value={article.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {article.views.toLocaleString()} views
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip
                                label={article.difficulty}
                                size="small"
                                color={
                                  article.difficulty === 'beginner' ? 'success' :
                                  article.difficulty === 'intermediate' ? 'warning' : 'error'
                                }
                              />
                              <Typography variant="body2" color="text.secondary">
                                {article.readTime} min read
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Fade>
          )}

          {activeTab === 1 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  🤖 Smart FAQ - AI-Powered Answers
                </Typography>

                {filteredContent.filteredFAQs.map((faq, index) => (
                  <Grow in={true} timeout={300 + index * 50} key={faq.id}>
                    <Accordion
                      expanded={expandedFAQ === faq.id}
                      onChange={(_, expanded) => handleFAQInteraction(faq.id, 'expand')}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': {
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <QuestionAnswer sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {faq.question}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                              <Chip
                                label={faq.priority}
                                size="small"
                                color={
                                  faq.priority === 'high' ? 'error' :
                                  faq.priority === 'medium' ? 'warning' : 'default'
                                }
                              />
                              <Typography variant="body2" color="text.secondary">
                                {faq.helpful} people found this helpful
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                          {faq.answer}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                          {faq.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Was this answer helpful?
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleFAQInteraction(faq.id, 'helpful')}
                              sx={{
                                color: userFeedback[faq.id] === 'helpful' ? 'success.main' : 'text.secondary',
                                '&:hover': { color: 'success.main' }
                              }}
                            >
                              <ThumbUp />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleFAQInteraction(faq.id, 'not-helpful')}
                              sx={{
                                color: userFeedback[faq.id] === 'not-helpful' ? 'error.main' : 'text.secondary',
                                '&:hover': { color: 'error.main' }
                              }}
                            >
                              <ThumbDown />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                              <Share />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grow>
                ))}
              </Box>
            </Fade>
          )}

          {activeTab === 2 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  🛟 Support Options - Get Help Instantly
                </Typography>

                <Grid container spacing={3}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Zoom in={true} timeout={500 + index * 100}>
                        <Card
                          sx={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'visible',
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.02)',
                              boxShadow: `0 12px 40px rgba(0,0,0,0.15)`
                            },
                            ...(action.urgent && {
                              border: '2px solid #f44336',
                              boxShadow: '0 0 20px rgba(244, 67, 54, 0.3)'
                            })
                          }}
                          onClick={action.action}
                        >
                          {action.featured && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -10,
                                right: 16,
                                background: 'linear-gradient(45deg, #FFD700 30%, #FFA000 90%)',
                                color: 'black',
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                zIndex: 1
                              }}
                            >
                              ⭐ FEATURED
                            </Box>
                          )}

                          <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <Avatar
                              sx={{
                                bgcolor: `${action.color}.main`,
                                width: 80,
                                height: 80,
                                mx: 'auto',
                                mb: 3,
                                boxShadow: `0 8px 24px ${action.color === 'error' ? '#f44336' : action.color === 'primary' ? '#2196f3' : '#4caf50'}40`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: `0 12px 32px ${action.color === 'error' ? '#f44336' : action.color === 'primary' ? '#2196f3' : '#4caf50'}60`
                                }
                              }}
                            >
                              {action.icon}
                            </Avatar>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                              {action.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {action.description}
                            </Typography>
                            <Button
                              variant="contained"
                              color={action.color as any}
                              fullWidth
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5
                              }}
                            >
                              {action.urgent ? 'Call Now' : 'Get Started'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Emergency Support Alert */}
        <Fade in={true} timeout={2000}>
          <Alert
            severity="error"
            variant="filled"
            sx={{
              borderRadius: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              border: '2px solid #f44336',
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)'
            }}
            icon={<LocalHospital sx={{ color: '#d32f2f' }} />}
          >
            <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              🚨 Medical Emergency?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#d32f2f' }}>
              If you're experiencing a medical emergency, call 911 immediately or go to your nearest emergency room.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Phone />}
                href="tel:911"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Call 911
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)'
                  }
                }}
              >
                Find Nearest Hospital
              </Button>
            </Box>
          </Alert>
        </Fade>

        {/* AI Assistant Chat Button */}
        <Zoom in={true} timeout={2500}>
          <Tooltip title="AI Health Assistant - Ask me anything!" placement="left">
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 70,
                height: 70,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                  boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'pulse 2s infinite'
              }}
              onClick={() => navigate('/ai-assistant')}
            >
              <Psychology sx={{ fontSize: 28 }} />
            </Fab>
          </Tooltip>
        </Zoom>
      </Container>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `
      }} />
    </Box>
  );
};

export default HelpCenterPage;