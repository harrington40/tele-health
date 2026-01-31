import axios from 'axios';

export interface OpenFDADrugInfo {
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_type?: string;
  route?: string[];
  substance_name?: string[];
  product_ndc?: string;
  package_ndc?: string;
  application_number?: string;
  rxcui?: string[];
  spl_id?: string;
  spl_set_id?: string;
  unii?: string[];
  nui?: string[];
  pharm_class_epc?: string[];
  pharm_class_moa?: string[];
  pharm_class_pe?: string[];
}

export interface OpenFDALabelData {
  id: string;
  set_id: string;
  version: number;
  effective_time: string;
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_type?: string[];
    route?: string[];
    substance_name?: string[];
    product_ndc?: string[];
    package_ndc?: string[];
    application_number?: string[];
    rxcui?: string[];
    spl_id?: string[];
    spl_set_id?: string[];
    unii?: string[];
    nui?: string[];
    pharm_class_epc?: string[];
    pharm_class_moa?: string[];
    pharm_class_pe?: string[];
  };
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  dosage_forms_and_strengths?: string[];
  contraindications?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  drug_interactions?: string[];
  use_in_specific_populations?: string[];
  overdosage?: string[];
  description?: string[];
  clinical_pharmacology?: string[];
  mechanism_of_action?: string[];
  pharmacokinetics?: string[];
  nonclinical_toxicology?: string[];
  clinical_studies?: string[];
  references?: string[];
  how_supplied?: string[];
  information_for_patients?: string[];
  package_label_principal_display_panel?: string[];
  recent_major_changes?: string[];
  microbiology?: string[];
}

export interface OpenFDAAdverseEvent {
  safetyreportid: string;
  safetyreportversion: string;
  primarysourcecountry: string;
  occurcountry: string;
  transmissiondateformat: string;
  transmissiondate: string;
  reporttype: string;
  serious: string;
  seriousnessdeath: string;
  seriousnesslifethreatening: string;
  seriousnesshospitalization: string;
  seriousnessdisabling: string;
  seriousnesscongenitalanomali: string;
  seriousnessother: string;
  receivedateformat: string;
  receivedate: string;
  receiptdateformat: string;
  receiptdate: string;
  patient: {
    patientonsetage: string;
    patientonsetageunit: string;
    patientsex: string;
    patientweight: string;
    reaction: Array<{
      reactionmeddrapt: string;
      reactionmeddraversionpt: string;
      reactionoutcome: string;
    }>;
  };
  primarysource: {
    reportercountry: string;
    qualification: string;
  };
  sender: {
    sendertype: string;
    senderorganization: string;
  };
  receiver: {
    receivertype: string;
    receiverorganization: string;
  };
}

export interface OpenFDARecall {
  recall_number: string;
  reason_for_recall: string;
  status: string;
  distribution_pattern: string;
  product_description: string;
  code_info: string;
  recalling_firm: string;
  recall_initiation_date: string;
  report_date: string;
  classification: string;
  openfda: {
    device_name?: string;
    medical_specialty_description?: string;
    device_class?: string;
    regulation_number?: string;
    fei_number?: string[];
    registration_number?: string[];
    pma_number?: string[];
    k_number?: string[];
  };
}

class OpenFDAService {
  private static instance: OpenFDAService;
  private baseURL = 'https://api.fda.gov';
  private apiKey?: string;

