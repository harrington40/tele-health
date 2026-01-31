import {
  CDSRule,
  CDSRecommendation,
  CDSKnowledgeSource,
  CDSContext,
  CDSCondition,
  CDSAction,
  Patient,
  VitalSigns,
  LabOrder,
  Medication
} from '../types';
import OpenFDAService from './openFDA.service';

export class OpenCDSEngine {
  private static instance: OpenCDSEngine;
  private rules: CDSRule[] = [];
  private knowledgeSources: CDSKnowledgeSource[] = [];
  private openFDAService: OpenFDAService;

  public static getInstance(): OpenCDSEngine {
    if (!OpenCDSEngine.instance) {
      OpenCDSEngine.instance = new OpenCDSEngine();
    }
    return OpenCDSEngine.instance;
  }

  constructor() {
    this.openFDAService = new OpenFDAService();
    this.initializeRules();
    this.initializeKnowledgeSources();
  }

  /**
   * Initialize clinical decision support rules
   */
  private initializeRules(): void {
    this.rules = [
      // Hypertension Management Rule
      {
        id: 'hypertension_management',
        name: 'Hypertension Management',
        description: 'Guidelines for managing hypertension based on blood pressure readings',
        category: 'medication',
        priority: 'high',
        conditions: [
          {
            type: 'vital_sign',
            operator: 'greater_than',
            value: 140,
            unit: 'systolic_bp'
          },
          {
            type: 'patient_age',
            operator: 'greater_than',
            value: 18
          }
        ],
        actions: [
          {
            type: 'recommend_medication',
            title: 'Consider ACE Inhibitor or ARB',
            description: 'First-line treatment for hypertension includes ACE inhibitors or ARBs',
            severity: 'warning',
            supportingEvidence: 'JNC 8 Guidelines',
            alternatives: ['Calcium Channel Blockers', 'Thiazide Diuretics'],
            contraindications: ['Pregnancy', 'Renal Artery Stenosis']
          },
          {
            type: 'order_lab',
            title: 'Order Renal Function Tests',
            description: 'Check creatinine and eGFR before starting ACEi/ARB',
            severity: 'info'
          }
        ],
        evidence: 'JNC 8 Hypertension Guidelines (2014)',
        guidelines: ['JNC 8', 'ACC/AHA 2017'],
        lastUpdated: '2024-01-15',
        isActive: true
      },

      // Diabetes Screening Rule
      {
        id: 'diabetes_screening',
        name: 'Diabetes Screening',
        description: 'Screen for diabetes in high-risk patients',
        category: 'diagnostic',
        priority: 'medium',
        conditions: [
          {
            type: 'patient_age',
            operator: 'greater_than',
            value: 45
          },
          {
            type: 'comorbidity',
            operator: 'contains',
            value: 'obesity'
          }
        ],
        actions: [
          {
            type: 'order_lab',
            title: 'Order HbA1c Test',
            description: 'Screen for diabetes with HbA1c',
            severity: 'info',
            supportingEvidence: 'ADA Guidelines 2023'
          }
        ],
        evidence: 'American Diabetes Association Standards of Care 2023',
        lastUpdated: '2024-01-10',
        isActive: true
      },

      // Drug Interaction Alert
      {
        id: 'drug_interaction_alert',
        name: 'Potential Drug Interaction',
        description: 'Alert for potentially harmful drug combinations',
        category: 'alert',
        priority: 'critical',
        conditions: [
          {
            type: 'medication',
            operator: 'contains',
            value: 'warfarin'
          },
          {
            type: 'medication',
            operator: 'contains',
            value: 'amiodarone'
          }
        ],
        actions: [
          {
            type: 'alert_provider',
            title: 'CRITICAL: Warfarin-Amiodarone Interaction',
            description: 'This combination significantly increases bleeding risk. Monitor INR closely.',
            severity: 'critical',
            supportingEvidence: 'Lexicomp Drug Interactions Database'
          }
        ],
        lastUpdated: '2024-01-20',
        isActive: true
      },

      // Preventive Care - Mammography
      {
        id: 'mammography_screening',
        name: 'Breast Cancer Screening',
        description: 'Recommend mammography screening for eligible women',
        category: 'preventive',
        priority: 'medium',
        conditions: [
          {
            type: 'patient_age',
            operator: 'between',
            value: [50, 74]
          },
          {
            type: 'gender',
            operator: 'equals',
            value: 'female'
          }
        ],
        actions: [
          {
            type: 'preventive_care',
            title: 'Mammography Due',
            description: 'Annual mammography screening recommended',
            severity: 'info',
            supportingEvidence: 'USPSTF Guidelines 2023'
          }
        ],
        evidence: 'US Preventive Services Task Force 2023',
        lastUpdated: '2024-01-05',
        isActive: true
      },

      // Asthma Management
      {
        id: 'asthma_action_plan',
        name: 'Asthma Action Plan Review',
        description: 'Review and update asthma action plan',
        category: 'monitoring',
        priority: 'medium',
        conditions: [
          {
            type: 'diagnosis',
            operator: 'contains',
            value: 'asthma'
          },
          {
            type: 'vital_sign',
            operator: 'less_than',
            value: 95,
            unit: 'oxygen_saturation'
          }
        ],
        actions: [
          {
            type: 'lifestyle_advice',
            title: 'Review Asthma Action Plan',
            description: 'Patient showing signs of asthma exacerbation. Review action plan and consider treatment adjustment.',
            severity: 'warning',
            supportingEvidence: 'GINA Guidelines 2023'
          }
        ],
        evidence: 'Global Initiative for Asthma (GINA) 2023',
        lastUpdated: '2024-01-12',
        isActive: true
      }
    ];
  }

  /**
   * Initialize knowledge sources
   */
  private initializeKnowledgeSources(): void {
    this.knowledgeSources = [
      {
        id: 'lexicomp',
        name: 'Lexicomp',
        type: 'drug_database',
        description: 'Comprehensive drug information database',
        source: 'https://www.wolterskluwercdi.com/lexicomp/',
        lastUpdated: '2024-01-25',
        version: '2024.1',
        credibility: 'high',
        categories: ['medications', 'interactions', 'dosing']
      },
      {
        id: 'uptodate',
        name: 'UpToDate',
        type: 'clinical_guideline',
        description: 'Evidence-based clinical decision support',
        source: 'https://www.uptodate.com/',
        lastUpdated: '2024-01-20',
        version: '2024.1',
        credibility: 'high',
        categories: ['guidelines', 'treatment', 'diagnosis']
      },
      {
        id: 'labcorp',
        name: 'LabCorp Reference Ranges',
        type: 'lab_reference',
        description: 'Laboratory reference ranges and interpretations',
        source: 'https://www.labcorp.com/reference-ranges',
        lastUpdated: '2024-01-15',
        version: '2024.1',
        credibility: 'high',
        categories: ['laboratory', 'reference_ranges']
      },
      {
        id: 'framingham',
        name: 'Framingham Risk Calculator',
        type: 'risk_calculator',
        description: 'Cardiovascular risk assessment tool',
        source: 'https://www.framinghamheartstudy.org/',
        lastUpdated: '2024-01-10',
        version: '2023.2',
        credibility: 'high',
        categories: ['cardiovascular', 'risk_assessment']
      }
    ];
  }

