import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  Alert,
  Paper,
  Rating
} from '@mui/material';
import {
  AccessTime,
  VideoCall,
  Phone,
  CalendarToday,
  Person,
  CheckCircle,
  SmartToy
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SmartBookingAlgorithm } from '../services/smartBooking';
import { Doctor, Service, TimeSlot, BookingPreferences, SmartBookingResult } from '../types';
import { useCountry } from '../contexts/CountryContext';

const steps = ['Select Service', 'Choose Doctor', 'Pick Time', 'Confirm Booking'];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCountry } = useCountry();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingResult, setBookingResult] = useState<SmartBookingResult | null>(null);
  const [bookingPreferences] = useState<BookingPreferences>({
    preferredTimeOfDay: 'morning',
    preferredDays: [],
    maxPrice: undefined,
    preferredSpecialties: [],
    urgency: 'medium',
    consultationType: 'video'
  });

  // Mock data - in real app, this would come from API
  const [services] = useState<Service[]>([
    {
      id: 1,
      name: 'General Consultation',
      description: 'Comprehensive health consultation with a licensed physician',
      price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
      duration: 30,
      category: 'consultation',
      isOnline: true
    },
    {
      id: 2,
      name: 'Specialist Consultation',
      description: 'Consultation with a medical specialist',
      price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
      duration: 45,
      category: 'specialist',
      isOnline: true
    },
    {
      id: 3,
      name: 'Mental Health Session',
      description: 'Professional mental health counseling and therapy',
      price: selectedCountry?.currency === 'USD' ? 90 : selectedCountry?.currency === 'EUR' ? 80 : 6500,
      duration: 50,
      category: 'mental-health',
      isOnline: true
    },
    {
      id: 4,
      name: 'Follow-up Visit',
      description: 'Follow-up consultation for ongoing treatment',
      price: selectedCountry?.currency === 'USD' ? 50 : selectedCountry?.currency === 'EUR' ? 45 : 3500,
      duration: 20,
      category: 'follow-up',
      isOnline: true
    }
  ]);

  const [doctors] = useState<Doctor[]>([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.8,
      reviews: 127,
      price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
      availability: 'Available today',
      image: '/api/placeholder/150/150',
      location: selectedCountry?.name || 'United States',
      country: selectedCountry?.code || 'US',
      isOnline: true,
      bio: 'Experienced general practitioner with 15+ years in patient care',
      education: ['Harvard Medical School', 'Johns Hopkins Residency'],
      experience: 15
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 89,
      price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
      availability: 'Available tomorrow',
      image: '/api/placeholder/150/150',
      location: selectedCountry?.name || 'United States',
      country: selectedCountry?.code || 'US',
      isOnline: true,
      bio: 'Board-certified cardiologist specializing in preventive care',
      education: ['Stanford Medical School', 'Mayo Clinic Fellowship'],
      experience: 12
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Mental Health',
      rating: 4.7,
      reviews: 156,
      price: selectedCountry?.currency === 'USD' ? 90 : selectedCountry?.currency === 'EUR' ? 80 : 6500,
      availability: 'Available in 2 days',
      image: '/api/placeholder/150/150',
      location: selectedCountry?.name || 'United States',
      country: selectedCountry?.code || 'US',
      isOnline: true,
      bio: 'Licensed clinical psychologist with expertise in cognitive behavioral therapy',
      education: ['UCLA Psychology', 'Beck Institute CBT Certification'],
      experience: 10
    }
  ]);

  const [timeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      available: true,
      doctorId: 1,
      price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
      duration: 30
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      available: true,
      doctorId: 1,
      price: selectedCountry?.currency === 'USD' ? 75 : selectedCountry?.currency === 'EUR' ? 65 : 5500,
      duration: 30
    },
    {
      id: '3',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      available: true,
      doctorId: 2,
      price: selectedCountry?.currency === 'USD' ? 120 : selectedCountry?.currency === 'EUR' ? 105 : 8500,
      duration: 45
    },
    {
      id: '4',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '11:00',
      available: true,
      doctorId: 3,
      price: selectedCountry?.currency === 'USD' ? 90 : selectedCountry?.currency === 'EUR' ? 80 : 6500,
      duration: 50
    }
  ]);

  const smartBooking = new SmartBookingAlgorithm(doctors, timeSlots);

  useEffect(() => {
    if (selectedService && activeStep === 1) {
      // Use smart booking algorithm to find optimal slots
      const result = smartBooking.findOptimalSlots(selectedService.id, bookingPreferences);
      setBookingResult(result);
    }
  }, [selectedService, bookingPreferences, activeStep, smartBooking]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    handleNext();
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    handleNext();
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    handleNext();
  };

  const handleBookingConfirm = () => {
    // In a real app, this would make an API call
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    navigate('/dashboard');
  };

  const renderServiceSelection = () => (
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid item xs={12} sm={6} md={3} key={service.id}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              },
              border: selectedService?.id === service.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
            }}
            onClick={() => handleServiceSelect(service)}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {service.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                {service.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 0.5, fontSize: 16 }} />
                <Typography variant="body2">{service.duration} min</Typography>
              </Box>
              <Typography variant="h6" color="primary">
                {selectedCountry?.currencySymbol || '$'}{service.price}
              </Typography>
              {service.isOnline && (
                <Chip
                  icon={<VideoCall />}
                  label="Online"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDoctorSelection = () => (
    <Box>
      {bookingResult && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <SmartToy sx={{ mr: 1, verticalAlign: 'middle' }} />
            Smart recommendations based on your preferences. Confidence: {bookingResult.confidence ? Math.round(bookingResult.confidence * 100) : 'N/A'}%
          </Typography>
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Recommended Doctors
      </Typography>
      <Grid container spacing={3}>
        {doctors
          .filter(doctor => selectedCountry ? doctor.country === selectedCountry.code : true)
          .map((doctor) => (
          <Grid item xs={12} md={6} key={doctor.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 3 },
                border: selectedDoctor?.id === doctor.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
              }}
              onClick={() => handleDoctorSelect(doctor)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={doctor.image}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{doctor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Rating value={doctor.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {doctor.rating} ({doctor.reviews})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.availability}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {selectedCountry?.currencySymbol || '$'}{doctor.price}
                  </Typography>
                </Box>
                {doctor.isOnline && (
                  <Chip
                    icon={<VideoCall />}
                    label="Available Online"
                    size="small"
                    color="success"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTimeSlotSelection = () => {
    const availableSlots = timeSlots.filter(slot =>
      slot.doctorId === selectedDoctor?.id && slot.available
    );

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Available Time Slots
        </Typography>
        <Grid container spacing={2}>
          {availableSlots.map((slot) => (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 2 },
                  border: selectedTimeSlot?.id === slot.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
                }}
                onClick={() => handleTimeSlotSelect(slot)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">
                    {new Date(slot.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                    {slot.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {slot.duration} minutes
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {selectedCountry?.currencySymbol || '$'}{slot.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderBookingConfirmation = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Booking Summary
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Service Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>{selectedService?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>{selectedService?.duration} minutes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" color="primary">
                {selectedCountry?.currencySymbol || '$'}{selectedService?.price}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Doctor & Time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={selectedDoctor?.image} sx={{ width: 32, height: 32, mr: 1 }}>
                {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography>{selectedDoctor?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>
                {selectedTimeSlot && new Date(selectedTimeSlot.date).toLocaleDateString()} at {selectedTimeSlot?.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {bookingPreferences.consultationType === 'video' ? (
                <VideoCall sx={{ mr: 1, color: 'success.main' }} />
              ) : (
                <Phone sx={{ mr: 1, color: 'success.main' }} />
              )}
              <Typography>
                {bookingPreferences.consultationType === 'video' ? 'Video Call' : 'Phone Call'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your booking will be confirmed instantly. You'll receive email and SMS confirmations.
        </Typography>
      </Alert>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Book Your Appointment
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Smart booking with AI-powered recommendations
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && renderServiceSelection()}
        {activeStep === 1 && renderDoctorSelection()}
        {activeStep === 2 && renderTimeSlotSelection()}
        {activeStep === 3 && renderBookingConfirmation()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleBookingConfirm : handleNext}
          disabled={
            (activeStep === 0 && !selectedService) ||
            (activeStep === 1 && !selectedDoctor) ||
            (activeStep === 2 && !selectedTimeSlot)
          }
        >
          {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default BookingPage;