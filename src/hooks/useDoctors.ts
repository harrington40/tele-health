import { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { doctorAPI } from '../services/api';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log('useDoctors: Fetching doctors from API...');
        // Try direct fetch instead of axios
        const response = await fetch('http://207.180.247.153:8081/api/doctors');
        console.log('useDoctors: Fetch response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('useDoctors: Received doctors:', data.doctors?.length || 0);
        setDoctors(data.doctors || []);
      } catch (err: any) {
        console.error('useDoctors: Error fetching doctors:', err);
        console.error('useDoctors: Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const searchDoctors = async (query: string, specialty?: string) => {
    try {
      setLoading(true);
      const data = await doctorAPI.search(query, specialty);
      setDoctors(data);
    } catch (err) {
      setError('Failed to search doctors');
      console.error('Error searching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    loading,
    error,
    searchDoctors,
  };
};