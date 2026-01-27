import { Doctor, TimeSlot, BookingPreferences, SmartBookingResult, Service } from '../types';

export class SmartBookingAlgorithm {
  private static instance: SmartBookingAlgorithm;
  private doctors: Doctor[];
  private timeSlots: TimeSlot[];

  constructor(doctors?: Doctor[], timeSlots?: TimeSlot[]) {
    this.doctors = doctors || [];
    this.timeSlots = timeSlots || [];
  }

  public static getInstance(): SmartBookingAlgorithm {
    if (!SmartBookingAlgorithm.instance) {
      SmartBookingAlgorithm.instance = new SmartBookingAlgorithm();
    }
    return SmartBookingAlgorithm.instance;
  }

  /**
   * Main algorithm to find optimal booking slots based on user preferences
   */
  findOptimalSlots(
    serviceId: number,
    preferences: BookingPreferences,
    maxResults: number = 5
  ): SmartBookingResult {
    const scoredSlots = this.timeSlots
      .filter(slot => slot.available)
      .map(slot => ({
        ...slot,
        score: this.calculateSlotScore(slot, preferences),
        doctor: this.doctors.find(d => d.id === slot.doctorId)!
      }))
      .filter(slot => slot.doctor)
      .sort((a, b) => b.score - a.score);

    const recommended = scoredSlots.slice(0, maxResults);
    const alternative = scoredSlots.slice(maxResults, maxResults * 2);

    return {
      recommendedSlots: recommended.map(s => ({ ...s, isPreferred: true })),
      alternativeSlots: alternative,
      reasoning: `Recommended based on your preferences: ${preferences.preferredTimeOfDay || 'any time'}, ${preferences.urgency || 'standard'} urgency, and doctor availability.`,
      confidence: this.calculateConfidence(recommended, preferences)
    };
  }

  /**
   * Machine Learning inspired scoring algorithm
   */
  private calculateSlotScore(slot: TimeSlot, preferences: BookingPreferences): number {
    const doctor = this.doctors.find(d => d.id === slot.doctorId)!;
    let score = 0;

    // Base score from doctor quality (40% weight)
    score += (doctor.rating / 5) * 40;

    // Time preference matching (25% weight)
    score += this.getTimePreferenceScore(slot.time, preferences.preferredTime || 'any') * 25;

    // Price optimization (15% weight)
    if (preferences.maxPrice) {
      const priceScore = Math.max(0, 1 - (slot.price || doctor.price) / preferences.maxPrice);
      score += priceScore * 15;
    }

    // Urgency handling (10% weight)
    score += this.getUrgencyScore(slot.date, preferences.urgency) * 10;

    // Doctor availability and popularity (10% weight)
    score += (doctor.isOnline ? 5 : 0) + Math.min(doctor.reviews / 100, 5);

    return Math.min(score, 100); // Cap at 100
  }

  private getTimePreferenceScore(slotTime: string, preference?: string): number {
    const hour = parseInt(slotTime.split(':')[0]);
    
    switch (preference) {
      case 'morning':
        return hour >= 6 && hour <= 12 ? 1 : Math.max(0, 1 - Math.abs(hour - 9) / 12);
      case 'afternoon':
        return hour >= 12 && hour <= 17 ? 1 : Math.max(0, 1 - Math.abs(hour - 14) / 12);
      case 'evening':
        return hour >= 17 && hour <= 21 ? 1 : Math.max(0, 1 - Math.abs(hour - 19) / 12);
      default:
        return 0.8; // Neutral for 'any'
    }
  }

