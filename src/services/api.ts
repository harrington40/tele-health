import axios from 'axios';
import { Doctor, Appointment, Patient, Service } from '../types';

// API runs on port 8081, frontend on port 3000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://207.180.247.153:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor API
export const doctorAPI = {
  getAll: (): Promise<Doctor[]> => api.get('/doctors').then(res => res.data.doctors),
  getById: (id: number): Promise<Doctor> => api.get(`/doctors/${id}`).then(res => res.data),
  search: (query: string, specialty?: string): Promise<Doctor[]> => 
    api.get('/doctors/search', { params: { query, specialty } }).then(res => res.data.doctors),
};

// Appointment API
export const appointmentAPI = {
  create: (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => 
    api.post('/appointments', appointment).then(res => res.data),
  getByPatient: (patientId: number): Promise<Appointment[]> => 
    api.get(`/appointments/patient/${patientId}`).then(res => res.data),
  update: (id: number, appointment: Partial<Appointment>): Promise<Appointment> => 
    api.put(`/appointments/${id}`, appointment).then(res => res.data),
  cancel: (id: number): Promise<void> => 
    api.delete(`/appointments/${id}`).then(res => res.data),
};

// Patient API
export const patientAPI = {
  create: (patient: Omit<Patient, 'id'>): Promise<Patient> => 
    api.post('/patients', patient).then(res => res.data),
  getById: (id: number): Promise<Patient> => 
    api.get(`/patients/${id}`).then(res => res.data),
  update: (id: number, patient: Partial<Patient>): Promise<Patient> => 
    api.put(`/patients/${id}`, patient).then(res => res.data),
};

// Service API
export const serviceAPI = {
  getAll: (): Promise<Service[]> => api.get('/services').then(res => res.data),
  getByCategory: (category: string): Promise<Service[]> => 
    api.get(`/services/category/${category}`).then(res => res.data),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<{ token: string; user: Patient }> => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  register: (userData: Omit<Patient, 'id'> & { password: string }): Promise<{ token: string; user: Patient }> => 
    api.post('/auth/register', userData).then(res => res.data),
  logout: (): Promise<void> => 
    api.post('/auth/logout').then(res => res.data),
};

// Doctor Dashboard API
export const doctorDashboardAPI = {
  getDashboard: (doctorId: string): Promise<any> => 
    api.get(`/doctor/dashboard/${doctorId}`).then(res => res.data),
  getPatients: (doctorId: string): Promise<any[]> => 
    api.get(`/doctor/${doctorId}/patients`).then(res => res.data.patients),
  getAppointments: (doctorId: string): Promise<any[]> => 
    api.get(`/doctor/${doctorId}/appointments`).then(res => res.data.appointments),
  getDocuments: (doctorId: string): Promise<any[]> => 
    api.get(`/doctor/${doctorId}/documents`).then(res => res.data.documents),
  uploadDocument: (doctorId: string, data: { name: string; type: string; patientId: string }): Promise<any> => 
    api.post(`/doctor/${doctorId}/documents/upload`, data).then(res => res.data),
  shareDocument: (doctorId: string, documentId: string, data: { patientId: string; permissions: string[] }): Promise<any> => 
    api.post(`/doctor/${doctorId}/documents/${documentId}/share`, data).then(res => res.data),
};

export default api;