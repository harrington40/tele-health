import axios from 'axios';
import { Doctor, Appointment, Patient, Service } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
  getAll: (): Promise<Doctor[]> => api.get('/doctors').then(res => res.data),
  getById: (id: number): Promise<Doctor> => api.get(`/doctors/${id}`).then(res => res.data),
  search: (query: string, specialty?: string): Promise<Doctor[]> => 
    api.get('/doctors/search', { params: { query, specialty } }).then(res => res.data),
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

export default api;