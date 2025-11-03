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
} from '@mui/material';
import {
  Search,
  LocationOn,
  Star,
  SmartToy,
  AccessTime,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Doctor } from '../types';
import { useDoctors } from '../hooks/useDoctors';

const DoctorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('smart');
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

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
    alert(`Booking modal should open for ${doctor.name}`);
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
                  <Typography variant="body2" color="text.secondary">
                    {doctor.availability}
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

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    ${doctor.price}
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
                      px: 2,
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
    </Container>
  );
};

export default DoctorsPage;
