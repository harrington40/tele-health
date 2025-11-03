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


  useEffect(() => {
    if (selectedService && activeStep === 1) {
      // Use smart booking algorithm to find optimal doctor
      SmartBookingAlgorithm.getInstance()
        .findOptimalDoctor(doctors, bookingPreferences)
        .then(result => setBookingResult(result));
    }
  }, [selectedService, bookingPreferences, activeStep]);

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
    <Grid container spacing={4}>
      {services.map((service) => (
        <Grid item xs={12} sm={6} md={3} key={service.id}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 4,
              background: selectedService?.id === service.id
                ? 'linear-gradient(135deg, #1976d2 0%, #00bfae 100%)'
                : 'rgba(255,255,255,0.7)',
              boxShadow: selectedService?.id === service.id
                ? '0 8px 32px 0 rgba(25,118,210,0.18), 0 4px 20px rgba(0,191,174,0.12)'
                : '0 2px 12px rgba(25,118,210,0.07)',
              border: selectedService?.id === service.id ? '2.5px solid #00bfae' : '1.5px solid #e0e0e0',
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.04)',
                boxShadow: '0 12px 32px 0 rgba(25,118,210,0.22), 0 4px 20px rgba(0,191,174,0.16)'
              },
            }}
            onClick={() => handleServiceSelect(service)}
          >
            <CardContent sx={{ textAlign: 'center', p: 4, position: 'relative' }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: selectedService?.id === service.id
                  ? 'linear-gradient(135deg, #fff 0%, #00bfae 100%)'
                  : 'linear-gradient(135deg, #e3f2fd 0%, #b2fef7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                fontSize: 30,
                color: selectedService?.id === service.id ? '#1976d2' : '#00bfae',
                boxShadow: selectedService?.id === service.id ? '0 0 0 4px #fff' : 'none',
              }}>
                {service.category === 'consultation' && '🩺'}
                {service.category === 'specialist' && '👨‍⚕️'}
                {service.category === 'mental-health' && '🧠'}
                {service.category === 'follow-up' && '🔁'}
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: selectedService?.id === service.id ? '#fff' : '#1976d2' }}>
                {service.name}
              </Typography>
              <Typography variant="body2" color={selectedService?.id === service.id ? 'rgba(255,255,255,0.92)' : 'text.secondary'} sx={{ mb: 2, minHeight: 40 }}>
                {service.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 0.5, fontSize: 18, color: selectedService?.id === service.id ? '#fff' : '#1976d2' }} />
                <Typography variant="body2" sx={{ color: selectedService?.id === service.id ? '#fff' : '#1976d2', fontWeight: 500 }}>{service.duration} min</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: selectedService?.id === service.id ? '#fff' : '#00bfae', fontWeight: 700 }}>
                {selectedCountry?.currencySymbol || '$'}{service.price}
              </Typography>
              {service.isOnline && (
                <Chip
                  icon={<VideoCall />}
                  label="Online"
                  size="small"
                  color={selectedService?.id === service.id ? 'default' : 'primary'}
                  variant="outlined"
                  sx={{ mt: 1, color: selectedService?.id === service.id ? '#fff' : undefined, borderColor: selectedService?.id === service.id ? '#fff' : undefined, background: selectedService?.id === service.id ? 'rgba(255,255,255,0.12)' : undefined }}
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
            Smart recommendations based on your preferences. Confidence: {bookingResult.confidenceLevel}
          </Typography>
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 0.5 }}>
        Recommended Doctors
      </Typography>
      <Grid container spacing={4}>
        {doctors
          .filter(doctor => selectedCountry ? doctor.country === selectedCountry.code : true)
          .map((doctor) => (
          <Grid item xs={12} md={6} key={doctor.id}>
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                background: selectedDoctor?.id === doctor.id
                  ? 'linear-gradient(135deg, #1976d2 0%, #00bfae 100%)'
                  : 'rgba(255,255,255,0.7)',
                boxShadow: selectedDoctor?.id === doctor.id
                  ? '0 8px 32px 0 rgba(25,118,210,0.18), 0 4px 20px rgba(0,191,174,0.12)'
                  : '0 2px 12px rgba(25,118,210,0.07)',
                border: selectedDoctor?.id === doctor.id ? '2.5px solid #00bfae' : '1.5px solid #e0e0e0',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 12px 32px 0 rgba(25,118,210,0.22), 0 4px 20px rgba(0,191,174,0.16)'
                },
              }}
              onClick={() => handleDoctorSelect(doctor)}
            >
              <CardContent sx={{ p: 4, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={doctor.image}
                    sx={{ width: 64, height: 64, mr: 2, boxShadow: selectedDoctor?.id === doctor.id ? '0 0 0 4px #fff' : '0 0 0 2px #b2fef7', border: selectedDoctor?.id === doctor.id ? '2px solid #00bfae' : '1px solid #e0e0e0', background: selectedDoctor?.id === doctor.id ? '#fff' : '#e3f2fd' }}
                  >
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: selectedDoctor?.id === doctor.id ? '#fff' : '#1976d2' }}>{doctor.name}</Typography>
                    <Typography variant="body2" sx={{ color: selectedDoctor?.id === doctor.id ? 'rgba(255,255,255,0.92)' : 'text.secondary' }}>
                      {doctor.specialty}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Rating value={doctor.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 0.5, color: selectedDoctor?.id === doctor.id ? '#fff' : '#1976d2' }}>
                        {doctor.rating} ({doctor.reviews})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: selectedDoctor?.id === doctor.id ? '#fff' : 'text.secondary' }}>
                    {doctor.availability}
                  </Typography>
                  <Typography variant="h6" sx={{ color: selectedDoctor?.id === doctor.id ? '#fff' : '#00bfae', fontWeight: 700 }}>
                    {selectedCountry?.currencySymbol || '$'}{doctor.price}
                  </Typography>
                </Box>
                {doctor.isOnline && (
                  <Chip
                    icon={<VideoCall />}
                    label="Available Online"
                    size="small"
                    color={selectedDoctor?.id === doctor.id ? 'default' : 'success'}
                    variant="outlined"
                    sx={{ mt: 1, color: selectedDoctor?.id === doctor.id ? '#fff' : undefined, borderColor: selectedDoctor?.id === doctor.id ? '#fff' : undefined, background: selectedDoctor?.id === doctor.id ? 'rgba(255,255,255,0.12)' : undefined }}
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
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 0.5 }}>
          Available Time Slots
        </Typography>
        <Grid container spacing={4}>
          {availableSlots.map((slot) => (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 4,
                  background: selectedTimeSlot?.id === slot.id
                    ? 'linear-gradient(135deg, #1976d2 0%, #00bfae 100%)'
                    : 'rgba(255,255,255,0.7)',
                  boxShadow: selectedTimeSlot?.id === slot.id
                    ? '0 8px 32px 0 rgba(25,118,210,0.18), 0 4px 20px rgba(0,191,174,0.12)'
                    : '0 2px 12px rgba(25,118,210,0.07)',
                  border: selectedTimeSlot?.id === slot.id ? '2.5px solid #00bfae' : '1.5px solid #e0e0e0',
                  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 12px 32px 0 rgba(25,118,210,0.22), 0 4px 20px rgba(0,191,174,0.16)'
                  },
                }}
                onClick={() => handleTimeSlotSelect(slot)}
              >
                <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative' }}>
                  <CalendarToday sx={{ fontSize: 44, color: selectedTimeSlot?.id === slot.id ? '#fff' : 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight={700} sx={{ color: selectedTimeSlot?.id === slot.id ? '#fff' : '#1976d2' }}>
                    {new Date(slot.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: selectedTimeSlot?.id === slot.id ? '#fff' : '#00bfae', fontSize: 22, mb: 1 }}>
                    {slot.time}
                  </Typography>
                  <Typography variant="body2" sx={{ color: selectedTimeSlot?.id === slot.id ? 'rgba(255,255,255,0.92)' : 'text.secondary', mb: 1 }}>
                    {slot.duration} minutes
                  </Typography>
                  <Typography variant="h6" sx={{ color: selectedTimeSlot?.id === slot.id ? '#fff' : '#00bfae', fontWeight: 700, mt: 1 }}>
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 0.5, textAlign: 'center' }}>
        Booking Summary
      </Typography>
      <Paper sx={{
        p: 4,
        mb: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #b2fef7 100%)',
        boxShadow: '0 8px 32px 0 rgba(25,118,210,0.10), 0 4px 20px rgba(0,191,174,0.10)',
        border: '2px solid #00bfae',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1.5, color: '#00bfae', fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700 }}>Service</Typography>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>{selectedService?.name}</Typography>
                <Typography variant="body2" sx={{ color: '#1976d2', opacity: 0.7 }}>{selectedService?.description}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>{selectedService?.duration} minutes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#00bfae', fontWeight: 700 }}>
                {selectedCountry?.currencySymbol || '$'}{selectedService?.price}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={selectedDoctor?.image} sx={{ width: 44, height: 44, mr: 2, border: '2px solid #00bfae', boxShadow: '0 0 0 4px #fff' }}>
                {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700 }}>Doctor</Typography>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>{selectedDoctor?.name}</Typography>
                <Typography variant="body2" sx={{ color: '#1976d2', opacity: 0.7 }}>{selectedDoctor?.specialty}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                {selectedTimeSlot && new Date(selectedTimeSlot.date).toLocaleDateString()} at {selectedTimeSlot?.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {bookingPreferences.consultationType === 'video' ? (
                <VideoCall sx={{ mr: 1.5, color: '#00bfae', fontSize: 28 }} />
              ) : (
                <Phone sx={{ mr: 1.5, color: '#00bfae', fontSize: 28 }} />
              )}
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                {bookingPreferences.consultationType === 'video' ? 'Video Call' : 'Phone Call'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ position: 'absolute', right: 24, bottom: 24, opacity: 0.12, fontSize: 120, pointerEvents: 'none' }}>
          <CheckCircle sx={{ fontSize: 120, color: '#00bfae' }} />
        </Box>
      </Paper>

      <Alert severity="success" sx={{ mb: 3, borderRadius: 2, background: 'linear-gradient(90deg, #e0ffe8 0%, #b2fef7 100%)', color: '#1976d2', fontWeight: 600, fontSize: 18 }}>
        <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 600 }}>
          <CheckCircle sx={{ mr: 1, verticalAlign: 'middle', color: '#00bfae' }} />
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