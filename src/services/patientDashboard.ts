import { 
  PatientDashboardData, 
  HealthInsight, 
  HealthMetric, 
  MedicalRecord,
  Prescription,
  Patient
} from '../types';

export class SmartPatientDashboard {
  /**
   * AI-powered health insights generator
   */
  static generateHealthInsights(
    patient: Patient,
    metrics: HealthMetric[],
    records: MedicalRecord[],
    prescriptions: Prescription[]
  ): HealthInsight[] {
    const insights: HealthInsight[] = [];

    // Medication adherence insights
    const medicationInsights = this.analyzeMedicationAdherence(prescriptions);
    insights.push(...medicationInsights);

    // Health trends analysis
    const trendInsights = this.analyzeHealthTrends(metrics);
    insights.push(...trendInsights);

    // Preventive care recommendations
    const preventiveInsights = this.generatePreventiveRecommendations(patient, records);
    insights.push(...preventiveInsights);

    // Risk assessment
    const riskInsights = this.assessHealthRisks(patient, metrics, records);
    insights.push(...riskInsights);

    // Appointment suggestions
    const appointmentInsights = this.suggestAppointments(records, metrics);
    insights.push(...appointmentInsights);

    return insights.sort((a, b) => this.getPriorityWeight(b.priority || 'low') - this.getPriorityWeight(a.priority || 'low'));
  }

  /**
   * Advanced medication adherence analysis
   */
  private static analyzeMedicationAdherence(prescriptions: Prescription[]): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const activeMeds = prescriptions.filter(p => p.isActive);

    // Check for expiring prescriptions
    activeMeds.forEach(med => {
      const endDate = new Date(med.endDate || new Date());
      const today = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        insights.push({
          id: `med-expiry-${med.id}`,
          type: 'reminder',
          title: 'Prescription Expiring Soon',
           description: `Your ${med.medication} prescription expires in ${daysUntilExpiry} days. Consider requesting a refill.`,
          severity: 'medium',
          priority: 'medium',
          category: 'medication',
          date: new Date().toISOString(),
          isRead: false,
          actionRequired: true,
          aiGenerated: true
        });
      }

      if (med.refillsRemaining <= 1 && med.refillsRemaining > 0) {
        insights.push({
          id: `med-refill-${med.id}`,
          type: 'alert',
          title: 'Low Refills Remaining',
           description: `Only ${med.refillsRemaining} refill remaining for ${med.medication}. Contact your doctor for a new prescription.`,
          severity: 'medium',
          priority: 'medium',
          category: 'medication',
          date: new Date().toISOString(),
          isRead: false,
          actionRequired: true,
          aiGenerated: true
        });
      }
    });

    return insights;
  }

  /**
   * Machine learning inspired health trends analysis
   */
  private static analyzeHealthTrends(metrics: HealthMetric[]): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const metricsByType = this.groupMetricsByType(metrics);

    Object.entries(metricsByType).forEach(([type, typeMetrics]) => {
      const trend = this.calculateTrend(typeMetrics);
      const latestValue = typeMetrics[typeMetrics.length - 1];

      if (type === 'blood-pressure' && trend === 'declining') {
        const bpValues = typeMetrics.map(m => this.parseBP(String(m.value)));
        const avgSystolic = bpValues.reduce((sum, bp) => sum + bp.systolic, 0) / bpValues.length;
        
        if (avgSystolic > 140) {
          insights.push({
            id: `bp-trend-${Date.now()}`,
            type: 'alert',
            title: 'Blood Pressure Trending High',
            description: `Your blood pressure has been trending upward (avg: ${avgSystolic.toFixed(0)}/${(bpValues.reduce((sum, bp) => sum + bp.diastolic, 0) / bpValues.length).toFixed(0)}). Consider lifestyle changes or consult your doctor.`,
            severity: 'high',
            priority: 'high',
            category: 'prevention',
            date: new Date().toISOString(),
            isRead: false,
            actionRequired: true,
            aiGenerated: true
          });
        }
      }

      if (type === 'weight' && trend === 'declining' && typeMetrics.length >= 5) {
        const weightChange = (typeMetrics[typeMetrics.length - 1].value as number) - (typeMetrics[0].value as number);
        if (Math.abs(weightChange) > 10) {
          insights.push({
            id: `weight-trend-${Date.now()}`,
            type: weightChange > 0 ? 'alert' : 'recommendation',
            title: `Significant Weight ${weightChange > 0 ? 'Gain' : 'Loss'}`,
            description: `You've ${weightChange > 0 ? 'gained' : 'lost'} ${Math.abs(weightChange).toFixed(1)} lbs over recent measurements. ${weightChange > 0 ? 'Consider reviewing your diet and exercise routine.' : 'Great progress! Keep up the healthy habits.'}`,
            severity: weightChange > 0 ? 'medium' : 'low',
            priority: weightChange > 0 ? 'medium' : 'low',
            category: weightChange > 0 ? 'diet' : 'achievement',
            date: new Date().toISOString(),
            isRead: false,
            actionRequired: weightChange > 0,
            aiGenerated: true
          });
        }
      }
    });

    return insights;
  }

  /**
   * Preventive care AI recommendations
   */
  private static generatePreventiveRecommendations(patient: Patient, records: MedicalRecord[]): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const age = this.calculateAge(patient.dateOfBirth);
    const lastCheckups = this.getLastCheckupsByType(records);

    // Age-based screening recommendations
    if (age >= 40 && !lastCheckups['mammogram'] || this.daysSinceLastCheckup(lastCheckups['mammogram']) > 365) {
      insights.push({
        id: `mammogram-reminder-${Date.now()}`,
        type: 'recommendation',
        title: 'Mammogram Screening Due',
        description: 'Based on your age and health profile, it\'s time for your annual mammogram screening.',
        severity: 'medium',
        priority: 'medium',
        category: 'prevention',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    if (age >= 50 && (!lastCheckups['colonoscopy'] || this.daysSinceLastCheckup(lastCheckups['colonoscopy']) > 1825)) {
      insights.push({
        id: `colonoscopy-reminder-${Date.now()}`,
        type: 'recommendation',
        title: 'Colonoscopy Screening Recommended',
        description: 'It\'s recommended to have a colonoscopy every 5 years after age 50 for colorectal cancer screening.',
        severity: 'medium',
        priority: 'medium',
        category: 'prevention',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    // Vaccination reminders
    if (!lastCheckups['flu-shot'] || this.daysSinceLastCheckup(lastCheckups['flu-shot']) > 365) {
      insights.push({
        id: `flu-shot-reminder-${Date.now()}`,
        type: 'reminder',
        title: 'Annual Flu Shot Due',
        description: 'It\'s flu season! Schedule your annual flu vaccination to stay protected.',
        severity: 'low',
        priority: 'low',
        category: 'prevention',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    return insights;
  }

  /**
   * AI-powered health risk assessment
   */
  private static assessHealthRisks(patient: Patient, metrics: HealthMetric[], records: MedicalRecord[]): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const riskFactors = this.identifyRiskFactors(patient, metrics, records);

    if (riskFactors.cardiovascular > 0.6) {
      insights.push({
        id: `cardio-risk-${Date.now()}`,
        type: 'alert',
        title: 'Elevated Cardiovascular Risk',
        description: 'Based on your health data, you may have elevated cardiovascular risk. Consider scheduling a consultation with a cardiologist.',
        severity: 'high',
        priority: 'high',
        category: 'prevention',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    if (riskFactors.diabetes > 0.5) {
      insights.push({
        id: `diabetes-risk-${Date.now()}`,
        type: 'recommendation',
        title: 'Diabetes Risk Assessment',
        description: 'Your health profile suggests monitoring for diabetes risk. Consider regular blood sugar monitoring and lifestyle modifications.',
        severity: 'medium',
        priority: 'medium',
        category: 'prevention',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    return insights;
  }

  /**
   * Smart appointment suggestions
   */
  private static suggestAppointments(records: MedicalRecord[], metrics: HealthMetric[]): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const lastPhysical = records.find(r => r.type === 'consultation' && r.tags.includes('annual-physical'));
    
    if (!lastPhysical || this.daysSinceDate(lastPhysical.date) > 365) {
      insights.push({
        id: `annual-physical-${Date.now()}`,
        type: 'reminder',
        title: 'Annual Physical Due',
        description: 'It\'s time for your annual physical exam. Stay on top of your health with regular check-ups.',
        severity: 'medium',
        priority: 'medium',
        category: 'appointment',
        date: new Date().toISOString(),
        isRead: false,
        actionRequired: true,
        aiGenerated: true
      });
    }

    return insights;
  }

  /**
   * Smart health score calculation
   */
  static calculateHealthScore(
    metrics: HealthMetric[],
    prescriptions: Prescription[],
    records: MedicalRecord[]
  ): { score: number; factors: { [key: string]: number } } {
    let score = 100;
    const factors: { [key: string]: number } = {};

    // Vital signs assessment (40% weight)
    const vitalsScore = this.assessVitals(metrics);
    factors.vitals = vitalsScore;
    score -= (100 - vitalsScore) * 0.4;

    // Medication adherence (25% weight)
    const medicationScore = this.assessMedicationAdherence(prescriptions);
    factors.medication = medicationScore;
    score -= (100 - medicationScore) * 0.25;

    // Preventive care (20% weight)
    const preventiveScore = this.assessPreventiveCare(records);
    factors.preventive = preventiveScore;
    score -= (100 - preventiveScore) * 0.2;

    // Health trends (15% weight)
    const trendsScore = this.assessHealthTrends(metrics);
    factors.trends = trendsScore;
    score -= (100 - trendsScore) * 0.15;

    return { score: Math.max(0, Math.min(100, score)), factors };
  }

  // Helper methods
  private static groupMetricsByType(metrics: HealthMetric[]): { [key: string]: HealthMetric[] } {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.type]) acc[metric.type] = [];
      acc[metric.type].push(metric);
      return acc;
    }, {} as { [key: string]: HealthMetric[] });
  }

  private static calculateTrend(metrics: HealthMetric[]): 'improving' | 'stable' | 'declining' {
    if (metrics.length < 2) return 'stable';
    
    const recent = metrics.slice(-3);
    const older = metrics.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'declining' : 'improving'; // This depends on the metric type
  }

  private static parseBP(value: string): { systolic: number; diastolic: number } {
    const [systolic, diastolic] = value.split('/').map(Number);
    return { systolic, diastolic };
  }

  private static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    return today.getFullYear() - birth.getFullYear();
  }

  private static getLastCheckupsByType(records: MedicalRecord[]): { [key: string]: string } {
    const checkups: { [key: string]: string } = {};
    records.forEach(record => {
      record.tags.forEach(tag => {
        if (!checkups[tag] || new Date(record.date) > new Date(checkups[tag])) {
          checkups[tag] = record.date;
        }
      });
    });
    return checkups;
  }

  private static daysSinceLastCheckup(date?: string): number {
    if (!date) return Infinity;
    return this.daysSinceDate(date);
  }

  private static daysSinceDate(date: string): number {
    const today = new Date();
    const checkupDate = new Date(date);
    return Math.ceil((today.getTime() - checkupDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private static identifyRiskFactors(patient: Patient, metrics: HealthMetric[], records: MedicalRecord[]): { [key: string]: number } {
    const risks: { [key: string]: number } = {
      cardiovascular: 0,
      diabetes: 0,
      obesity: 0
    };

    // Simple risk assessment based on available data
    const latestBP = metrics.filter(m => m.type === 'blood-pressure').pop();
    if (latestBP) {
      const bp = this.parseBP(String(latestBP.value));
      if (bp.systolic > 140 || bp.diastolic > 90) {
        risks.cardiovascular += 0.3;
      }
    }

    const latestWeight = metrics.filter(m => m.type === 'weight').pop();
    if (latestWeight && (latestWeight.value as number) > 200) {
      risks.cardiovascular += 0.2;
      risks.diabetes += 0.2;
      risks.obesity += 0.8;
    }

    return risks;
  }

  private static assessVitals(metrics: HealthMetric[]): number {
    // Simplified vital signs scoring
    let score = 100;
    
    const latestBP = metrics.filter(m => m.type === 'blood-pressure').pop();
    if (latestBP) {
      const bp = this.parseBP(String(latestBP.value));
      if (bp.systolic > 140 || bp.diastolic > 90) score -= 20;
    }

    return Math.max(0, score);
  }

  private static assessMedicationAdherence(prescriptions: Prescription[]): number {
    if (prescriptions.length === 0) return 100;
    
    const activeCount = prescriptions.filter(p => p.isActive).length;
    return (activeCount / prescriptions.length) * 100;
  }

  private static assessPreventiveCare(records: MedicalRecord[]): number {
    const preventiveRecords = records.filter(r => r.tags.some(tag => 
      ['annual-physical', 'mammogram', 'colonoscopy', 'flu-shot'].includes(tag)
    ));
    
    return Math.min(100, preventiveRecords.length * 25);
  }

  private static assessHealthTrends(metrics: HealthMetric[]): number {
    const trends = Object.values(this.groupMetricsByType(metrics))
      .map(typeMetrics => this.calculateTrend(typeMetrics));
    
    const improvingCount = trends.filter(t => t === 'improving').length;
    const stableCount = trends.filter(t => t === 'stable').length;
    
    return ((improvingCount * 100 + stableCount * 80) / trends.length) || 80;
  }

  private static getPriorityWeight(priority: string): number {
    const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
    return weights[priority as keyof typeof weights] || 1;
  }
}