  /**
   * Evaluate CDS rules against patient context with OpenFDA integration
   */
  async evaluateRules(context: CDSContext): Promise<CDSRecommendation[]> {
    const recommendations: CDSRecommendation[] = [];
    const triggeredRules = this.rules.filter(rule => this.evaluateRule(rule, context));

    // Add OpenFDA-based recommendations
    const openFDAReccommendations = await this.generateOpenFDABasedRecommendations(context);
    recommendations.push(...openFDAReccommendations);

    triggeredRules.forEach(rule => {
      const recommendation = this.generateRecommendation(rule, context);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    });

    // Sort by priority and confidence
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    });
  }

  /**
   * Evaluate a single CDS rule
   */
  private evaluateRule(rule: CDSRule, context: CDSContext): boolean {
    if (!rule.isActive) return false;

    return rule.conditions.every(condition => this.evaluateCondition(condition, context));
  }

  /**
   * Evaluate a CDS condition
   */
  private evaluateCondition(condition: CDSCondition, context: CDSContext): boolean {
    switch (condition.type) {
      case 'patient_age':
        return this.evaluateNumericCondition(context.age, condition);

      case 'vital_sign':
        return this.evaluateVitalSignCondition(context.vitalSigns, condition);

      case 'medication':
        return this.evaluateMedicationCondition(context.currentMedications || [], condition);

      case 'diagnosis':
        return this.evaluateDiagnosisCondition(context.diagnoses, condition);

      case 'lab_value':
        return this.evaluateLabCondition(context.recentLabs || [], condition);

      case 'allergy':
        return this.evaluateAllergyCondition(context.allergies, condition);

      case 'comorbidity':
        return this.evaluateComorbidityCondition(context.comorbidities, condition);

      case 'gender':
        return this.evaluateSimpleCondition(context.gender, condition);

      case 'pregnancy':
        return this.evaluateSimpleCondition(context.pregnancyStatus, condition);

      default:
        return false;
    }
  }

  private evaluateNumericCondition(value: number, condition: CDSCondition): boolean {
    switch (condition.operator) {
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'equals':
        return value === condition.value;
      case 'between':
        return value >= condition.value[0] && value <= condition.value[1];
      default:
        return false;
    }
  }

  private evaluateVitalSignCondition(vitals: VitalSigns | undefined, condition: CDSCondition): boolean {
    if (!vitals) return false;

    let value: number | undefined;
    switch (condition.unit) {
      case 'systolic_bp':
        value = vitals.bloodPressure?.systolic;
        break;
      case 'diastolic_bp':
        value = vitals.bloodPressure?.diastolic;
        break;
      case 'heart_rate':
        value = vitals.heartRate;
        break;
      case 'oxygen_saturation':
        value = vitals.oxygenSaturation;
        break;
      default:
        return false;
    }

    return value ? this.evaluateNumericCondition(value, condition) : false;
  }

  private evaluateMedicationCondition(medications: Medication[], condition: CDSCondition): boolean {
    const medicationNames = medications.map(m => m.medicationName || m.name).filter(Boolean);
    return this.evaluateArrayCondition(medicationNames, condition);
  }

  private evaluateDiagnosisCondition(diagnoses: string[], condition: CDSCondition): boolean {
    return this.evaluateArrayCondition(diagnoses, condition);
  }

  private evaluateLabCondition(labs: LabOrder[], condition: CDSCondition): boolean {
    // Simplified lab evaluation - in real implementation, would check result values
    const labNames = labs.map(l => l.testName);
    return this.evaluateArrayCondition(labNames, condition);
  }

  private evaluateAllergyCondition(allergies: string[], condition: CDSCondition): boolean {
    return this.evaluateArrayCondition(allergies, condition);
  }

  private evaluateComorbidityCondition(comorbidities: string[], condition: CDSCondition): boolean {
    return this.evaluateArrayCondition(comorbidities, condition);
  }

  private evaluateSimpleCondition(value: any, condition: CDSCondition): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      default:
        return false;
    }
  }

  private evaluateArrayCondition(array: string[], condition: CDSCondition): boolean {
    switch (condition.operator) {
      case 'contains':
        return array.some(item => item.toLowerCase().includes(condition.value.toLowerCase()));
      case 'not_contains':
        return !array.some(item => item.toLowerCase().includes(condition.value.toLowerCase()));
      case 'in':
        return condition.value.some((val: string) => array.includes(val));
      case 'not_in':
        return !condition.value.some((val: string) => array.includes(val));
      default:
        return false;
    }
  }

  /**
   * Generate a recommendation from a triggered rule
   */
  private generateRecommendation(rule: CDSRule, context: CDSContext): CDSRecommendation | null {
    if (rule.actions.length === 0) return null;

    const primaryAction = rule.actions[0];
    const triggeredConditions = rule.conditions.filter(condition =>
      this.evaluateCondition(condition, context)
    );

    return {
      id: `${rule.id}_${context.patient.id}_${Date.now()}`,
      ruleId: rule.id,
      patientId: context.patient.id,
      providerId: 1, // Would be dynamic in real implementation
      title: primaryAction.title,
      description: primaryAction.description,
      category: rule.category,
      priority: rule.priority,
      severity: primaryAction.severity,
      supportingEvidence: primaryAction.supportingEvidence || rule.evidence || '',
      suggestedActions: rule.actions.map(action => action.title),
      alternatives: primaryAction.alternatives,
      contraindications: primaryAction.contraindications,
      confidence: this.calculateConfidence(rule, context),
      triggeredConditions,
      knowledgeSources: this.getRelevantKnowledgeSources(rule),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
  }

  /**
   * Calculate confidence score for a recommendation
   */
  private calculateConfidence(rule: CDSRule, context: CDSContext): number {
    // Simplified confidence calculation
    // In real implementation, would use more sophisticated algorithms
    const conditionMatchRatio = rule.conditions.filter(condition =>
      this.evaluateCondition(condition, context)
    ).length / rule.conditions.length;

    const priorityMultiplier = { low: 0.7, medium: 0.8, high: 0.9, critical: 1.0 };
    const priorityBonus = priorityMultiplier[rule.priority];

    return Math.min(conditionMatchRatio * priorityBonus, 1.0);
  }

  /**
   * Get relevant knowledge sources for a rule
   */
  private getRelevantKnowledgeSources(rule: CDSRule): string[] {
    return this.knowledgeSources
      .filter(source => source.categories.some(cat =>
        rule.category === cat ||
        rule.actions.some(action => action.type.includes(cat.split('_')[0]))
      ))
      .map(source => source.id);
  }

  /**
   * Get all available rules
   */
  getRules(): CDSRule[] {
    return [...this.rules];
  }

  /**
   * Get all knowledge sources
   */
  getKnowledgeSources(): CDSKnowledgeSource[] {
    return [...this.knowledgeSources];
  }

  /**
   * Add or update a rule
   */
  updateRule(rule: CDSRule): void {
    const index = this.rules.findIndex(r => r.id === rule.id);
    if (index >= 0) {
      this.rules[index] = rule;
    } else {
      this.rules.push(rule);
    }
  }

  /**
   * Remove a rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  /**
   * Generate OpenFDA-based recommendations
   */
  private async generateOpenFDABasedRecommendations(context: CDSContext): Promise<CDSRecommendation[]> {
    const recommendations: CDSRecommendation[] = [];

    // Check current medications for safety issues
    if (context.currentMedications && context.currentMedications.length > 0) {
      for (const medication of context.currentMedications) {
        const drugName = medication.medicationName || medication.name;

        try {
          // Check for recalls
          const hasRecalls = await this.openFDAService.checkDrugRecalls(drugName);
          if (hasRecalls) {
            recommendations.push({
              id: `openfda_recall_${medication.id}_${Date.now()}`,
              ruleId: 'openfda_recall_check',
              patientId: context.patient.id,
              providerId: 1,
              title: `URGENT: ${drugName} Recall Alert`,
              description: `${drugName} has been recalled. Please review alternative treatment options immediately.`,
              category: 'alert',
              priority: 'critical',
              severity: 'critical',
              supportingEvidence: 'OpenFDA Drug Recall Database',
              suggestedActions: [
                'Stop current prescription',
                'Contact patient immediately',
                'Prescribe alternative medication',
                'Monitor patient closely'
              ],
              alternatives: [],
              contraindications: [],
              confidence: 0.95,
              triggeredConditions: [],
              knowledgeSources: ['openfda'],
              timestamp: new Date().toISOString(),
              status: 'pending'
            });
          }

          // Check for adverse events and safety information
          const safetyStats = await this.openFDAService.getDrugUsageStats(drugName);
          if (safetyStats.seriousEvents > 10) {
            recommendations.push({
              id: `openfda_safety_${medication.id}_${Date.now()}`,
              ruleId: 'openfda_safety_check',
              patientId: context.patient.id,
              providerId: 1,
              title: `Review ${drugName} Safety Profile`,
              description: `${drugName} has ${safetyStats.seriousEvents} reported serious adverse events. Consider risk-benefit analysis.`,
              category: 'alert',
              priority: 'high',
              severity: 'warning',
              supportingEvidence: `OpenFDA Adverse Events Database: ${safetyStats.adverseEventCount} total events, ${safetyStats.seriousEvents} serious`,
              suggestedActions: [
                'Review patient risk factors',
                'Consider dose adjustment',
                'Monitor for adverse effects',
                'Discuss risks with patient'
              ],
              alternatives: [],
              contraindications: [],
              confidence: Math.min(0.8, safetyStats.seriousEvents / 100),
              triggeredConditions: [],
              knowledgeSources: ['openfda'],
              timestamp: new Date().toISOString(),
              status: 'pending'
            });
          }

          // Check for drug interactions
          const interactions = await this.openFDAService.getDrugInteractions(drugName);
          if (interactions.interactions.length > 0) {
            // Check if patient is taking interacting drugs
            const currentDrugNames = context.currentMedications.map(m => m.medicationName || m.name);
            const relevantInteractions = interactions.interactions.filter(interaction =>
              currentDrugNames.some(drug =>
                interaction.toLowerCase().includes(drug.toLowerCase()) &&
                !interaction.toLowerCase().includes(drugName.toLowerCase())
              )
            );

            if (relevantInteractions.length > 0) {
              recommendations.push({
                id: `openfda_interaction_${medication.id}_${Date.now()}`,
                ruleId: 'openfda_interaction_check',
                patientId: context.patient.id,
                providerId: 1,
                title: `Potential Drug Interaction: ${drugName}`,
                description: `${drugName} may interact with other medications. Review concurrent prescriptions.`,
                category: 'alert',
                priority: 'high',
                severity: 'warning',
                supportingEvidence: `OpenFDA Drug Interactions: ${relevantInteractions.join(', ')}`,
                suggestedActions: [
                  'Review all concurrent medications',
                  'Check drug interaction databases',
                  'Consider dose adjustments',
                  'Monitor for interaction symptoms'
                ],
                alternatives: [],
                contraindications: relevantInteractions,
                confidence: 0.85,
                triggeredConditions: [],
                knowledgeSources: ['openfda'],
                timestamp: new Date().toISOString(),
                status: 'pending'
              });
            }
          }

        } catch (error) {
          console.error(`Error checking OpenFDA data for ${drugName}:`, error);
        }
      }
    }

    return recommendations;
  }
}