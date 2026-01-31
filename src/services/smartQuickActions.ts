import { Patient, Appointment } from '../types';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  category: 'patient' | 'schedule' | 'communication' | 'emergency';
  smartScore: number;
  estimatedTime: number; // in minutes
  prerequisites?: string[];
  action: () => void;
}

export interface SmartContext {
  currentTime: Date;
  waitingRoomCount: number;
  urgentPatients: number;
  todaysAppointments: number;
  completedToday: number;
  averageConsultationTime: number;
  nextAppointmentTime?: Date;
  workloadLevel: 'low' | 'medium' | 'high' | 'overloaded';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export class SmartQuickActionsService {
  private static instance: SmartQuickActionsService;

  public static getInstance(): SmartQuickActionsService {
    if (!SmartQuickActionsService.instance) {
      SmartQuickActionsService.instance = new SmartQuickActionsService();
    }
    return SmartQuickActionsService.instance;
  }

  /**
   * Generate smart quick actions based on current context
   */
  generateSmartActions(context: SmartContext): QuickAction[] {
    const actions: QuickAction[] = [];

    // Emergency & Urgent Actions
    if (context.urgentPatients > 0) {
      actions.push({
        id: 'handle-urgent-patient',
        title: 'Handle Urgent Patient',
        description: `Address ${context.urgentPatients} urgent patient(s) immediately`,
        icon: 'emergency',
        priority: 'high',
        category: 'emergency',
        smartScore: 95 + (context.urgentPatients * 5),
        estimatedTime: 5,
        action: () => console.log('Handle urgent patient')
      });
    }

    // Workload-based actions
    if (context.workloadLevel === 'overloaded') {
      actions.push({
        id: 'delegate-tasks',
        title: 'Delegate Tasks',
        description: 'Consider delegating routine tasks to reduce workload',
        icon: 'group_add',
        priority: 'high',
        category: 'schedule',
        smartScore: 85,
        estimatedTime: 2,
        action: () => console.log('Delegate tasks')
      });
    }

    // Time-based smart actions
    if (context.timeOfDay === 'afternoon' && context.todaysAppointments > 0) {
      actions.push({
        id: 'review-afternoon-schedule',
        title: 'Review Afternoon Schedule',
        description: 'Optimize remaining appointments for better flow',
        icon: 'schedule',
        priority: 'medium',
        category: 'schedule',
        smartScore: 75,
        estimatedTime: 3,
        action: () => console.log('Review afternoon schedule')
      });
    }

    // Patient queue management
    if (context.waitingRoomCount > 3) {
      actions.push({
        id: 'optimize-queue',
        title: 'Optimize Patient Queue',
        description: 'Reorganize waiting room for efficient consultations',
        icon: 'queue',
        priority: 'high',
        category: 'patient',
        smartScore: 80 + (context.waitingRoomCount * 2),
        estimatedTime: 2,
        action: () => console.log('Optimize queue')
      });
    }

    // Communication actions
    if (context.completedToday > 5) {
      actions.push({
        id: 'send-followup-reminders',
        title: 'Send Follow-up Reminders',
        description: 'Automatically send reminders for follow-up appointments',
        icon: 'notifications',
        priority: 'medium',
        category: 'communication',
        smartScore: 70,
        estimatedTime: 5,
        action: () => console.log('Send follow-up reminders')
      });
    }

    // Break and wellness actions
    if (context.workloadLevel === 'high' && context.currentTime.getHours() >= 14) {
      actions.push({
        id: 'take-break',
        title: 'Take a Wellness Break',
        description: 'Consider a short break to maintain optimal performance',
        icon: 'self_improvement',
        priority: 'medium',
        category: 'schedule',
        smartScore: 65,
        estimatedTime: 10,
        action: () => console.log('Take wellness break')
      });
    }

    // Predictive actions based on patterns
    if (context.averageConsultationTime > 25) {
      actions.push({
        id: 'streamline-consultations',
        title: 'Streamline Consultations',
        description: 'Use templates and checklists to reduce consultation time',
        icon: 'speed',
        priority: 'medium',
        category: 'schedule',
        smartScore: 60,
        estimatedTime: 5,
        action: () => console.log('Streamline consultations')
      });
    }

    // Default actions always available
    actions.push(
      {
        id: 'add-walk-in',
        title: 'Add Walk-in Patient',
        description: 'Register a new patient arriving without appointment',
        icon: 'person_add',
        priority: 'low',
        category: 'patient',
        smartScore: 40,
        estimatedTime: 3,
        action: () => console.log('Add walk-in patient')
      },
      {
        id: 'bulk-notifications',
        title: 'Send Bulk Notifications',
        description: 'Send messages to multiple patients at once',
        icon: 'campaign',
        priority: 'low',
        category: 'communication',
        smartScore: 35,
        estimatedTime: 8,
        action: () => console.log('Send bulk notifications')
      },
      {
        id: 'schedule-emergency',
        title: 'Schedule Emergency Slot',
        description: 'Create an immediate appointment slot for urgent cases',
        icon: 'schedule',
        priority: 'medium',
        category: 'schedule',
        smartScore: 50,
        estimatedTime: 2,
        action: () => console.log('Schedule emergency slot')
      }
    );

    // Sort by smart score (higher = more recommended)
    return actions.sort((a, b) => b.smartScore - a.smartScore);
  }

  /**
   * Analyze current context to determine workload level
   */
  analyzeWorkloadLevel(context: SmartContext): SmartContext {
    const workloadScore =
      (context.waitingRoomCount * 2) +
      (context.urgentPatients * 5) +
      (context.todaysAppointments * 0.5) +
      (context.averageConsultationTime > 20 ? 3 : 0);

    if (workloadScore >= 15) {
      context.workloadLevel = 'overloaded';
    } else if (workloadScore >= 10) {
      context.workloadLevel = 'high';
    } else if (workloadScore >= 5) {
      context.workloadLevel = 'medium';
    } else {
      context.workloadLevel = 'low';
    }

    return context;
  }

  /**
   * Get time of day context
   */
  getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Calculate action priority based on context
   */
  calculateActionPriority(action: QuickAction, context: SmartContext): QuickAction {
    let priorityMultiplier = 1;

    // Boost priority for urgent situations
    if (context.urgentPatients > 0 && action.category === 'emergency') {
      priorityMultiplier += 2;
    }

    // Boost priority for high workload
    if (context.workloadLevel === 'overloaded' && action.category === 'schedule') {
      priorityMultiplier += 1.5;
    }

    // Boost priority for time-sensitive actions
    if (context.timeOfDay === 'afternoon' && action.id.includes('schedule')) {
      priorityMultiplier += 1.2;
    }

    action.smartScore *= priorityMultiplier;
    return action;
  }
}