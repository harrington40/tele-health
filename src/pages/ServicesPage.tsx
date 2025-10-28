                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  MedicalServices,
  Psychology,
  LocalHospital,
  Vaccines,
  MonitorHeart,
  FamilyRestroom,
  VideoCall,
  Star,
  AccessTime,
  CheckCircle,
  Info,
  ShoppingCart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCountry } from '../contexts/CountryContext';
import { Service } from '../types';

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  services: Service[];
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialog, setBookingDialog] = useState(false);

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'consultation',
      name: 'General Consultation',
      icon: <MedicalServices />,
      description: 'Comprehensive primary care consultations',
      services: [
        {
          id: 1,
          name: 'General Check-up',
          description: 'Complete health assessment and preventive care consultation',
          price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
          duration: 30,
          category: 'consultation',
          isOnline: true
        },
        {
          id: 2,
          name: 'Follow-up Visit',
          description: 'Follow-up consultation for ongoing treatment and monitoring',
          price: selectedCountry?.currency === 'USD' ? 50 : selectedCountry?.currency === 'EUR' ? 45 : 3500,
          duration: 20,
          category: 'consultation',
          isOnline: true
        },
        {
          id: 3,
          name: 'Urgent Care',
          description: 'Immediate medical attention for non-emergency conditions',
          price: selectedCountry?.currency === 'USD' ? 100 : selectedCountry?.currency === 'EUR' ? 85 : 7500,
          duration: 25,
          category: 'consultation',
          isOnline: true
        },
        {
          id: 19,
          name: 'Second Opinion',
          description: 'Expert second opinion on diagnosis and treatment plans',
          price: selectedCountry?.currency === 'USD' ? 125 : selectedCountry?.currency === 'EUR' ? 110 : 9000,
          duration: 45,
          category: 'consultation',
          isOnline: true
        },
        {
          id: 20,
          name: 'Health Coaching',
          description: 'Personalized health and wellness coaching sessions',
          price: selectedCountry?.currency === 'USD' ? 60 : selectedCountry?.currency === 'EUR' ? 55 : 4500,
          duration: 30,
          category: 'consultation',
          isOnline: true
        },
        {
          id: 21,
          name: 'Telemedicine Visit',
          description: 'Convenient virtual consultation from anywhere',
          price: selectedCountry?.currency === 'USD' ? 65 : selectedCountry?.currency === 'EUR' ? 55 : 5000,
          duration: 25,
          category: 'consultation',
          isOnline: true
        }
      ]
    },
    {
      id: 'specialist',
      name: 'Specialist Care',
      icon: <LocalHospital />,
      description: 'Expert consultations with medical specialists',
      services: [
        {
          id: 4,
          name: 'Cardiology Consultation',
          description: 'Heart and cardiovascular health assessment',
          price: selectedCountry?.currency === 'USD' ? 150 : selectedCountry?.currency === 'EUR' ? 130 : 11000,
          duration: 45,
          category: 'specialist',
          isOnline: true
        },
        {
          id: 5,
          name: 'Dermatology Consultation',
          description: 'Skin health and dermatological conditions',
          price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
          duration: 30,
          category: 'specialist',
          isOnline: true
        },
        {
          id: 6,
          name: 'Endocrinology Consultation',
          description: 'Hormone and metabolic disorders',
          price: selectedCountry?.currency === 'USD' ? 140 : selectedCountry?.currency === 'EUR' ? 120 : 10000,
          duration: 40,
          category: 'specialist',
          isOnline: true
        },
        {
          id: 22,
          name: 'Neurology Consultation',
          description: 'Brain and nervous system disorders',
          price: selectedCountry?.currency === 'USD' ? 160 : selectedCountry?.currency === 'EUR' ? 140 : 12000,
          duration: 50,
          category: 'specialist',
          isOnline: true
        },
        {
          id: 23,
          name: 'Orthopedic Consultation',
          description: 'Bones, joints, and musculoskeletal health',
          price: selectedCountry?.currency === 'USD' ? 130 : selectedCountry?.currency === 'EUR' ? 115 : 9500,
          duration: 35,
          category: 'specialist',
          isOnline: true
        },
        {
          id: 24,
          name: 'Ophthalmology Consultation',
          description: 'Eye health and vision care',
          price: selectedCountry?.currency === 'USD' ? 110 : selectedCountry?.currency === 'EUR' ? 95 : 8000,
          duration: 30,
          category: 'specialist',
          isOnline: true
        }
      ]
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      icon: <Psychology />,
      description: 'Professional mental health and wellness services',
      services: [
        {
          id: 7,
          name: 'Therapy Session',
          description: 'Individual counseling and psychotherapy',
          price: selectedCountry?.currency === 'USD' ? 90 : selectedCountry?.currency === 'EUR' ? 80 : 6500,
          duration: 50,
          category: 'mental-health',
          isOnline: true
        },
        {
          id: 8,
          name: 'Psychiatric Consultation',
          description: 'Mental health assessment and medication management',
          price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
          duration: 45,
          category: 'mental-health',
          isOnline: true
        },
        {
          id: 9,
          name: 'Couples Counseling',
          description: 'Relationship and couples therapy sessions',
          price: selectedCountry?.currency === 'USD' ? 110 : selectedCountry?.currency === 'EUR' ? 95 : 8000,
          duration: 60,
          category: 'mental-health',
          isOnline: true
        },
        {
          id: 25,
          name: 'Anxiety Management',
          description: 'Specialized treatment for anxiety disorders',
          price: selectedCountry?.currency === 'USD' ? 95 : selectedCountry?.currency === 'EUR' ? 85 : 7000,
          duration: 45,
          category: 'mental-health',
          isOnline: true
        },
        {
          id: 26,
          name: 'Depression Treatment',
          description: 'Comprehensive depression care and therapy',
          price: selectedCountry?.currency === 'USD' ? 100 : selectedCountry?.currency === 'EUR' ? 90 : 7500,
          duration: 50,
          category: 'mental-health',
          isOnline: true
        },
        {
          id: 27,
          name: 'Stress Management',
          description: 'Techniques and therapy for stress reduction',
          price: selectedCountry?.currency === 'USD' ? 80 : selectedCountry?.currency === 'EUR' ? 70 : 6000,
          duration: 40,
          category: 'mental-health',
          isOnline: true
        }
      ]
    },
    {
      id: 'preventive',
      name: 'Preventive Care',
      icon: <Vaccines />,
      description: 'Health screenings and preventive services',
      services: [
        {
          id: 10,
          name: 'Annual Physical',
          description: 'Comprehensive annual health examination',
          price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
          duration: 60,
          category: 'preventive',
          isOnline: false
        },
        {
          id: 11,
          name: 'Health Screening',
          description: 'Targeted health screenings and risk assessments',
          price: selectedCountry?.currency === 'USD' ? 80 : selectedCountry?.currency === 'EUR' ? 70 : 6000,
          duration: 30,
          category: 'preventive',
          isOnline: true
        },
        {
          id: 12,
          name: 'Vaccination Consultation',
          description: 'Vaccination planning and travel health advice',
          price: selectedCountry?.currency === 'USD' ? 60 : selectedCountry?.currency === 'EUR' ? 55 : 4500,
          duration: 25,
          category: 'preventive',
          isOnline: true
        },
        {
          id: 28,
          name: 'Cancer Screening',
          description: 'Early detection and cancer prevention screening',
          price: selectedCountry?.currency === 'USD' ? 150 : selectedCountry?.currency === 'EUR' ? 130 : 11000,
          duration: 45,
          category: 'preventive',
          isOnline: true
        },
        {
          id: 29,
          name: 'Heart Health Check',
          description: 'Cardiovascular risk assessment and prevention',
          price: selectedCountry?.currency === 'USD' ? 95 : selectedCountry?.currency === 'EUR' ? 85 : 7000,
          duration: 35,
          category: 'preventive',
          isOnline: true
        },
        {
          id: 30,
          name: 'Nutrition Counseling',
          description: 'Dietary guidance and nutritional assessment',
          price: selectedCountry?.currency === 'USD' ? 70 : selectedCountry?.currency === 'EUR' ? 60 : 5500,
          duration: 30,
          category: 'preventive',
          isOnline: true
        }
      ]
    },
    {
      id: 'chronic-care',
      name: 'Chronic Care',
      icon: <MonitorHeart />,
      description: 'Management of chronic conditions and long-term care',
      services: [
        {
          id: 13,
          name: 'Diabetes Management',
          description: 'Comprehensive diabetes care and monitoring',
          price: selectedCountry?.currency === 'USD' ? 85 : selectedCountry?.currency === 'EUR' ? 75 : 6500,
          duration: 35,
          category: 'chronic-care',
          isOnline: true
        },
        {
          id: 14,
          name: 'Hypertension Care',
          description: 'Blood pressure monitoring and management',
          price: selectedCountry?.currency === 'USD' ? 70 : selectedCountry?.currency === 'EUR' ? 60 : 5500,
          duration: 30,
          category: 'chronic-care',
          isOnline: true
        },
        {
          id: 15,
          name: 'Asthma Management',
          description: 'Asthma care and respiratory health monitoring',
          price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
          duration: 30,
          category: 'chronic-care',
          isOnline: true
        },
        {
          id: 31,
          name: 'Arthritis Care',
          description: 'Joint health and arthritis management',
          price: selectedCountry?.currency === 'USD' ? 80 : selectedCountry?.currency === 'EUR' ? 70 : 6000,
          duration: 35,
          category: 'chronic-care',
          isOnline: true
        },
        {
          id: 32,
          name: 'Thyroid Management',
          description: 'Thyroid disorders and hormone therapy',
          price: selectedCountry?.currency === 'USD' ? 90 : selectedCountry?.currency === 'EUR' ? 80 : 6500,
          duration: 30,
          category: 'chronic-care',
          isOnline: true
        },
        {
          id: 33,
          name: 'COPD Management',
          description: 'Chronic obstructive pulmonary disease care',
          price: selectedCountry?.currency === 'USD' ? 85 : selectedCountry?.currency === 'EUR' ? 75 : 6500,
          duration: 35,
          category: 'chronic-care',
          isOnline: true
        }
      ]
    },
    {
      id: 'family-care',
      name: 'Family Care',
      icon: <FamilyRestroom />,
      description: 'Healthcare services for the whole family',
      services: [
        {
          id: 16,
          name: 'Pediatric Consultation',
          description: 'Child health and pediatric care',
          price: selectedCountry?.currency === 'USD' ? 80 : selectedCountry?.currency === 'EUR' ? 70 : 6000,
          duration: 30,
          category: 'family-care',
          isOnline: true
        },
        {
          id: 17,
          name: 'Geriatric Care',
          description: 'Senior health and geriatric consultations',
          price: selectedCountry?.currency === 'USD' ? 85 : selectedCountry?.currency === 'EUR' ? 75 : 6500,
          duration: 35,
          category: 'family-care',
          isOnline: true
        },
        {
          id: 18,
          name: 'Family Planning',
          description: 'Reproductive health and family planning services',
          price: selectedCountry?.currency === 'USD' ? 70 : selectedCountry?.currency === 'EUR' ? 60 : 5500,
          duration: 40,
          category: 'family-care',
          isOnline: true
        },
        {
          id: 34,
          name: 'Prenatal Care',
          description: 'Pregnancy care and maternal health monitoring',
          price: selectedCountry?.currency === 'USD' ? 95 : selectedCountry?.currency === 'EUR' ? 85 : 7000,
          duration: 45,
          category: 'family-care',
          isOnline: true
        },
        {
          id: 35,
          name: 'Adolescent Health',
          description: 'Teen health and development consultations',
          price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
          duration: 30,
          category: 'family-care',
          isOnline: true
        },
        {
          id: 36,
          name: 'Sports Medicine',
          description: 'Athletic injuries and sports-related health issues',
          price: selectedCountry?.currency === 'USD' ? 100 : selectedCountry?.currency === 'EUR' ? 90 : 7500,
          duration: 35,
          category: 'family-care',
          isOnline: true
        }
      ]
    }
  ];

  const allServices = serviceCategories.flatMap(cat => cat.services);

  const filteredServices = selectedCategory === 'all'
    ? allServices
    : serviceCategories.find(cat => cat.id === selectedCategory)?.services || [];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingDialog(true);
  };

  const handleBookNow = () => {
    setBookingDialog(false);
    navigate('/booking', { state: { selectedService } });
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category?.icon || <MedicalServices />;
  };

  const getServiceFeatures = (service: Service) => {
    const features = [];
    if (service.isOnline) features.push('Online Consultation');
    features.push(`${service.duration} minutes`);
    features.push('Licensed Physician');
    return features;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Our Healthcare Services
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Comprehensive medical care with modern technology and expert physicians
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose from our wide range of services tailored to your health needs
        </Typography>
      </Box>

      {/* Service Categories Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            value="all"
            label="All Services"
            icon={<MedicalServices />}
            iconPosition="start"
          />
          {serviceCategories.map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              label={category.name}
              icon={<span>{category.icon}</span>}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} lg={4} key={service.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, 
                  ${service.category === 'consultation' ? '#667eea 0%, #764ba2 100%' :
                    service.category === 'specialist' ? '#f093fb 0%, #f5576c 100%' :
                    service.category === 'mental-health' ? '#4facfe 0%, #00f2fe 100%' :
                    service.category === 'preventive' ? '#43e97b 0%, #38f9d7 100%' :
                    service.category === 'chronic-care' ? '#fa709a 0%, #fee140 100%' :
                    '#a8edea 0%, #fed6e3 100%'}
                )`,
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  '& .service-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '& .service-content': {
                    transform: 'translateY(-5px)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.1)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    className="service-icon"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      mr: 2,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {getCategoryIcon(service.category)}
                  </Avatar>
                  <Box className="service-content" sx={{ transition: 'transform 0.3s ease' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {service.name}
                    </Typography>
                    <Chip
                      label={serviceCategories.find(cat => cat.id === service.category)?.name}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '& .MuiChip-label': { fontWeight: 'medium' }
                      }}
                    />
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2, 
                    minHeight: 40,
                    opacity: 0.9,
                    lineHeight: 1.4
                  }}
                >
                  {service.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {getServiceFeatures(service).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                      icon={feature === 'Online Consultation' ? <VideoCall /> : <CheckCircle />}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {selectedCountry?.currencySymbol || '$'}{service.price}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      per consultation
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {service.duration} min
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<Info />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Learn More
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceSelect(service);
                  }}
                  sx={{ 
                    minWidth: 120,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Service Details Dialog */}
      <Dialog
        open={!!selectedService && !bookingDialog}
        onClose={() => setSelectedService(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {selectedService && getCategoryIcon(selectedService.category)}
            </Avatar>
            {selectedService?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedService?.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            What's Included:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Licensed healthcare professional consultation" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary={`${selectedService?.duration} minute comprehensive consultation`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Personalized health recommendations" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Follow-up care coordination" />
            </ListItem>
            {selectedService?.isOnline && (
              <ListItem>
                <ListItemIcon>
                  <VideoCall color="primary" />
                </ListItemIcon>
                <ListItemText primary="Secure video consultation available" />
              </ListItem>
            )}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Price: {selectedCountry?.currencySymbol || '$'}{selectedService?.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {selectedService?.duration} minutes
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedService(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => setBookingDialog(true)}
            startIcon={<ShoppingCart />}
          >
            Book This Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog
        open={bookingDialog}
        onClose={() => setBookingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You're about to book: <strong>{selectedService?.name}</strong>
          </Alert>
          <Typography variant="body1" paragraph>
            You'll be redirected to our smart booking system where you can:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              <ListItemText primary="Get AI-powered doctor recommendations" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTime color="primary" />
              </ListItemIcon>
              <ListItemText primary="Choose from available time slots" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary="Complete secure payment and confirmation" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBookNow}
            startIcon={<ShoppingCart />}
          >
            Continue to Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServicesPage;