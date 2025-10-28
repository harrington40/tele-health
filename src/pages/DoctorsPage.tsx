import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  Tooltip,
  Grow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  LocationOn,
  VideoCall,
  Schedule,
  Star,
  SmartToy,
  AccessTime,
  Verified,
  Favorite,
  FavoriteBorder,
  CheckCircle,
  Analytics,
  CalendarToday,
  Person,
  TrendingUp,
  Psychology,
  MedicalServices,
  Speed,
  Security,
  ThumbUp,
  FilterList,
  Sort,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SmartBookingAlgorithm } from '../services/smartBooking';
import { Doctor, Service, TimeSlot, BookingPreferences, SmartBookingResult } from '../types';

const DoctorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('smart');
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [algorithmStep, setAlgorithmStep] = useState(0);

  // Booking states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingPreferences, setBookingPreferences] = useState<BookingPreferences>({
    preferredTimeOfDay: 'morning',
    preferredDays: ['monday', 'tuesday', 'wednesday'],
    maxPrice: 100,
    preferredSpecialties: [],
    urgency: 'medium',
    consultationType: 'video'
  });

  // Algorithm results
  const [smartRecommendations, setSmartRecommendations] = useState<SmartBookingResult | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlot[]>([]);

  // Constants
  const doctorsPerPage = 8;
  const initialLoad = 8;
  const bookingSteps = ['Smart Matching', 'AI Scheduling', 'Confirm & Book'];

  // Load more doctors with smart algorithm
  const loadMoreDoctors = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filtered = doctors.filter(doctor => {
      return (
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      ) && (specialty === '' || doctor.specialty === specialty);
    });
    
    const sorted = sortDoctors(filtered, sortBy);
    const startIndex = page * doctorsPerPage;
    const endIndex = startIndex + doctorsPerPage;
    const newDoctors = sorted.slice(startIndex, endIndex);
    
    if (newDoctors.length > 0) {
      setDisplayedDoctors(prev => [...prev, ...newDoctors]);
      setPage(prev => prev + 1);
    }
    
    setIsLoading(false);
  };

  // Reset and load initial doctors when filters change
  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      return (
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      ) && (specialty === '' || doctor.specialty === specialty);
    });
    
    const sorted = sortDoctors(filtered, sortBy);
    const initialDoctors = sorted.slice(0, doctorsPerPage);
    
    setDisplayedDoctors(initialDoctors);
    setPage(1);
  }, [searchTerm, specialty, sortBy]);

  // Smart Algorithm Functions
  const calculateDoctorScore = (doctor: Doctor): number => {
    let score = 0;
    
    // Rating weight (40%)
    score += doctor.rating * 40;
    
    // Reviews weight (20%) - more reviews = more trustworthy
    score += Math.min(doctor.reviews / 10, 20);
    
    // Availability weight (20%) - immediate availability gets bonus
    if (doctor.availability.includes('Available Today') || doctor.availability.includes('Available Now')) {
      score += 20;
    } else if (doctor.availability.includes('Tomorrow')) {
      score += 10;
    }
    
    // Price competitiveness (10%) - moderate pricing preferred
    const priceScore = Math.max(0, 10 - Math.abs(doctor.price - 50) / 5);
    score += priceScore;
    
    // Online status bonus (10%)
    if (doctor.isOnline) score += 10;
    
    return score;
  };

  const getSmartRecommendations = (doctors: Doctor[]): Doctor[] => {
    return doctors
      .map(doctor => ({ ...doctor, smartScore: calculateDoctorScore(doctor) }))
      .sort((a, b) => b.smartScore - a.smartScore);
  };

  const sortDoctors = (doctors: Doctor[], sortType: string): Doctor[] => {
    switch (sortType) {
      case 'smart':
        return getSmartRecommendations(doctors);
      case 'rating':
        return [...doctors].sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return [...doctors].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...doctors].sort((a, b) => b.price - a.price);
      case 'availability':
        return [...doctors].sort((a, b) => {
          const aAvailable = a.availability.includes('Available');
          const bAvailable = b.availability.includes('Available');
          if (aAvailable && !bAvailable) return -1;
          if (!aAvailable && bAvailable) return 1;
          return 0;
        });
      default:
        return doctors;
    }
  };

  // Mock data - in a real app, this would come from an API
  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      rating: 4.9,
      reviews: 124,
      price: 34,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      rating: 4.8,
      reviews: 89,
      price: 45,
      availability: 'Next Available: 2:30 PM',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      reviews: 156,
      price: 67,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 4,
      name: 'Dr. David Kim',
      specialty: 'Mental Health',
      rating: 4.7,
      reviews: 78,
      price: 89,
      availability: 'Tomorrow 10:00 AM',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: false,
    },
    {
      id: 5,
      name: 'Dr. Lisa Wang',
      specialty: 'Pediatrics',
      rating: 4.8,
      reviews: 203,
      price: 52,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 6,
      name: 'Dr. James Thompson',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 167,
      price: 95,
      availability: 'Next Available: 4:00 PM',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 7,
      name: 'Dr. Maria Gonzalez',
      specialty: 'Endocrinology',
      rating: 4.7,
      reviews: 142,
      price: 78,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 8,
      name: 'Dr. Robert Brown',
      specialty: 'Urgent Care',
      rating: 4.6,
      reviews: 98,
      price: 39,
      availability: 'Available Now',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 9,
      name: 'Dr. Jennifer Lee',
      specialty: 'Mental Health',
      rating: 4.8,
      reviews: 134,
      price: 85,
      availability: 'Tomorrow 9:00 AM',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: false,
    },
    {
      id: 10,
      name: 'Dr. Ahmed Hassan',
      specialty: 'Family Medicine',
      rating: 4.9,
      reviews: 189,
      price: 42,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 11,
      name: 'Dr. Rachel Green',
      specialty: 'Dermatology',
      rating: 4.7,
      reviews: 156,
      price: 72,
      availability: 'Next Available: 1:15 PM',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
    {
      id: 12,
      name: 'Dr. Steven Miller',
      specialty: 'Internal Medicine',
      rating: 4.8,
      reviews: 211,
      price: 48,
      availability: 'Available Today',
      image: '/api/placeholder/120/120',
      location: 'Online',
      isOnline: true,
    },
  ];

  const specialties = [
    'Family Medicine',
    'Internal Medicine',
    'Dermatology',
    'Mental Health',
    'Urgent Care',
    'Pediatrics',
    'Cardiology',
    'Endocrinology',
  ];

  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (specialty === '' || doctor.specialty === specialty);
  });

  // Booking functions
  const handleBookNow = (doctor: Doctor) => {
    console.log('Book Now clicked for doctor:', doctor.name);
    alert(`Booking modal should open for ${doctor.name}`);
    setBookingDoctor(doctor);
    setBookingOpen(true);
    setActiveStep(0);
    setSmartRecommendations(null);
    setAvailabilitySlots([]);
    setSelectedService(null);
    setSelectedTimeSlot(null);
    // Start with a simple booking flow first
    setActiveStep(1); // Skip to scheduling step for now
    generateSimpleSlots(doctor);
  };

  const generateSimpleSlots = (doctor: Doctor) => {
    // Generate some simple time slots for testing
    const slots: TimeSlot[] = [
      { id: '1', date: 'Today', time: '2:00 PM', available: true, doctorId: doctor.id },
      { id: '2', date: 'Today', time: '3:00 PM', available: true, doctorId: doctor.id },
      { id: '3', date: 'Tomorrow', time: '10:00 AM', available: true, doctorId: doctor.id },
      { id: '4', date: 'Tomorrow', time: '2:00 PM', available: true, doctorId: doctor.id },
      { id: '5', date: 'Friday', time: '11:00 AM', available: true, doctorId: doctor.id },
      { id: '6', date: 'Friday', time: '4:00 PM', available: true, doctorId: doctor.id },
    ];
    setAvailabilitySlots(slots);
  };

  const runSmartMatching = async (doctor: Doctor) => {
    setIsAnalyzing(true);
    setAlgorithmStep(0);

    try {
      // Simulate AI processing steps
      setAlgorithmStep(1);
      await new Promise(resolve => setTimeout(resolve, 500));

      setAlgorithmStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use SmartBookingAlgorithm
      const algorithm = SmartBookingAlgorithm.getInstance();
      const results = await algorithm.findOptimalDoctor([doctor], bookingPreferences);

      setSmartRecommendations(results);
      setMatchScore(results.matchScore || 0);
      setAlgorithmStep(3);

      // Generate availability slots
      const slots = await algorithm.optimizeTimeSlots(doctor, bookingPreferences);
      setAvailabilitySlots(slots);

      setActiveStep(1);
    } catch (error) {
      console.error('Smart matching failed:', error);
      // Fallback to simple slots if algorithm fails
      generateSimpleSlots(doctor);
      setActiveStep(1);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBookingConfirm = () => {
    if (!bookingDoctor || !selectedTimeSlot) return;

    // Here you would typically send the booking to your backend
    alert(`🎉 Booking confirmed with ${bookingDoctor.name}!\n\n📅 Date & Time: ${selectedTimeSlot.date} at ${selectedTimeSlot.time}\n💰 Amount: $${bookingDoctor.price}\n📧 Confirmation email sent!`);

    // Reset booking state
    setBookingOpen(false);
    setBookingDoctor(null);
    setActiveStep(0);
    setSmartRecommendations(null);
    setAvailabilitySlots([]);
    setSelectedService(null);
    setSelectedTimeSlot(null);
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedTimeSlot) {
      alert('Please select a time slot to continue.');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Find Your Doctor
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Connect with licensed healthcare providers available today
      </Typography>

      {/* Search and Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search doctors or specialties"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={specialty}
              label="Specialty"
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <MenuItem value="">All Specialties</MenuItem>
              {specialties.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="smart">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartToy color="primary" />
                  Smart Recommendations
                </Box>
              </MenuItem>
              <MenuItem value="rating">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star color="warning" />
                  Highest Rated
                </Box>
              </MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="availability">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime />
                  Availability
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Results Summary */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6">
          {displayedDoctors.length} doctors found
        </Typography>
        {sortBy === 'smart' && (
          <Chip 
            icon={<SmartToy />} 
            label="AI Powered" 
            color="primary" 
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Doctors Grid */}
      <Grid container spacing={3}>
        {displayedDoctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
            <Grow in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: doctor.isOnline 
                      ? 'linear-gradient(90deg, #4caf50, #66bb6a)' 
                      : 'linear-gradient(90deg, #ff9800, #ffb74d)',
                    transition: 'all 0.3s ease',
                  }
                }}
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                {/* Favorite Button */}
                <Box 
                  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavorites(prev => {
                      const newFavorites = new Set(prev);
                      if (newFavorites.has(doctor.id)) {
                        newFavorites.delete(doctor.id);
                      } else {
                        newFavorites.add(doctor.id);
                      }
                      return newFavorites;
                    });
                  }}
                >
                  <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}>
                    {favorites.has(doctor.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Box>

                <CardMedia
                  component="img"
                  height="140"
                  image={doctor.image}
                  alt={doctor.name}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar 
                      src={doctor.image} 
                      sx={{ width: 40, height: 40, mr: 1.5, border: '2px solid #e0e0e0' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 }}>
                        {doctor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Verified sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                          Verified
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                    {doctor.specialty}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating value={doctor.rating} readOnly precision={0.1} size="small" />
                    <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
                      {doctor.rating} ({doctor.reviews})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{doctor.location}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                    <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{doctor.availability}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        ${doctor.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        per consultation
                      </Typography>
                    </Box>
                    {sortBy === 'smart' && (
                      <Tooltip title="AI Recommended">
                        <SmartToy sx={{ color: 'primary.main', fontSize: 20 }} />
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<VideoCall />}
                    sx={{ 
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                      }
                    }}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(doctor);
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Load More */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {displayedDoctors.length < filteredDoctors.length && (
          <Button 
            variant="outlined" 
            size="large"
            onClick={loadMoreDoctors}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 3,
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }
            }}
          >
            {isLoading ? 'Loading...' : `Load More Doctors (${filteredDoctors.length - displayedDoctors.length} remaining)`}
          </Button>
        )}
        {displayedDoctors.length >= filteredDoctors.length && displayedDoctors.length > initialLoad && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            All doctors loaded
          </Typography>
        )}
      </Box>

      {/* Booking Modal */}
      <Dialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, minHeight: '70vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SmartToy color="primary" />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              Book Appointment with {bookingDoctor?.name}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Select a time slot for your appointment:
          </Typography>

          <Grid container spacing={2}>
            {availabilitySlots.map((slot, index) => (
              <Grid item xs={12} sm={6} key={slot.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedTimeSlot?.id === slot.id
                      ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => setSelectedTimeSlot(slot)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule color="primary" />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {slot.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.time}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {availabilitySlots.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Loading available time slots...
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={() => setBookingOpen(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleBookingConfirm}
            variant="contained"
            disabled={!selectedTimeSlot}
            startIcon={<CheckCircle />}
            sx={{ fontWeight: 'bold', px: 4 }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorsPage;