import { Doctor, TimeSlot, BookingPreferences, SmartBookingResult, Service } from '../types';

export class SmartBookingAlgorithm {
  private doctors: Doctor[];
  private timeSlots: TimeSlot[];

  constructor(doctors: Doctor[], timeSlots: TimeSlot[]) {
    this.doctors = doctors;
    this.timeSlots = timeSlots;
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