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
  isOnline: boolean;
  bio?: string;
  education?: string[];
  experience?: number;
  languages?: string[];
  certifications?: string[];
  workingHours?: { [key: string]: string };
  services?: string[];
  patientReviews?: PatientReview[];
}

export interface PatientReview {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
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

export interface FileRecord {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  backblazeFileId: string;
  uploadedBy: number; // user ID
  uploadedAt: string;
  category: string; // 'medical_records', 'prescriptions', 'consultation_notes', etc.
  patientId?: number; // optional, for patient-specific files
  appointmentId?: number; // optional, for appointment-specific files
  isPublic: boolean;
  tags?: string[];
  metadata?: { [key: string]: any };
}