  public static getInstance(): OpenFDAService {
    if (!OpenFDAService.instance) {
      OpenFDAService.instance = new OpenFDAService();
    }
    return OpenFDAService.instance;
  }

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENFDA_API_KEY;
  }

  /**
   * Search for drug information by name
   */
  async searchDrugByName(drugName: string, limit = 10): Promise<OpenFDADrugInfo[]> {
    try {
      const response = await axios.get(`${this.baseURL}/drug/ndc.json`, {
        params: {
          search: `brand_name:"${drugName}" OR generic_name:"${drugName}"`,
          limit,
          api_key: this.apiKey
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Error searching drug by name:', error);
      return [];
    }
  }

  /**
   * Get detailed drug label information
   */
  async getDrugLabel(drugName: string): Promise<OpenFDALabelData[]> {
    try {
      const response = await axios.get(`${this.baseURL}/drug/label.json`, {
        params: {
          search: `openfda.brand_name:"${drugName}" OR openfda.generic_name:"${drugName}"`,
          limit: 5,
          api_key: this.apiKey
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Error getting drug label:', error);
      return [];
    }
  }

  /**
   * Search for adverse events related to a drug
   */
  async getAdverseEvents(drugName: string, limit = 20): Promise<OpenFDAAdverseEvent[]> {
    try {
      const response = await axios.get(`${this.baseURL}/drug/event.json`, {
        params: {
          search: `patient.drug.medicinalproduct:"${drugName}"`,
          limit,
          api_key: this.apiKey
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Error getting adverse events:', error);
      return [];
    }
  }

  /**
   * Search for drug recalls
   */
  async getDrugRecalls(drugName: string, limit = 10): Promise<OpenFDARecall[]> {
    try {
      const response = await axios.get(`${this.baseURL}/drug/enforcement.json`, {
        params: {
          search: `product_description:"${drugName}"`,
          limit,
          api_key: this.apiKey
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Error getting drug recalls:', error);
      return [];
    }
  }

  /**
   * Get drug interactions and warnings
   */
  async getDrugInteractions(drugName: string): Promise<{
    interactions: string[];
    warnings: string[];
    contraindications: string[];
  }> {
    try {
      const labels = await this.getDrugLabel(drugName);

      const interactions: string[] = [];
      const warnings: string[] = [];
      const contraindications: string[] = [];

      labels.forEach(label => {
        if (label.drug_interactions) {
          interactions.push(...label.drug_interactions);
        }
        if (label.warnings) {
          warnings.push(...label.warnings);
        }
        if (label.contraindications) {
          contraindications.push(...label.contraindications);
        }
      });

      return {
        interactions: Array.from(new Set(interactions)),
        warnings: Array.from(new Set(warnings)),
        contraindications: Array.from(new Set(contraindications))
      };
    } catch (error) {
      console.error('Error getting drug interactions:', error);
      return {
        interactions: [],
        warnings: [],
        contraindications: []
      };
    }
  }

  /**
   * Get comprehensive drug safety information
   */
  async getDrugSafetyInfo(drugName: string): Promise<{
    drugInfo: OpenFDADrugInfo[];
    labels: OpenFDALabelData[];
    adverseEvents: OpenFDAAdverseEvent[];
    recalls: OpenFDARecall[];
    interactions: string[];
    warnings: string[];
    contraindications: string[];
  }> {
    try {
      const [drugInfo, labels, adverseEvents, recalls, interactionsData] = await Promise.all([
        this.searchDrugByName(drugName, 5),
        this.getDrugLabel(drugName),
        this.getAdverseEvents(drugName, 10),
        this.getDrugRecalls(drugName, 5),
        this.getDrugInteractions(drugName)
      ]);

      return {
        drugInfo,
        labels,
        adverseEvents,
        recalls,
        interactions: interactionsData.interactions,
        warnings: interactionsData.warnings,
        contraindications: interactionsData.contraindications
      };
    } catch (error) {
      console.error('Error getting comprehensive drug safety info:', error);
      return {
        drugInfo: [],
        labels: [],
        adverseEvents: [],
        recalls: [],
        interactions: [],
        warnings: [],
        contraindications: []
      };
    }
  }

  /**
   * Check if a drug has any active recalls
   */
  async checkDrugRecalls(drugName: string): Promise<boolean> {
    try {
      const recalls = await this.getDrugRecalls(drugName, 1);
      return recalls.length > 0;
    } catch (error) {
      console.error('Error checking drug recalls:', error);
      return false;
    }
  }

  /**
   * Get drug usage statistics and trends
   */
  async getDrugUsageStats(drugName: string): Promise<{
    adverseEventCount: number;
    seriousEvents: number;
    recentRecalls: number;
  }> {
    try {
      const [adverseEvents, recalls] = await Promise.all([
        this.getAdverseEvents(drugName, 100),
        this.getDrugRecalls(drugName, 10)
      ]);

      const seriousEvents = adverseEvents.filter(event =>
        event.serious === '1' ||
        event.seriousnessdeath === '1' ||
        event.seriousnesslifethreatening === '1' ||
        event.seriousnesshospitalization === '1'
      ).length;

      const recentRecalls = recalls.filter(recall => {
        const recallDate = new Date(recall.recall_initiation_date);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return recallDate > oneYearAgo;
      }).length;

      return {
        adverseEventCount: adverseEvents.length,
        seriousEvents,
        recentRecalls
      };
    } catch (error) {
      console.error('Error getting drug usage stats:', error);
      return {
        adverseEventCount: 0,
        seriousEvents: 0,
        recentRecalls: 0
      };
    }
  }
}

export default OpenFDAService;