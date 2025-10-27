import { useState, useCallback, useEffect } from 'react';
import { SmartBookingAlgorithm, AutoScheduler, BookingNotificationService } from '../services/smartBooking';
import { Doctor, TimeSlot, BookingPreferences, SmartBookingResult, Appointment } from '../types';

export interface BookingState {
  loading: boolean;
  error: string | null;
  smartResults: SmartBookingResult | null;
  selectedSlot: TimeSlot | null;
  bookingStep: number;
  preferences: BookingPreferences;
}

export const useSmartBooking = () => {
  const [state, setState] = useState<BookingState>({
    loading: false,
    error: null,
    smartResults: null,
    selectedSlot: null,
    bookingStep: 0,
    preferences: {
      preferredTimeOfDay: 'morning',
      preferredDays: [],
      preferredSpecialties: [],
      preferredTime: 'any',
      consultationType: 'video',
      urgency: 'medium',
      language: 'English'
    }
  });

  // Mock data - in real app, this would come from API
  const mockDoctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      rating: 4.8,
      reviews: 324,
      price: 75,
      availability: "Available Today",
      image: "/api/placeholder/150/150",
      location: "New York, NY",
      country: "US",
      countryName: "United States",
      isOnline: true,
      experience: 8
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Mental Health",
      rating: 4.9,
      reviews: 198,
      price: 120,
      availability: "Available Tomorrow",
      image: "/api/placeholder/150/150",
      location: "San Francisco, CA",
      country: "US",
      countryName: "United States",
      isOnline: true,
      experience: 12
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      rating: 4.7,
      reviews: 156,
      price: 95,
      availability: "Available This Week",
      image: "/api/placeholder/150/150",
      location: "Los Angeles, CA",
      country: "US",
      countryName: "United States",
      isOnline: true,
      experience: 6
    }
  ];

  const generateTimeSlots = useCallback(() => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    // Generate slots for next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      // Generate slots for each doctor
      mockDoctors.forEach(doctor => {
        // Morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push({
              id: `${doctor.id}-${date.toISOString().split('T')[0]}-${timeString}`,
              doctorId: doctor.id,
              date: date.toISOString().split('T')[0],
              time: timeString,
              available: Math.random() > 0.3, // 70% availability
              price: doctor.price
            });
          }
        }
        
        // Afternoon slots (2 PM - 5 PM)
        for (let hour = 14; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push({
              id: `${doctor.id}-${date.toISOString().split('T')[0]}-${timeString}`,
              doctorId: doctor.id,
              date: date.toISOString().split('T')[0],
              time: timeString,
              available: Math.random() > 0.4, // 60% availability
              price: doctor.price
            });
          }
        }
      });
    }
    
    return slots;
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<BookingPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences }
    }));
  }, []);

  const runSmartBooking = useCallback(async (serviceId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timeSlots = generateTimeSlots();
      const algorithm = new SmartBookingAlgorithm(mockDoctors, timeSlots);
      const results = algorithm.findOptimalSlots(serviceId, state.preferences, 6);
      
      setState(prev => ({
        ...prev,
        loading: false,
        smartResults: results
      }));
      
      return results;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to find available slots. Please try again.'
      }));
      throw error;
    }
  }, [state.preferences, generateTimeSlots]);

  const selectSlot = useCallback((slot: TimeSlot) => {
    setState(prev => ({
      ...prev,
      selectedSlot: slot
    }));
  }, []);

  const bookAppointment = useCallback(async (patientInfo: any) => {
    if (!state.selectedSlot) {
      throw new Error('No slot selected');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointment: Appointment = {
        id: Date.now(),
        doctorId: state.selectedSlot.doctorId,
        patientId: patientInfo.id || 1,
        date: state.selectedSlot.date,
        time: state.selectedSlot.time,
        type: state.preferences.consultationType as 'video' | 'in-person',
        status: 'scheduled',
        price: state.selectedSlot.price || 0,
        reason: patientInfo.reason
      };

      // Generate smart notifications
      const doctor = mockDoctors.find(d => d.id === state.selectedSlot!.doctorId);
      const notifications = BookingNotificationService.generateSmartReminders({
        ...appointment,
        doctorName: doctor?.name
      });

      setState(prev => ({
        ...prev,
        loading: false,
        bookingStep: prev.bookingStep + 1
      }));

      return { appointment, notifications };
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to book appointment. Please try again.'
      }));
      throw error;
    }
  }, [state.selectedSlot, state.preferences, mockDoctors]);

  const scheduleRecurring = useCallback(async (frequency: 'weekly' | 'biweekly' | 'monthly', count: number) => {
    if (!state.selectedSlot) {
      throw new Error('No slot selected for recurring booking');
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      const timeSlots = generateTimeSlots();
      const recurringSlots = AutoScheduler.suggestRecurringSlots(
        frequency,
        new Date(state.selectedSlot.date),
        state.selectedSlot.doctorId,
        timeSlots,
        count
      );

      setState(prev => ({ ...prev, loading: false }));
      
      return recurringSlots;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to schedule recurring appointments.'
      }));
      throw error;
    }
  }, [state.selectedSlot, generateTimeSlots]);

  const resetBooking = useCallback(() => {
    setState({
      loading: false,
      error: null,
      smartResults: null,
      selectedSlot: null,
      bookingStep: 0,
      preferences: {
        preferredTimeOfDay: 'morning',
        preferredDays: [],
        preferredSpecialties: [],
        preferredTime: 'any',
        consultationType: 'video',
        urgency: 'medium',
        language: 'English'
      }
    });
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      bookingStep: prev.bookingStep + 1
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      bookingStep: Math.max(0, prev.bookingStep - 1)
    }));
  }, []);

  // Real-time availability updates
  useEffect(() => {
    if (state.smartResults) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setState(prev => {
          if (!prev.smartResults) return prev;
          
          // Randomly update slot availability
          const updatedRecommended = prev.smartResults.recommendedSlots.map(slot => ({
            ...slot,
            available: Math.random() > 0.1 // 90% chance to remain available
          }));
          
          return {
            ...prev,
            smartResults: {
              ...prev.smartResults,
              recommendedSlots: updatedRecommended
            }
          };
        });
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.smartResults]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    smartResults: state.smartResults,
    selectedSlot: state.selectedSlot,
    bookingStep: state.bookingStep,
    preferences: state.preferences,
    
    // Actions
    updatePreferences,
    runSmartBooking,
    selectSlot,
    bookAppointment,
    scheduleRecurring,
    resetBooking,
    nextStep,
    prevStep,
    
    // Data
    doctors: mockDoctors
  };
};