  private getUrgencyScore(slotDate: string, urgency: string): number {
    const daysDiff = Math.floor((new Date(slotDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    switch (urgency) {
      case 'urgent':
        return daysDiff <= 1 ? 1 : Math.max(0, 1 - daysDiff / 7);
      case 'normal':
        return daysDiff >= 1 && daysDiff <= 7 ? 1 : Math.max(0, 1 - Math.abs(daysDiff - 3) / 10);
      case 'flexible':
        return 0.8; // Constant moderate score
      default:
        return 0.5;
    }
  }

  private generateRecommendationReasons(topSlot: any, preferences: BookingPreferences): string[] {
    const reasons = [];
    const doctor = topSlot.doctor;

    if (doctor.rating >= 4.5) {
      reasons.push(`Highly rated doctor (${doctor.rating}/5 stars)`);
    }

    if (preferences.urgency === 'high' && this.getUrgencyScore(topSlot.date, 'high') > 0.8) {
      reasons.push('Available for urgent appointment');
    }

    if (doctor.isOnline && preferences.consultationType !== 'in-person') {
      reasons.push('Offers online consultations');
    }

    if (preferences.maxPrice && (topSlot.price || doctor.price) <= preferences.maxPrice * 0.8) {
      reasons.push('Great value for money');
    }

    return reasons;
  }

  private calculateConfidence(recommended: any[], preferences: BookingPreferences): number {
    if (recommended.length === 0) return 0;
    
    const avgScore = recommended.reduce((sum, slot) => sum + slot.score, 0) / recommended.length;
    const scoreVariance = recommended.reduce((sum, slot) => sum + Math.pow(slot.score - avgScore, 2), 0) / recommended.length;
    
    // Higher confidence for higher average scores and lower variance
    return Math.min(95, (avgScore / 100) * 80 + (1 / (1 + scoreVariance)) * 15);
  }

  /**
   * Dynamic pricing algorithm based on demand and availability
   */
  calculateDynamicPrice(basePrice: number, slot: TimeSlot, demand: number): number {
    const demandMultiplier = 1 + (demand - 0.5) * 0.3; // ±15% based on demand
    const timeMultiplier = this.getTimeBasedPricing(slot.time);
    
    return Math.round(basePrice * demandMultiplier * timeMultiplier);
  }

  private getTimeBasedPricing(time: string): number {
    const hour = parseInt(time.split(':')[0]);
    
    // Premium hours (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17) {
      return 1.1;
    }
    // Evening hours
    if (hour >= 18 && hour <= 20) {
      return 1.05;
    }
    // Early morning or late evening
    return 0.95;
  }

  /**
   * AI-powered doctor matching algorithm
   */
  async findOptimalDoctor(
    doctors: Doctor[],
    preferences: BookingPreferences,
    patientHistory?: any
  ): Promise<SmartBookingResult> {
    console.log('🤖 Running AI doctor matching algorithm...');

    // Simulate AI processing time
    await this.simulateProcessingDelay(2000);

    // Calculate match scores for each doctor
    const scoredDoctors = doctors.map(doctor => ({
      doctor,
      score: this.calculateDoctorScore(doctor, preferences, patientHistory),
      reasoning: this.generateMatchReasoning(doctor, preferences)
    }));

    // Sort by score (highest first)
    scoredDoctors.sort((a, b) => b.score - a.score);

    const bestMatch = scoredDoctors[0];
    const alternatives = scoredDoctors.slice(1, 3).map(item => item.doctor);

    return {
      recommendedDoctor: bestMatch.doctor,
      matchScore: Math.round(bestMatch.score),
      reasoning: bestMatch.reasoning,
      alternativeOptions: alternatives,
      estimatedWaitTime: this.calculateWaitTime(bestMatch.doctor),
      confidenceLevel: this.getConfidenceLevel(bestMatch.score)
    };
  }

  /**
   * Intelligent time slot optimization
   */
  async optimizeTimeSlots(
    doctor: Doctor,
    preferences: BookingPreferences,
    existingBookings: TimeSlot[] = []
  ): Promise<TimeSlot[]> {
    console.log('📅 Optimizing time slots with AI...');

    await this.simulateProcessingDelay(1500);

    const optimizedSlots: TimeSlot[] = [];
    const today = new Date();

    // Generate slots for next 14 days
    for (let day = 0; day < 14; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);

      // Skip non-preferred days
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (preferences.preferredDays.length > 0 && !preferences.preferredDays.includes(dayName)) {
        continue;
      }

      // Generate time slots based on preferences and doctor availability
      const timeSlots = this.generateSmartTimeSlots(date, preferences, doctor);

      optimizedSlots.push(...timeSlots);
    }

    return optimizedSlots.slice(0, 12); // Return first 12 slots
  }

  private calculateDoctorScore(doctor: Doctor, preferences: BookingPreferences, patientHistory?: any): number {
    let score = 0;

    // Specialty match (30% weight)
    if (preferences.preferredSpecialties.includes(doctor.specialty)) {
      score += 30;
    }

    // Rating (25% weight)
    score += (doctor.rating / 5) * 25;

    // Experience (15% weight)
    if (doctor.experience) {
      score += Math.min(doctor.experience / 10, 1) * 15;
    }

    // Availability (15% weight)
    if (doctor.isOnline) {
      score += 15;
    }

    // Reviews (10% weight)
    score += Math.min(doctor.reviews / 100, 10);

    return Math.min(100, score);
  }

  private generateMatchReasoning(doctor: Doctor, preferences: BookingPreferences): string {
    const reasons = [];

    if (preferences.preferredSpecialties.includes(doctor.specialty)) {
      reasons.push(`Specializes in ${doctor.specialty}`);
    }

    if (doctor.rating >= 4.5) {
      reasons.push('Highly rated by patients');
    }

    if (doctor.isOnline) {
      reasons.push('Available for online consultations');
    }

    if (doctor.experience && doctor.experience > 5) {
      reasons.push(`${doctor.experience} years of experience`);
    }

    return reasons.join(', ') || 'Good overall match for your needs';
  }

  private calculateWaitTime(doctor: Doctor): string {
    // Simulate wait time calculation
    const waitTimes = ['Available now', 'Next available: 30 min', 'Next available: 2 hours', 'Next available: Tomorrow'];
    return waitTimes[Math.floor(Math.random() * waitTimes.length)];
  }

  private getConfidenceLevel(score: number): string {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  private generateSmartTimeSlots(date: Date, preferences: BookingPreferences, doctor: Doctor): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();

    // Generate time slots based on preferences
    let startHour = 9;
    let endHour = 17;

    if (preferences.preferredTimeOfDay === 'morning') {
      endHour = 12;
    } else if (preferences.preferredTimeOfDay === 'afternoon') {
      startHour = 13;
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        slots.push({
          id: `${doctor.id}-${date.toISOString().split('T')[0]}-${timeString}`,
          date: dateString,
          time: timeString,
          available: Math.random() > 0.3, // 70% availability
          doctorId: doctor.id,
          price: doctor.price,
          duration: 30
        });
      }
    }

    return slots.filter(slot => slot.available);
  }

