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
        const data = await doctorAPI.getAll();
        setDoctors(data);
      } catch (err) {
        setError('Failed to fetch doctors');
        console.error('Error fetching doctors:', err);
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