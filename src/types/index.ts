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
  // Discount and pricing features
  discountSettings?: {
    isEnabled: boolean;
    discountPercentage: number;
    discountDescription: string;
    startDate: string;
    endDate: string;
    applicableServices?: string[];
  };
  pricingHistory?: PricingActivity[];
}

export interface PricingActivity {
  id: string;
  doctorId: number;
  action: 'discount_enabled' | 'discount_disabled' | 'discount_updated' | 'price_changed';
  oldPrice?: number;
  newPrice?: number;
  discountPercentage?: number;
  description: string;
  timestamp: string;
  metadata?: any;
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

export interface Medication {
  id: string;
  name: string;
  medicationName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: string;
  isActive: boolean;
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

// Clinical Decision Support (CDS) Types
export interface CDSRule {
  id: string;
  name: string;
  description: string;
  category: 'medication' | 'diagnostic' | 'preventive' | 'monitoring' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditions: CDSCondition[];
  actions: CDSAction[];
  evidence?: string;
  guidelines?: string[];
  lastUpdated: string;
  isActive: boolean;
}

export interface CDSCondition {
  type: 'patient_age' | 'medication' | 'diagnosis' | 'lab_value' | 'vital_sign' | 'symptom' | 'allergy' | 'pregnancy' | 'comorbidity' | 'gender';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'between' | 'in' | 'not_in';
  value: any;
  unit?: string;
  timeframe?: string; // e.g., 'last_30_days', 'current'
}

export interface CDSAction {
  type: 'recommend_medication' | 'order_lab' | 'schedule_followup' | 'alert_provider' | 'suggest_diagnosis' | 'preventive_care' | 'lifestyle_advice';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  supportingEvidence?: string;
  alternatives?: string[];
  contraindications?: string[];
}

export interface CDSRecommendation {
  id: string;
  ruleId: string;
  patientId: number;
  providerId: number;
  encounterId?: string;
  title: string;
  description: string;
  category: CDSRule['category'];
  priority: CDSRule['priority'];
  severity: CDSAction['severity'];
  supportingEvidence: string;
  suggestedActions: string[];
  alternatives?: string[];
  contraindications?: string[];
  confidence: number; // 0-1 scale
  triggeredConditions: CDSCondition[];
  knowledgeSources: string[];
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'accepted' | 'rejected' | 'implemented';
  providerResponse?: string;
  implementedDate?: string;
}

export interface CDSKnowledgeSource {
  id: string;
  name: string;
  type: 'drug_database' | 'lab_reference' | 'clinical_guideline' | 'risk_calculator' | 'evidence_base';
  description: string;
  source: string; // URL or reference
  lastUpdated: string;
  version: string;
  credibility: 'high' | 'medium' | 'low';
  categories: string[];
}

export interface CDSEncounter {
  id: string;
  patientId: number;
  providerId: number;
  appointmentId?: number;
  startTime: string;
  endTime?: string;
  chiefComplaint: string;
  symptoms: string[];
  vitalSigns: VitalSigns;
  assessments: string[];
  diagnoses: string[];
  medications: Medication[];
  labsOrdered: LabOrder[];
  recommendations: CDSRecommendation[];
  notes: string;
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    timestamp: string;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  timestamp: string;
}

export interface LabOrder {
  id: string;
  testName: string;
  testCode: string;
  category: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  result?: number;
  resultText?: string;
  status: 'ordered' | 'collected' | 'pending' | 'completed' | 'cancelled';
  orderedDate: string;
  collectedDate?: string;
  resultDate?: string;
  notes?: string;
}

export interface CDSContext {
  patient: Patient;
  encounter?: CDSEncounter;
  vitalSigns?: VitalSigns;
  recentLabs?: LabOrder[];
  currentMedications?: Medication[];
  allergies: string[];
  diagnoses: string[];
  age: number;
  gender: 'male' | 'female' | 'other';
  pregnancyStatus?: boolean;
  smokingStatus?: 'never' | 'former' | 'current';
  comorbidities: string[];
  chiefComplaint?: string;
  symptoms: string[];
  providerSpecialty?: string;
  encounterType: 'office_visit' | 'telehealth' | 'urgent_care' | 'emergency';
}