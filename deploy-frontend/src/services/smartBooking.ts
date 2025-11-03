import { Doctor, TimeSlot, BookingPreferences, SmartBookingResult, Service } from '../types';

export class SmartBookingAlgorithm {
  private static instance: SmartBookingAlgorithm;

  private constructor() {}

  public static getInstance(): SmartBookingAlgorithm {
    if (!SmartBookingAlgorithm.instance) {
      SmartBookingAlgorithm.instance = new SmartBookingAlgorithm();
    }
    return SmartBookingAlgorithm.instance;
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

    // Rating score (25% weight)
    score += (doctor.rating / 5) * 25;

    // Price competitiveness (15% weight)
    const priceScore = Math.max(0, 15 - Math.abs(doctor.price - 75) / 10);
    score += priceScore;

    // Online availability (15% weight)
    if (doctor.isOnline) score += 15;

    // Experience bonus (10% weight)
    if (doctor.experience && doctor.experience > 5) {
      score += 10;
    }

    // Urgency consideration (5% weight)
    if (preferences.urgency === 'high' && doctor.isOnline) {
      score += 5;
    }

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
          doctorId: doctor.id
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