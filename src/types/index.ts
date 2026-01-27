export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: number;
  availability: string;
  image: string;
  location: string;
  country?: string;
  countryName?: string;
  isOnline: boolean;
  bio?: string;
  education?: string[];
  experience?: number;
}

export interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  reason?: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isOnline: boolean;
}

export interface ConsultationSession {
  id: string;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  roomId: string;
  startTime: string;
  endTime?: string;
  status: 'waiting' | 'in-progress' | 'completed';
  recordingUrl?: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  doctorId: number;
  price?: number;
  duration?: number;
}

export interface BookingPreferences {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
  preferredDays: string[];
  maxPrice?: number;
  preferredSpecialties: string[];
  urgency: 'low' | 'medium' | 'high';
  consultationType?: 'video' | 'in-person';
  preferredTime?: string;
  language?: string;
}

export interface SmartBookingResult {
  recommendedSlots?: TimeSlot[];
  alternativeSlots?: TimeSlot[];
  reasoning?: string;
  confidence?: number;
  reasons?: string[];
  recommendedDoctor?: Doctor;
  matchScore?: number;
  alternativeOptions?: Doctor[];
  estimatedWaitTime?: string;
  confidenceLevel?: string;
}

export interface VideoSession {
  id: string;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  roomId: string;
  participants: VideoParticipant[];
  startTime: string;
  endTime?: string;
  status: 'waiting' | 'active' | 'ended';
  recordingUrl?: string;
  settings?: VideoSessionSettings;
}

export interface VideoSessionSettings {
  enableChat: boolean;
  enableRecording: boolean;
  enableScreenShare: boolean;
  maxDuration: number;
  autoStartRecording: boolean;
}

export interface VideoParticipant {
  id: string;
  name: string;
  role: string;
  isConnected: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  joinedAt: string;
}

export interface NotificationQueue {
  id: string;
  type: 'appointment' | 'message' | 'emergency' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  userId: number;
  relatedId?: number; // appointment ID, message ID, etc.
}

export interface QueueEntry {
  id: string;
  patientId: number;
  patientName: string;
  appointmentId?: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedWaitTime: number;
  joinedAt: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled' | 'in-consultation';
  notes?: string;
  doctorId?: number;
  position?: number;
  appointmentType?: string;
  notificationsSent?: number;
  lastNotification?: string;
  consultationStarted?: string;
  patientNotes?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  participants: string[]; // participant IDs
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
  type: 'direct' | 'group';
  isActive: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'doctor' | 'patient' | 'admin';
  isOnline: boolean;
  lastSeen?: string;
}

export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'blood-pressure' | 'heart_rate' | 'weight' | 'glucose' | 'temperature' | 'oxygen_saturation' | 'steps' | 'sleep';
  value: number;
  unit: string;
  timestamp: string;
  date: string;
  patientId: number;
  source: 'manual' | 'device' | 'wearable';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system' | 'voice' | 'image';
  fileUrl?: string;
  fileName?: string;
  isRead?: boolean;
  isDelivered?: boolean;
  isEncrypted?: boolean;
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}

export interface PatientDashboardData {
  patientId: number;
  patientName: string;
  lastVisit?: string;
  nextAppointment?: string;
  healthScore: number;
  insights: HealthInsight[];
  recentMetrics: HealthMetric[];
  upcomingAppointments: Appointment[];
  recentPrescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  notifications: NotificationQueue[];
  patient?: Patient;
  healthMetrics?: HealthMetric[];
  recentRecords?: MedicalRecord[];
  activePrescriptions?: Prescription[];
}

export interface HealthInsight {
  id: string;
  type: 'trend' | 'risk' | 'reminder' | 'achievement' | 'alert' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  date: string;
  actionRequired?: boolean;
  relatedMetric?: string;
  recommendation?: string;
  priority?: string;
  category?: string;
  aiGenerated?: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: number;
  doctorId: number;
  date: string;
  type: 'consultation' | 'lab' | 'imaging' | 'procedure' | 'vaccination';
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  attachments?: string[];
  tags: string[];
}

export interface Prescription {
  id: string;
  patientId: number;
  doctorId: number;
  medication: string;
  medicationName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  refillsRemaining: number;
  isActive: boolean;
}