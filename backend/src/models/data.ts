import { Doctor, Appointment, Patient, Service, ConsultationSession } from './types';

// Mock Doctors Data
export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.9,
    reviews: 124,
    price: 34,
    availability: 'Available Today',
    image: '/api/placeholder/120/120',
    location: 'Online',
    isOnline: true,
    bio: 'Dr. Sarah Johnson is a board-certified family medicine physician with over 12 years of experience in primary care. She specializes in preventive medicine, chronic disease management, and comprehensive family healthcare.',
    education: [
      'MD - Harvard Medical School (2012)',
      'Residency - Massachusetts General Hospital (2015)',
      'Fellowship - Preventive Medicine, Johns Hopkins (2016)',
    ],
    experience: 12,
    languages: ['English', 'Spanish', 'French'],
    certifications: [
      'Board Certified in Family Medicine',
      'Advanced Cardiac Life Support (ACLS)',
      'Basic Life Support (BLS)',
      'Certified in Telehealth',
    ],
    workingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed',
    },
    services: [
      'Annual Physical Exams',
      'Chronic Disease Management',
      'Preventive Care',
      'Mental Health Screening',
      'Prescription Refills',
      'Urgent Care Consultations',
    ],
    patientReviews: [
      {
        id: 1,
        patientName: 'Emily R.',
        rating: 5,
        comment: 'Dr. Johnson is exceptional! She took the time to listen to all my concerns and provided thorough explanations.',
        date: '2024-03-15',
      },
      {
        id: 2,
        patientName: 'Michael K.',
        rating: 5,
        comment: 'Professional, knowledgeable, and caring. The video consultation was seamless.',
        date: '2024-03-10',
      },
    ],
  },
  // Add more doctors as needed...
];

// Mock Patients Data
export const patients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-05-15',
    address: '123 Main St, Anytown, USA',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0124',
      relationship: 'Spouse',
    },
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  },
];

// Mock Appointments Data
export const appointments: Appointment[] = [
  {
    id: 1,
    doctorId: 1,
    patientId: 1,
    date: '2024-03-20',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled',
    price: 34,
    reason: 'Annual checkup',
  },
];

// Mock Services Data
export const services: Service[] = [
  {
    id: 1,
    name: 'Video Consultation',
    description: 'Connect with a doctor via secure video call',
    price: 34,
    duration: 30,
    category: 'Consultation',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Prescription Refill',
    description: 'Get your prescriptions renewed quickly',
    price: 15,
    duration: 15,
    category: 'Prescription',
    isOnline: true,
  },
];

// Mock Consultation Sessions Data
export const consultationSessions: ConsultationSession[] = [
  {
    id: 'session-1',
    appointmentId: 1,
    doctorId: 1,
    patientId: 1,
    roomId: 'room-123',
    startTime: '2024-03-20T10:00:00Z',
    status: 'waiting',
  },
];