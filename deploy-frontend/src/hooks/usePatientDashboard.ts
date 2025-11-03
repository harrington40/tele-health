import { useState, useCallback, useEffect } from 'react';
import { PatientDashboardData, HealthInsight, MedicalRecord, HealthMetric } from '../types';
import { SmartPatientDashboard } from '../services/patientDashboard';

export interface DashboardState {
  loading: boolean;
  error: string | null;
  data: PatientDashboardData | null;
  healthScore: { score: number; factors: { [key: string]: number } } | null;
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  notifications: HealthInsight[];
}

export const usePatientDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    data: null,
    healthScore: null,
    selectedTimeRange: '30d',
    notifications: []
  });

  const loadDashboardData = useCallback(async (patientId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would be an API call
      const mockData = await fetchPatientDashboardData(patientId);
      const insights = mockData.patient ? SmartPatientDashboard.generateHealthInsights(
        mockData.patient,
        mockData.healthMetrics || [],
        mockData.recentRecords || [],
        mockData.activePrescriptions || []
      ) : [];

      const healthScore = SmartPatientDashboard.calculateHealthScore(
        mockData.healthMetrics || [],
        mockData.activePrescriptions || [],
        mockData.recentRecords || []
      );

      setState(prev => ({
        ...prev,
        loading: false,
        data: { ...mockData, insights },
        healthScore,
        notifications: insights.filter(insight => !insight.isRead)
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  }, []);

  const markInsightAsRead = useCallback((insightId: string) => {
    setState(prev => {
      if (!prev.data) return prev;

      const updatedInsights = prev.data.insights.map(insight =>
        insight.id === insightId ? { ...insight, isRead: true } : insight
      );

      return {
        ...prev,
        data: { ...prev.data, insights: updatedInsights },
        notifications: updatedInsights.filter(insight => !insight.isRead)
      };
    });
  }, []);

  const addHealthMetric = useCallback((metric: HealthMetric) => {
    setState(prev => {
      if (!prev.data) return prev;

      const updatedMetrics = [...(prev.data.healthMetrics || []), metric];
      
      // Recalculate insights and health score
      const insights = prev.data.patient ? SmartPatientDashboard.generateHealthInsights(
        prev.data.patient,
        updatedMetrics,
        prev.data.recentRecords || [],
        prev.data.activePrescriptions || []
      ) : [];

      const healthScore = SmartPatientDashboard.calculateHealthScore(
        updatedMetrics,
        prev.data.activePrescriptions || [],
        prev.data.recentRecords || []
      );

      return {
        ...prev,
        data: { ...prev.data, healthMetrics: updatedMetrics, insights },
        healthScore,
        notifications: insights.filter(insight => !insight.isRead)
      };
    });
  }, []);

  const updateTimeRange = useCallback((range: '7d' | '30d' | '90d' | '1y') => {
    setState(prev => ({ ...prev, selectedTimeRange: range }));
    // In a real app, you would refetch data based on the new time range
  }, []);

  const getFilteredMetrics = useCallback((type?: string) => {
    if (!state.data) return [];

    let metrics = state.data?.healthMetrics || [];
    
    if (type) {
      metrics = metrics.filter(metric => metric.type === type);
    }

    // Filter by time range
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (state.selectedTimeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return metrics.filter(metric => new Date(metric.date) >= cutoffDate);
  }, [state.data, state.selectedTimeRange]);

  const getHealthTrends = useCallback(() => {
    if (!state.data) return {};

    const trends: { [key: string]: 'up' | 'down' | 'stable' } = {};
    const metricTypes = ['blood-pressure', 'weight', 'heart-rate', 'blood-sugar'];

    metricTypes.forEach(type => {
      const metrics = getFilteredMetrics(type);
      if (metrics.length >= 2) {
        const recent = metrics.slice(-3);
        const older = metrics.slice(-6, -3);
        
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0) / recent.length;
          const olderAvg = older.reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0) / older.length;
          
          const change = (recentAvg - olderAvg) / olderAvg;
          
          if (Math.abs(change) < 0.05) {
            trends[type] = 'stable';
          } else {
            // For most metrics, up is good except for weight and blood pressure
            if (type === 'weight' || type === 'blood-pressure') {
              trends[type] = change > 0 ? 'up' : 'down';
            } else {
              trends[type] = change > 0 ? 'up' : 'down';
            }
          }
        } else {
          trends[type] = 'stable';
        }
      } else {
        trends[type] = 'stable';
      }
    });

    return trends;
  }, [state.data, getFilteredMetrics]);

  const getUpcomingReminders = useCallback(() => {
    if (!state.data) return [];

    const reminders = state.data.insights.filter(insight => 
      insight.type === 'reminder' && 
      insight.actionRequired && 
      !insight.isRead
    );

    return reminders.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [state.data]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.data?.patient) {
        loadDashboardData(state.data.patient.id);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.data, loadDashboardData]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    data: state.data,
    healthScore: state.healthScore,
    selectedTimeRange: state.selectedTimeRange,
    notifications: state.notifications,

    // Actions
    loadDashboardData,
    markInsightAsRead,
    addHealthMetric,
    updateTimeRange,

    // Computed values
    getFilteredMetrics,
    getHealthTrends,
    getUpcomingReminders
  };
};

