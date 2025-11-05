import axios from 'axios';
import { Patient } from '../types';

const API_BASE_URL = 'http://207.180.247.153:8081/api';

export const patientAPI = {
  // Get all patients
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patients`);
      return response.data.patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get single patient by ID
  getPatient: async (patientId: string): Promise<Patient> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`);
      return response.data.patient;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  // Create new patient
  createPatient: async (patientData: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patients`, patientData);
      return response.data.patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (patientId: string, patientData: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/patients/${patientId}`, patientData);
      return response.data.patient;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Delete patient
  deletePatient: async (patientId: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/patients/${patientId}`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};

// Helper to get current logged-in patient (from localStorage or auth)
export const getCurrentPatient = (): Patient | null => {
  const patientData = localStorage.getItem('current_patient');
  return patientData ? JSON.parse(patientData) : null;
};

// Helper to set current patient
export const setCurrentPatient = (patient: Patient): void => {
  localStorage.setItem('current_patient', JSON.stringify(patient));
};

// Helper to clear current patient (logout)
export const clearCurrentPatient = (): void => {
  localStorage.removeItem('current_patient');
};

export default patientAPI;
