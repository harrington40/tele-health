import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Badge,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  CardHeader,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  VideoCall,
  Phone,
  Schedule,
  Notifications,
  AccessTime,
  CheckCircle,
  Cancel,
  Message,
  Assessment,
  TrendingUp,
  LocalHospital,
  Chat,
  Settings,
  SmartToy,
  Timer,
  Queue,
  Send,
  Lightbulb,
  Timeline,
  Receipt,
  MedicalServices,
  Assignment,
} from '@mui/icons-material';
import SmartQuickActions from '../components/SmartQuickActions';
import VideoConsultation from '../components/VideoConsultation';
import MessagingSystem from '../components/MessagingSystem';
import CDSRecommendations from '../components/CDSRecommendations';
import { SmartQuickActionsService, SmartContext } from '../services/smartQuickActions';
import { OpenCDSEngine } from '../services/openCDS.service';
import { VideoSession, CDSRecommendation, CDSContext, VitalSigns } from '../types';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  appointmentTime: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  lastVisit?: string;
  notes?: string;
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

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  duration: number;
  notes?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderHours: number;
}

interface DiscountSettings {
  isEnabled: boolean;
  discountPercentage: number;
  discountDescription: string;
  startDate?: string;
  endDate?: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: false,
    reminderHours: 24,
  });

  // Discount settings state
  const [discountSettings, setDiscountSettings] = useState<DiscountSettings>({
    isEnabled: false,
    discountPercentage: 0,
    discountDescription: '',
  });
  const [pricingHistory, setPricingHistory] = useState<any[]>([]);

  // Video and chat state
  const [activeVideoSession, setActiveVideoSession] = useState<VideoSession | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatParticipant, setSelectedChatParticipant] = useState<number | null>(null);

  // CDS (Clinical Decision Support) state
  const [cdsRecommendations, setCdsRecommendations] = useState<CDSRecommendation[]>([]);
  const [selectedPatientForCDS, setSelectedPatientForCDS] = useState<Patient | null>(null);
  const [currentConsultation, setCurrentConsultation] = useState<Patient | null>(null);

  // Mock data - in real app, this would come from API
  const [waitingRoom, setWaitingRoom] = useState<Patient[]>([
    {
      id: 1,
      name: 'Maria Garcia',
      age: 34,
      condition: 'Routine Checkup',
      appointmentTime: '09:00',
      status: 'waiting',
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-20',
      notes: 'Follow-up on blood pressure medication',
      email: 'maria.garcia@example.com',
      phone: '+1-555-0123',
      dateOfBirth: '1990-01-15',
      address: '123 Main St, City, State',
      emergencyContact: { name: 'John Garcia', phone: '+1-555-0124', relationship: 'Spouse' },
      medicalHistory: ['Hypertension'],
      allergies: [],
      medications: ['Lisinopril'],
    },
    {
      id: 2,
      name: 'John Smith',
      age: 45,
      condition: 'Cardiac Consultation',
      appointmentTime: '09:30',
      status: 'waiting',
      priority: 'high',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-15',
      notes: 'Chest pain evaluation',
      email: 'john.smith@example.com',
      phone: '+1-555-0125',
      dateOfBirth: '1979-03-22',
      address: '456 Oak Ave, City, State',
      emergencyContact: { name: 'Jane Smith', phone: '+1-555-0126', relationship: 'Wife' },
      medicalHistory: ['Chest pain', 'Hypertension'],
      allergies: ['Penicillin'],
      medications: ['Aspirin', 'Metoprolol'],
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      age: 28,
      condition: 'Mental Health Session',
      appointmentTime: '10:00',
      status: 'waiting',
      priority: 'medium',
      avatar: '/api/placeholder/40/40',
      lastVisit: '2024-10-25',
      notes: 'Anxiety management follow-up',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0127',
      dateOfBirth: '1996-05-10',
      address: '789 Pine St, City, State',
      emergencyContact: { name: 'Mike Johnson', phone: '+1-555-0128', relationship: 'Brother' },
      medicalHistory: ['Anxiety', 'Depression'],
      allergies: [],
      medications: ['Sertraline'],
    },
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: 'Maria Garcia',
      time: '09:00 AM',
      type: 'video',
      status: 'scheduled',
      duration: 30,
      notes: 'Routine checkup',
    },
    {
      id: 2,
      patientName: 'John Smith',
      time: '09:30 AM',
      type: 'video',
      status: 'confirmed',
      duration: 45,
      notes: 'Cardiac consultation',
    },
    {
      id: 3,
      patientName: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'phone',
      status: 'scheduled',
      duration: 50,
      notes: 'Mental health session',
    },
    {
      id: 4,
      patientName: 'Robert Brown',
      time: '11:00 AM',
      type: 'video',
      status: 'scheduled',
      duration: 30,
      notes: 'Follow-up appointment',
    },
  ]);

  // Smart algorithm: Auto-sort waiting room by priority and time
  const sortedWaitingRoom = React.useMemo(() => {
    return [...waitingRoom].sort((a, b) => {
      // Priority sorting: urgent > high > medium > low
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by appointment time
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });
  }, [waitingRoom]);

  // Smart algorithm: Calculate provider efficiency metrics
  const efficiencyMetrics = React.useMemo(() => {
    const totalAppointments = upcomingAppointments.length;
    const completedToday = upcomingAppointments.filter(apt => apt.status === 'completed').length;
    const averageDuration = upcomingAppointments.reduce((sum, apt) => sum + apt.duration, 0) / totalAppointments;
    const onTimeRate = 85; // Mock percentage

    return {
      totalAppointments,
      completedToday,
      averageDuration: Math.round(averageDuration),
      onTimeRate,
      efficiency: Math.round((completedToday / totalAppointments) * 100),
    };
  }, [upcomingAppointments]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleCompleteConsultation = (patientId: number) => {
    // Update patient status to completed
    setWaitingRoom(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, status: 'completed' as const }
          : p
      )
    );

    // Clear current consultation if it matches
    if (currentConsultation?.id === patientId) {
      setCurrentConsultation(null);
      // Clear CDS recommendations for this patient
      setCdsRecommendations(prev => prev.filter(r => r.patientId !== patientId));
      setSelectedPatientForCDS(null);
    }

    // Switch back to waiting room
    setActiveTab(0);

    console.log(`Completed consultation for patient ${patientId}`);
  };

  const handleSendNotification = (patient: Patient) => {
    setSelectedPatient(patient);
    setNotificationDialog(true);
  };

  const handleNotificationSubmit = () => {
    // Mock notification sending
    console.log('Sending notification to:', selectedPatient?.name);
    setNotificationDialog(false);
    setSelectedPatient(null);
  };

  // Smart Actions
  const [smartActions, setSmartActions] = useState<any[]>([]);

  useEffect(() => {
    const quickActionsService = SmartQuickActionsService.getInstance();
    const currentHour = new Date().getHours();
    const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 
      currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : currentHour < 21 ? 'evening' : 'night';
    
    const context: SmartContext = {
      waitingRoomCount: sortedWaitingRoom.length,
      urgentPatients: sortedWaitingRoom.filter(p => p.priority === 'urgent').length,
      todaysAppointments: upcomingAppointments.length,
      completedToday: upcomingAppointments.filter(a => a.status === 'completed').length,
      averageConsultationTime: 25,
      currentTime: new Date(),
      workloadLevel: sortedWaitingRoom.length > 10 ? 'high' : sortedWaitingRoom.length > 5 ? 'medium' : 'low',
      timeOfDay,
    };
    const actions = quickActionsService.generateSmartActions(context);
    setSmartActions(actions);
  }, [sortedWaitingRoom, upcomingAppointments]);

  const handleQuickAction = (action: any) => {
    console.log('Executed smart action:', action.title);
    // Here you can add specific logic for each action type
    switch (action.id) {
      case 'handle-urgent-patient':
        setActiveTab(0); // Switch to waiting room
        break;
      case 'optimize-queue':
        // Re-sort waiting room by priority
        setWaitingRoom(prev => [...prev].sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }));
        break;
      case 'add-walk-in':
        // Open add patient dialog
        break;
      case 'bulk-notifications':
        setNotificationDialog(true);
        break;
      default:
        console.log('Action executed:', action.id);
    }
  };

  // Enhanced CDS (Clinical Decision Support) handlers with comprehensive use case
  const generateCDSRecommendations = useCallback((patient: Patient, encounterType: 'office_visit' | 'telehealth' | 'urgent_care' | 'emergency' = 'office_visit') => {
    const cdsEngine = OpenCDSEngine.getInstance();

    // Enhanced CDS context with more comprehensive patient data
    const context: CDSContext = {
      patient,
      vitalSigns: {
        // Dynamic vital signs based on patient conditions
        bloodPressure: patient.medicalHistory?.some(h =>
          h.toLowerCase().includes('hypertension') ||
          h.toLowerCase().includes('high blood pressure')
        )
          ? { systolic: 150, diastolic: 95, timestamp: new Date().toISOString() }
          : patient.medicalHistory?.some(h => h.toLowerCase().includes('hypotension'))
          ? { systolic: 100, diastolic: 60, timestamp: new Date().toISOString() }
          : { systolic: 120, diastolic: 80, timestamp: new Date().toISOString() },
        heartRate: patient.medicalHistory?.some(h =>
          h.toLowerCase().includes('arrhythmia') ||
          h.toLowerCase().includes('atrial fibrillation')
        ) ? 95 : 75,
        temperature: patient.medicalHistory?.some(h =>
          h.toLowerCase().includes('infection') ||
          h.toLowerCase().includes('fever')
        ) ? 100.5 : 98.6,
        respiratoryRate: patient.medicalHistory?.some(h =>
          h.toLowerCase().includes('asthma') ||
          h.toLowerCase().includes('copd')
        ) ? 22 : 16,
        oxygenSaturation: patient.medicalHistory?.some(h =>
          h.toLowerCase().includes('respiratory') ||
          h.toLowerCase().includes('pneumonia')
        ) ? 92 : 98,
        weight: patient.medicalHistory?.some(h => h.toLowerCase().includes('obesity')) ? 220 : 170,
        height: 68,
        bmi: patient.medicalHistory?.some(h => h.toLowerCase().includes('obesity')) ? 33.2 : 25.8,
        timestamp: new Date().toISOString(),
      },
      currentMedications: patient.medications?.map((med, index) => ({
        id: `med-${patient.id}-${index}`,
        name: med,
        medicationName: med,
        dosage: getMedicationDosage(med),
        frequency: getMedicationFrequency(med),
        duration: '30 days',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        isActive: true,
      })) || [],
      allergies: patient.allergies || [],
      diagnoses: patient.medicalHistory || [],
      age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
      gender: patient.name.toLowerCase().includes('mrs') || patient.name.toLowerCase().includes('ms') ? 'female' : 'male',
      pregnancyStatus: false, // Would be determined from patient data
      smokingStatus: patient.medicalHistory?.some(h => h.toLowerCase().includes('smoking')) ? 'current' : 'never',
      comorbidities: patient.medicalHistory?.filter(h =>
        !h.toLowerCase().includes('hypertension') &&
        !h.toLowerCase().includes('diabetes') &&
        !h.toLowerCase().includes('asthma')
      ) || [],
      chiefComplaint: getChiefComplaintFromHistory(patient.medicalHistory),
      symptoms: extractSymptomsFromHistory(patient.medicalHistory),
      encounterType,
    };

    const recommendations = cdsEngine.evaluateRules(context);
    setCdsRecommendations(recommendations);
    setSelectedPatientForCDS(patient);

    // Log CDS generation for analytics
    console.log(`CDS generated for patient ${patient.name}: ${recommendations.length} recommendations`);
  }, []);

  // Helper functions for enhanced CDS context
  const getMedicationDosage = (medication: string): string => {
    const med = medication.toLowerCase();
    if (med.includes('lisinopril') || med.includes('metoprolol')) return '10mg';
    if (med.includes('aspirin')) return '81mg';
    if (med.includes('warfarin')) return '5mg';
    if (med.includes('sertraline')) return '50mg';
    return '1 tablet';
  };

  const getMedicationFrequency = (medication: string): string => {
    const med = medication.toLowerCase();
    if (med.includes('aspirin') || med.includes('statin')) return 'daily';
    if (med.includes('antibiotic')) return 'twice daily';
    if (med.includes('insulin')) return 'as needed';
    return 'daily';
  };

  const getChiefComplaintFromHistory = (history?: string[]): string => {
    if (!history || history.length === 0) return 'Routine checkup';

    const complaints = history.filter(h =>
      h.toLowerCase().includes('pain') ||
      h.toLowerCase().includes('fever') ||
      h.toLowerCase().includes('cough') ||
      h.toLowerCase().includes('shortness of breath') ||
      h.toLowerCase().includes('chest pain')
    );

    return complaints.length > 0 ? complaints[0] : 'Routine checkup';
  };

  const extractSymptomsFromHistory = (history?: string[]): string[] => {
    if (!history) return [];

    const symptoms: string[] = [];
    const symptomKeywords = [
      'pain', 'fever', 'cough', 'nausea', 'vomiting', 'dizziness',
      'headache', 'fatigue', 'shortness of breath', 'chest pain',
      'abdominal pain', 'joint pain', 'muscle pain'
    ];

    history.forEach(condition => {
      symptomKeywords.forEach(symptom => {
        if (condition.toLowerCase().includes(symptom) && !symptoms.includes(symptom)) {
          symptoms.push(symptom);
        }
      });
    });

    return symptoms;
  };

  // Enhanced consultation workflow with CDS integration
  const startConsultationWithCDS = useCallback((patient: Patient) => {
    // Set patient as in consultation
    setWaitingRoom(prev => prev.map(p =>
      p.id === patient.id ? { ...p, status: 'in-consultation' as const } : p
    ));

    // Set as current consultation
    setCurrentConsultation(patient);

    // Determine encounter type based on patient priority and condition
    const encounterType: 'office_visit' | 'telehealth' | 'urgent_care' | 'emergency' =
      patient.priority === 'urgent' ? 'emergency' :
      patient.priority === 'high' ? 'urgent_care' :
      'office_visit';

    // Generate CDS recommendations immediately
    generateCDSRecommendations(patient, encounterType);

    // Switch to consultation view
    setActiveTab(2); // Assuming consultation tab is index 2

    // Log consultation start
    console.log(`Started consultation for ${patient.name} with ${encounterType} encounter type`);
  }, [generateCDSRecommendations]);

  // Real-time CDS monitoring during consultation
  const updateVitalSignsAndRefreshCDS = useCallback((patient: Patient, newVitals: Partial<VitalSigns>) => {
    // In a real implementation, this would update the patient's vital signs
    // and trigger CDS re-evaluation
    console.log('Updating vital signs and refreshing CDS for patient:', patient.name, newVitals);

    // Re-generate CDS with updated vitals
    setTimeout(() => {
      generateCDSRecommendations(patient);
    }, 1000); // Simulate API delay
  }, [generateCDSRecommendations]);

  const handleAcceptCDSRecommendation = useCallback((recommendation: CDSRecommendation) => {
    setCdsRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendation.id
          ? { ...rec, status: 'accepted' as const, implementedDate: new Date().toISOString() }
          : rec
      )
    );
    console.log('Accepted CDS recommendation:', recommendation.title);
    // Here you would implement the recommendation (e.g., order medication, schedule test, etc.)
  }, []);

  const handleRejectCDSRecommendation = useCallback((recommendation: CDSRecommendation) => {
    setCdsRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendation.id
          ? { ...rec, status: 'rejected' as const }
          : rec
      )
    );
    console.log('Rejected CDS recommendation:', recommendation.title);
  }, []);

  const handleAcknowledgeCDSRecommendation = useCallback((recommendation: CDSRecommendation) => {
    setCdsRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendation.id
          ? { ...rec, status: 'acknowledged' as const }
          : rec
      )
    );
  }, []);

  // CDS-guided treatment workflow
  const implementCDSRecommendation = useCallback(async (recommendation: CDSRecommendation) => {
    try {
      // Mark as accepted
      handleAcceptCDSRecommendation(recommendation);

      // Implement based on recommendation type
      switch (recommendation.category) {
        case 'medication':
          // Open prescription dialog or add to treatment plan
          console.log('Implementing medication recommendation:', recommendation.title);
          // In real implementation: addMedicationToPlan(recommendation);
          break;

        case 'diagnostic':
          // Order lab tests or imaging
          console.log('Ordering diagnostic test:', recommendation.title);
          // In real implementation: orderLabTest(recommendation);
          break;

        case 'preventive':
          // Schedule follow-up or screening
          console.log('Scheduling preventive care:', recommendation.title);
          // In real implementation: scheduleFollowUp(recommendation);
          break;

        case 'alert':
          // Show critical alert to provider
          console.log('CRITICAL ALERT:', recommendation.title);
          // In real implementation: showCriticalAlert(recommendation);
          break;

        default:
          console.log('Implementing recommendation:', recommendation.title);
      }

      // Update recommendation status
      setCdsRecommendations(prev =>
        prev.map(rec =>
          rec.id === recommendation.id
            ? { ...rec, status: 'implemented' as const, implementedDate: new Date().toISOString() }
            : rec
        )
      );

    } catch (error) {
      console.error('Error implementing CDS recommendation:', error);
    }
  }, [handleAcceptCDSRecommendation]);
  const handleStartVideoCall = (patientId: number) => {
    const patient = waitingRoom.find(p => p.id === patientId);
    if (!patient) return;

    const videoSession: VideoSession = {
      id: `session-${Date.now()}`,
      appointmentId: patient.id,
      doctorId: 1, // Current doctor ID
      patientId: patient.id,
      roomId: `room-${patient.id}`,
      participants: [
        {
          id: '1',
          name: 'Dr. Provider',
          role: 'doctor',
          isConnected: true,
          hasVideo: true,
          hasAudio: true,
          joinedAt: new Date().toISOString()
        },
        {
          id: patient.id.toString(),
          name: patient.name,
          role: 'patient',
          isConnected: false,
          hasVideo: false,
          hasAudio: false,
          joinedAt: new Date().toISOString()
        }
      ],
      startTime: new Date().toISOString(),
      status: 'waiting',
      settings: {
        enableChat: true,
        enableRecording: true,
        enableScreenShare: true,
        maxDuration: 60,
        autoStartRecording: false
      }
    };

    setActiveVideoSession(videoSession);
    setShowVideoCall(true);

    // Update patient status
    setWaitingRoom(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, status: 'in-consultation' as const }
          : p
      )
    );
  };

  const handleStartChat = (patientId: number) => {
    setSelectedChatParticipant(patientId);
    setShowChat(true);
  };

  const handleEndVideoCall = () => {
    if (activeVideoSession) {
      // Update patient status back to waiting if call ended early
      setWaitingRoom(prev =>
        prev.map(p =>
          p.id === activeVideoSession.patientId
            ? { ...p, status: 'waiting' as const }
            : p
        )
      );
    }

    setActiveVideoSession(null);
    setShowVideoCall(false);
  };

  const handleUpdateVideoSession = (session: VideoSession) => {
    setActiveVideoSession(session);
  };

  // Discount management handlers
  const handleEnableDiscount = () => {
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Default 24 hours
    
    setDiscountSettings(prev => ({
      ...prev,
      isEnabled: true,
      startDate,
      endDate,
    }));

    // Add to pricing history
    const activity = {
      id: Date.now().toString(),
      action: 'discount_enabled',
      description: `Enabled ${discountSettings.discountPercentage}% discount`,
      timestamp: new Date().toISOString(),
      discountPercentage: discountSettings.discountPercentage,
    };
    setPricingHistory(prev => [activity, ...prev]);
  };

  const handleDisableDiscount = () => {
    setDiscountSettings(prev => ({
      ...prev,
      isEnabled: false,
      startDate: undefined,
      endDate: undefined,
    }));

    // Add to pricing history
    const activity = {
      id: Date.now().toString(),
      action: 'discount_disabled',
      description: 'Disabled active discount',
      timestamp: new Date().toISOString(),
    };
    setPricingHistory(prev => [activity, ...prev]);
  };

  const handleDiscountSettingsChange = (field: keyof DiscountSettings, value: any) => {
    setDiscountSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'in-consultation': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Provider Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, Dr. Smith • {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SmartToy />}
              label="AI Smart Dashboard"
              color="primary"
              variant="outlined"
            />
            <Button
              variant={isOnline ? "contained" : "outlined"}
              color={isOnline ? "success" : "inherit"}
              startIcon={isOnline ? <CheckCircle /> : <Cancel />}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Button>
          </Box>
        </Box>

        {/* Efficiency Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.totalAppointments}
                    </Typography>
                    <Typography variant="body2">Today's Appointments</Typography>
                  </Box>
                  <Schedule fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.completedToday}
                    </Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <CheckCircle fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.onTimeRate}%
                    </Typography>
                    <Typography variant="body2">On-Time Rate</Typography>
                  </Box>
                  <Timer fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {efficiencyMetrics.averageDuration}m
                    </Typography>
                    <Typography variant="body2">Avg. Duration</Typography>
                  </Box>
                  <AccessTime fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Queue />} label="Waiting Room" />
          <Tab icon={<Schedule />} label="Today's Schedule" />
          <Tab
            icon={<MedicalServices />}
            label={
              <Badge
                badgeContent={currentConsultation ? 1 : 0}
                color="primary"
                invisible={!currentConsultation}
              >
                Active Consultation
              </Badge>
            }
          />
          <Tab icon={<Assessment />} label="Analytics" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>

        {/* Waiting Room Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Patient Waiting Room ({sortedWaitingRoom.length} patients)
              </Typography>
              <Chip
                icon={<SmartToy />}
                label="Auto-sorted by priority & time"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {sortedWaitingRoom.map((patient, index) => (
                    <React.Fragment key={patient.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Chip
                                label={patient.priority.toUpperCase()}
                                size="small"
                                color={getPriorityColor(patient.priority) as any}
                                sx={{ fontSize: '0.6rem', height: 16 }}
                              />
                            }
                          >
                            <Avatar src={patient.avatar} alt={patient.name}>
                              {patient.name.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {patient.name}
                              </Typography>
                              <Chip
                                label={patient.status.replace('-', ' ')}
                                size="small"
                                color={getStatusColor(patient.status) as any}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {patient.age} years • {patient.condition} • {patient.appointmentTime}
                              </Typography>
                              {patient.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  📝 {patient.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Send Notification">
                              <IconButton
                                size="small"
                                onClick={() => handleSendNotification(patient)}
                                color="primary"
                              >
                                <Notifications />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Start Chat">
                              <IconButton
                                size="small"
                                onClick={() => handleStartChat(patient.id)}
                                color="info"
                              >
                                <Chat />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Start Video Call">
                              <IconButton
                                size="small"
                                onClick={() => handleStartVideoCall(patient.id)}
                                color="success"
                              >
                                <VideoCall />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Generate CDS Recommendations">
                              <IconButton
                                size="small"
                                onClick={() => generateCDSRecommendations(patient)}
                                color="secondary"
                              >
                                <Badge
                                  badgeContent={cdsRecommendations.filter(r => r.patientId === patient.id).length}
                                  color="error"
                                  invisible={cdsRecommendations.filter(r => r.patientId === patient.id).length === 0}
                                >
                                  <Lightbulb />
                                </Badge>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Start Consultation with CDS">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => startConsultationWithCDS(patient)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 2,
                                  fontSize: '0.75rem',
                                  bgcolor: patient.priority === 'urgent' ? 'error.main' :
                                         patient.priority === 'high' ? 'warning.main' : 'primary.main'
                                }}
                              >
                                Start
                              </Button>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < sortedWaitingRoom.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12}>
                <SmartQuickActions
                  waitingRoomCount={sortedWaitingRoom.length}
                  urgentPatients={sortedWaitingRoom.filter(p => p.priority === 'urgent').length}
                  todaysAppointments={upcomingAppointments.length}
                  completedToday={upcomingAppointments.filter(a => a.status === 'completed').length}
                  averageConsultationTime={25} // Mock average time
                  onActionExecute={(action) => {
                    console.log('Executed smart action:', action.title);
                    // Here you can add specific logic for each action type
                    switch (action.id) {
                      case 'handle-urgent-patient':
                        setActiveTab(0); // Switch to waiting room
                        break;
                      case 'optimize-queue':
                        // Re-sort waiting room by priority
                        setWaitingRoom(prev => [...prev].sort((a, b) => {
                          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        }));
                        break;
                      case 'add-walk-in':
                        // Open add patient dialog
                        break;
                      case 'bulk-notifications':
                        setNotificationDialog(true);
                        break;
                      default:
                        console.log('Action executed:', action.id);
                    }
                  }}
                />
              </Grid>

              {/* CDS Recommendations */}
              <Grid item xs={12}>
                <CDSRecommendations
                  recommendations={cdsRecommendations}
                  onAcceptRecommendation={handleAcceptCDSRecommendation}
                  onRejectRecommendation={handleRejectCDSRecommendation}
                  onAcknowledgeRecommendation={handleAcknowledgeCDSRecommendation}
                  onViewDetails={(recommendation) => {
                    console.log('Viewing CDS details:', recommendation.title);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Today's Schedule Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Today's Appointments
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.time}
                        </Typography>
                      </TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={appointment.type === 'video' ? <VideoCall /> : appointment.type === 'phone' ? <Phone /> : <LocalHospital />}
                          label={appointment.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{appointment.duration} min</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          size="small"
                          color={
                            appointment.status === 'completed' ? 'success' :
                            appointment.status === 'in-progress' ? 'primary' :
                            appointment.status === 'cancelled' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Message />
                          </IconButton>
                          <IconButton size="small" color="success">
                            <VideoCall />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Active Consultation Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            {currentConsultation ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Active Consultation: {currentConsultation.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentConsultation.age} years • {currentConsultation.condition} • Priority: {currentConsultation.priority}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoCall />}
                      onClick={() => handleStartVideoCall(currentConsultation.id)}
                    >
                      Video Call
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Chat />}
                      onClick={() => handleStartChat(currentConsultation.id)}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleCompleteConsultation(currentConsultation.id)}
                    >
                      Complete Consultation
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Patient Summary */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Patient Summary" />
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Medical History</Typography>
                            {currentConsultation.medicalHistory?.map((condition, index) => (
                              <Chip
                                key={index}
                                label={condition}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                                color="primary"
                                variant="outlined"
                              />
                            )) || <Typography variant="body2">No significant history</Typography>}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Current Medications</Typography>
                            {currentConsultation.medications?.map((med, index) => (
                              <Chip
                                key={index}
                                label={med}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                                color="secondary"
                                variant="outlined"
                              />
                            )) || <Typography variant="body2">No current medications</Typography>}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Allergies</Typography>
                            {currentConsultation.allergies?.map((allergy, index) => (
                              <Chip
                                key={index}
                                label={allergy}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                                color="error"
                                variant="outlined"
                              />
                            )) || <Typography variant="body2">No known allergies</Typography>}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Vital Signs & Monitoring */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader
                        title="Vital Signs"
                        action={
                          <Button
                            size="small"
                            startIcon={<Timeline />}
                            onClick={() => updateVitalSignsAndRefreshCDS(currentConsultation, {})}
                          >
                            Update
                          </Button>
                        }
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Blood Pressure</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {currentConsultation.medicalHistory?.some(h => h.toLowerCase().includes('hypertension'))
                                ? '150/95' : '120/80'} mmHg
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Heart Rate</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {currentConsultation.medicalHistory?.some(h => h.toLowerCase().includes('arrhythmia'))
                                ? '95' : '75'} bpm
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Temperature</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {currentConsultation.medicalHistory?.some(h => h.toLowerCase().includes('infection'))
                                ? '100.5°F' : '98.6°F'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">O2 Saturation</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {currentConsultation.medicalHistory?.some(h => h.toLowerCase().includes('respiratory'))
                                ? '92%' : '98%'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Quick Actions */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Quick Actions" />
                      <CardContent>
                        <Stack spacing={1}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Assignment />}
                            onClick={() => generateCDSRecommendations(currentConsultation)}
                          >
                            Refresh CDS
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<LocalHospital />}
                            onClick={() => console.log('Order labs for', currentConsultation.name)}
                          >
                            Order Labs
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Receipt />}
                            onClick={() => console.log('Prescribe medication for', currentConsultation.name)}
                          >
                            Prescribe
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Schedule />}
                            onClick={() => console.log('Schedule follow-up for', currentConsultation.name)}
                          >
                            Follow-up
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* CDS Recommendations */}
                  <Grid item xs={12}>
                    <CDSRecommendations
                      recommendations={cdsRecommendations.filter(r => r.patientId === currentConsultation.id)}
                      onAcceptRecommendation={(rec) => implementCDSRecommendation(rec)}
                      onRejectRecommendation={handleRejectCDSRecommendation}
                      onAcknowledgeRecommendation={handleAcknowledgeCDSRecommendation}
                      onViewDetails={(recommendation) => {
                        console.log('Viewing CDS details:', recommendation.title);
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MedicalServices sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No Active Consultation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Select a patient from the waiting room to start a consultation
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Queue />}
                  onClick={() => setActiveTab(0)}
                >
                  Go to Waiting Room
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Performance Analytics
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient Satisfaction
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        4.8/5
                      </Typography>
                      <TrendingUp color="success" />
                    </Box>
                    <LinearProgress variant="determinate" value={96} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Based on 127 reviews this month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Consultation Types
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip icon={<VideoCall />} label="Video: 65%" color="primary" />
                      <Chip icon={<Phone />} label="Phone: 30%" color="secondary" />
                      <Chip icon={<LocalHospital />} label="In-person: 5%" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Most patients prefer video consultations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Account Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Discount & Pricing Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Set special offers and manage your consultation pricing
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Discount Percentage"
                          type="number"
                          value={discountSettings.discountPercentage}
                          onChange={(e) => handleDiscountSettingsChange('discountPercentage', parseInt(e.target.value) || 0)}
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          helperText="Percentage discount to apply (0-100%)"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Discount Description"
                          multiline
                          rows={2}
                          value={discountSettings.discountDescription}
                          onChange={(e) => handleDiscountSettingsChange('discountDescription', e.target.value)}
                          placeholder="e.g., Limited time offer for new patients"
                          helperText="Optional description for the discount offer"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleEnableDiscount}
                            disabled={discountSettings.isEnabled || discountSettings.discountPercentage === 0}
                          >
                            Enable Discount
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="secondary"
                            onClick={handleDisableDiscount}
                            disabled={!discountSettings.isEnabled}
                          >
                            Disable Discount
                          </Button>
                          <Typography variant="body2" color="text.secondary">
                            Current status: {discountSettings.isEnabled ? 
                              `Active (${discountSettings.discountPercentage}% off)` : 
                              'No active discount'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Pricing History & Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Track your pricing changes and discount activities
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Timestamp</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pricingHistory.length > 0 ? (
                            pricingHistory.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    {activity.action.replace('_', ' ').toUpperCase()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {activity.description}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(activity.timestamp).toLocaleString()}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No pricing activities yet
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Notification Dialog */}
      <Dialog open={notificationDialog} onClose={() => setNotificationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Notification to {selectedPatient?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message"
              defaultValue={`Hi ${selectedPatient?.name}, your appointment is coming up at ${selectedPatient?.appointmentTime}. Please be ready for your consultation.`}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Send via</InputLabel>
              <Select
                multiple
                value={Object.entries(notificationSettings).filter(([_, enabled]) => enabled).map(([key]) => key)}
                onChange={(e) => {
                  const selected = e.target.value as string[];
                  setNotificationSettings(prev => ({
                    ...prev,
                    email: selected.includes('email'),
                    sms: selected.includes('sms'),
                    push: selected.includes('push'),
                  }));
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="push">Push Notification</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Cancel</Button>
          <Button onClick={handleNotificationSubmit} variant="contained" startIcon={<Send />}>
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Consultation Dialog */}
      {showVideoCall && activeVideoSession && (
        <Dialog
          fullScreen
          open={showVideoCall}
          onClose={handleEndVideoCall}
        >
          <VideoConsultation
            session={activeVideoSession}
            onEndCall={handleEndVideoCall}
            onUpdateSession={handleUpdateVideoSession}
          />
        </Dialog>
      )}

      {/* Chat Dialog */}
      {showChat && selectedChatParticipant && (
        <Dialog
          fullScreen
          open={showChat}
          onClose={() => setShowChat(false)}
        >
          <MessagingSystem
            currentUser={{ id: 1, role: 'doctor', name: 'Dr. Provider' }}
            sessionId={`chat-${selectedChatParticipant}`}
            onStartVideoCall={(patientId) => {
              handleStartVideoCall(patientId);
              setShowChat(false);
            }}
          />
        </Dialog>
      )}

      {/* SpeedDial for Quick Actions */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        direction="up"
      >
        {smartActions.slice(0, 4).map((action, index) => (
          <SpeedDialAction
            key={action.id}
            icon={action.icon}
            tooltipTitle={action.title}
            onClick={() => handleQuickAction(action)}
            FabProps={{
              sx: {
                bgcolor: action.priority === 'high' ? 'error.main' :
                        action.priority === 'medium' ? 'warning.main' : 'success.main',
                '&:hover': {
                  bgcolor: action.priority === 'high' ? 'error.dark' :
                          action.priority === 'medium' ? 'warning.dark' : 'success.dark',
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Container>
  );
};

export default ProviderDashboard;