  private async simulateProcessingDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Auto-scheduling algorithm for recurring appointments
export class AutoScheduler {
  static suggestRecurringSlots(
    frequency: 'weekly' | 'biweekly' | 'monthly',
    startDate: Date,
    doctorId: number,
    timeSlots: TimeSlot[],
    count: number = 4
  ): TimeSlot[] {
    const suggestions: TimeSlot[] = [];
    const intervalDays = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
    
    for (let i = 0; i < count; i++) {
      const targetDate = new Date(startDate);
      targetDate.setDate(targetDate.getDate() + (intervalDays * i));
      
      const availableSlot = timeSlots.find(slot => 
        slot.doctorId === doctorId &&
        slot.date === targetDate.toISOString().split('T')[0] &&
        slot.available
      );
      
      if (availableSlot) {
        suggestions.push(availableSlot);
      }
    }
    
    return suggestions;
  }
}

// Smart notification system
export class BookingNotificationService {
  static generateSmartReminders(appointment: any): Array<{type: string, timing: string, message: string}> {
    return [
      {
        type: 'confirmation',
        timing: 'immediate',
        message: `Your appointment with Dr. ${appointment.doctorName} is confirmed for ${appointment.date} at ${appointment.time}`
      },
      {
        type: 'preparation',
        timing: '1-day-before',
        message: 'Prepare for your appointment: Have your medical history and current symptoms ready'
      },
      {
        type: 'reminder',
        timing: '2-hours-before',
        message: 'Your telehealth appointment starts in 2 hours. Test your camera and microphone.'
      },
      {
        type: 'final-reminder',
        timing: '15-minutes-before',
        message: 'Your appointment starts in 15 minutes. Click here to join the consultation.'
      }
    ];
  }
}