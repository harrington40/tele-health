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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Star,
  SmartToy,
  AccessTime,
  Favorite,
  FavoriteBorder,
  Close,
  CalendarToday,
  VideoCall,
  CheckCircle,
} from '@mui/icons-material';
import { Doctor } from '../types';
import { useDoctors } from '../hooks/useDoctors';
import bookingService from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('smart');
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video');
  
  // Success notification state
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch doctors from backend
  const { doctors, loading, error } = useDoctors();

  // Load more doctors
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
    const startIndex = page * 8;
    const endIndex = startIndex + 8;
    const newDoctors = sorted.slice(startIndex, endIndex);

    if (newDoctors.length > 0) {
      setDisplayedDoctors(prev => [...prev, ...newDoctors]);
      setPage(prev => prev + 1);
    }

    setIsLoading(false);
  };

  // Reset and load initial doctors when filters change or doctors load
  useEffect(() => {
    console.log('DoctorsPage useEffect triggered:', { doctorsLength: doctors.length, loading, error });
    if (doctors.length > 0) {
      console.log('DoctorsPage: Populating displayedDoctors with', doctors.length, 'doctors');
      console.log('First doctor:', doctors[0]);
      // Temporarily just show all doctors without filtering
      setDisplayedDoctors(doctors.slice(0, 8));
      setPage(1);
    } else {
      console.log('DoctorsPage: No doctors available yet, doctors.length =', doctors.length);
    }
  }, [doctors, loading, error]);

  // Smart Algorithm Functions
  const calculateDoctorScore = (doctor: Doctor): number => {
    let score = 0;
    // Rating weight (40%)
    score += doctor.rating * 40;
    // Reviews weight (20%)
    score += Math.min(doctor.reviews / 10, 20);
    // Availability weight (20%)
    if (doctor.availability.includes('Available Today') || doctor.availability.includes('Available Now')) {
      score += 20;
    } else if (doctor.availability.includes('Tomorrow')) {
      score += 10;
    }
    // Price competitiveness (10%)
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
      default:
        return doctors;
    }
  };

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

  // Booking function
  const handleBookNow = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedDoctor(null);
    setBookingDate('');
    setBookingTime('');
    setAppointmentType('video');
  };

  const handleConfirmBooking = () => {
    if (selectedDoctor && bookingDate && bookingTime) {
      // Calculate final price based on appointment type
      const finalPrice = bookingService.calculatePrice(selectedDoctor.price, appointmentType);
      
      // Save booking to localStorage
      const newBooking = bookingService.addBooking({
        doctorId: selectedDoctor.id.toString(),
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: bookingDate,
        time: bookingTime,
        type: appointmentType,
        price: finalPrice,
        status: 'upcoming',
      });
      
      // Show success message
      setSuccessMessage(`Booking confirmed with ${selectedDoctor.name}! Check your dashboard for details.`);
      setShowSuccessAlert(true);
      
      // Close modal and reset form
      handleCloseBooking();
      
      // Optional: Navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      alert('Please select both date and time');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Debug info */}
      <div style={{ background: 'yellow', padding: '10px', marginBottom: '20px' }}>
        <h3>Debug Info:</h3>
        <p>Loading: {loading ? 'true' : 'false'}</p>
        <p>Error: {error || 'none'}</p>
        <p>Doctors from API: {doctors.length}</p>
        <p>Displayed doctors: {displayedDoctors.length}</p>
        {doctors.length > 0 && (
          <div>
            <h4>First doctor:</h4>
            <pre>{JSON.stringify(doctors[0], null, 2)}</pre>
          </div>
        )}
      </div>
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
          {displayedDoctors.length} doctors found (TESTING)
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
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                },
              }}
              onClick={() => handleBookNow(doctor)}
            >
              <CardMedia
                component="img"
                height="140"
                image={doctor.image || '/api/placeholder/120/120'}
                alt={doctor.name}
                sx={{
                  objectFit: 'cover',
                  filter: 'brightness(0.95)',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    {doctor.name}
                  </Typography>
                  <Button
                    size="small"
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
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    {favorites.has(doctor.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                  {doctor.specialty}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={doctor.rating} readOnly size="small" precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {doctor.location}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {typeof doctor.availability === 'string' 
                      ? doctor.availability 
                      : (doctor.availability as any)?.status || 'Available'}
                  </Typography>
                  {doctor.isOnline && (
                    <Chip
                      label="Online Now"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    ${doctor.price || '0'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(doctor);
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More */}
      {displayedDoctors.length > 0 && displayedDoctors.length < filteredDoctors.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={loadMoreDoctors}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isLoading ? 'Loading...' : 'Load More Doctors'}
          </Button>
        </Box>
      )}

      {/* Booking Modal */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          display: bookingModalOpen ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
        }}
        onClick={handleCloseBooking}
      >
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            maxWidth: 600,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <Button
            onClick={handleCloseBooking}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              minWidth: 'auto',
              p: 1,
            }}
          >
            <Close />
          </Button>

          {/* Modal Content */}
          {selectedDoctor && (
            <>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Book Appointment
              </Typography>
              
              <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {selectedDoctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  {selectedDoctor.specialty} • {selectedDoctor.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Star sx={{ color: '#ffc107', fontSize: 20 }} />
                  <Typography variant="body2">
                    {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)
                  </Typography>
                </Box>
              </Box>

              {/* Appointment Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" mb={2}>
                  Appointment Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant={appointmentType === 'video' ? 'contained' : 'outlined'}
                    onClick={() => setAppointmentType('video')}
                    startIcon={<VideoCall />}
                    sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
                  >
                    Video Call
                  </Button>
                  <Button
                    variant={appointmentType === 'in-person' ? 'contained' : 'outlined'}
                    onClick={() => setAppointmentType('in-person')}
                    startIcon={<CalendarToday />}
                    sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
                  >
                    In-Person
                  </Button>
                </Box>
              </Box>

              {/* Date Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" mb={1}>
                  Select Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Time Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="600" mb={1}>
                  Select Time
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select a time</MenuItem>
                    <MenuItem value="09:00">9:00 AM</MenuItem>
                    <MenuItem value="10:00">10:00 AM</MenuItem>
                    <MenuItem value="11:00">11:00 AM</MenuItem>
                    <MenuItem value="12:00">12:00 PM</MenuItem>
                    <MenuItem value="13:00">1:00 PM</MenuItem>
                    <MenuItem value="14:00">2:00 PM</MenuItem>
                    <MenuItem value="15:00">3:00 PM</MenuItem>
                    <MenuItem value="16:00">4:00 PM</MenuItem>
                    <MenuItem value="17:00">5:00 PM</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Price Summary */}
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Base Consultation Fee</Typography>
                  <Typography variant="body2">${selectedDoctor.price}</Typography>
                </Box>
                {appointmentType === 'in-person' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      In-Person Visit Surcharge (20%)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +${Math.round(selectedDoctor.price * 0.2)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #ddd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    ${bookingService.calculatePrice(selectedDoctor.price, appointmentType)}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCloseBooking}
                  sx={{ borderRadius: 2, textTransform: 'none', py: 1.5 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConfirmBooking}
                  disabled={!bookingDate || !bookingTime}
                  sx={{ borderRadius: 2, textTransform: 'none', py: 1.5 }}
                >
                  Confirm Booking
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Success Notification */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorsPage;