// Mock API function - in real app this would be actual API calls
async function fetchPatientDashboardData(patientId: number): Promise<PatientDashboardData> {
  // This would be replaced with actual API calls
  return {
    patientId: patientId,
    patientName: "Sarah Johnson",
    healthScore: 85,
    insights: [], // Will be generated by the service
    recentMetrics: [
      {
        id: 'm1',
        type: 'blood-pressure',
        value: 128,
        unit: 'mmHg',
        timestamp: '2025-10-05T10:00:00Z',
        date: '2025-10-05',
        patientId: patientId,
        source: 'device'
      },
      {
        id: 'm2',
        type: 'weight',
        value: 165,
        unit: 'lbs',
        timestamp: '2025-10-05T10:00:00Z',
        date: '2025-10-05',
        patientId: patientId,
        source: 'manual'
      }
    ],
    upcomingAppointments: [
      {
        id: 1,
        doctorId: 1,
        patientId: patientId,
        date: '2025-10-15',
        time: '10:00',
        type: 'video',
        status: 'scheduled',
        price: 150,
        reason: 'Follow-up consultation'
      }
    ],
    recentPrescriptions: [
      {
        id: 'p1',
        patientId: patientId,
        doctorId: 1,
        medication: 'Metformin',
        medicationName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals',
        isActive: true,
        startDate: '2025-09-15',
        endDate: '2025-12-15',
        refillsRemaining: 2
      }
    ],
    medicalRecords: [
      {
        id: '1',
        patientId: patientId,
        doctorId: 1,
        date: '2025-09-15',
        type: 'consultation',
        title: 'Annual Physical Examination',
        description: 'Comprehensive annual check-up with blood work and vital signs assessment.',
        diagnosis: 'Overall good health, continue current medication regimen',
        tags: ['annual-physical', 'routine']
      }
    ],
    notifications: [],
    patient: {
      id: patientId,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-15",
      address: "123 Health St, Wellness City, WC 12345",
      emergencyContact: {
        name: "John Johnson",
        phone: "+1 (555) 987-6543",
        relationship: "Spouse"
      },
      medicalHistory: ["Hypertension", "Type 2 Diabetes"],
      allergies: ["Penicillin", "Peanuts"],
      medications: ["Metformin", "Lisinopril"]
    },
    healthMetrics: [
      {
        id: 'm1',
        type: 'blood-pressure',
        value: 128,
        unit: 'mmHg',
        timestamp: '2025-10-05T10:00:00Z',
        date: '2025-10-05',
        patientId: patientId,
        source: 'device'
      },
      {
        id: 'm2',
        type: 'weight',
        value: 165,
        unit: 'lbs',
        timestamp: '2025-10-05T10:00:00Z',
        date: '2025-10-05',
        patientId: patientId,
        source: 'manual'
      }
    ],
    recentRecords: [
      {
        id: '1',
        patientId: patientId,
        doctorId: 1,
        date: '2025-09-15',
        type: 'consultation',
        title: 'Annual Physical Examination',
        description: 'Comprehensive annual check-up with blood work and vital signs assessment.',
        diagnosis: 'Overall good health, continue current medication regimen',
        tags: ['annual-physical', 'routine']
      }
    ],
    activePrescriptions: [
      {
        id: 'p1',
        patientId: patientId,
        doctorId: 1,
        medication: 'Metformin',
        medicationName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals',
        isActive: true,
        startDate: '2025-09-15',
        endDate: '2025-12-15',
        refillsRemaining: 2
      }
    ]
  };
}