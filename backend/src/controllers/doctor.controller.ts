import { Request, Response } from 'express';
import { doctors } from '../models/data';
import { Doctor } from '../models/types';

export class DoctorController {
  static getAllDoctors(req: Request, res: Response): void {
    try {
      const { specialty, search } = req.query;

      let filteredDoctors = doctors;

      if (specialty) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.specialty.toLowerCase() === (specialty as string).toLowerCase()
        );
      }

      if (search) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes((search as string).toLowerCase()) ||
            doctor.specialty.toLowerCase().includes((search as string).toLowerCase())
        );
      }

      res.json(filteredDoctors);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getDoctorById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const doctor = doctors.find((d) => d.id === parseInt(id));

      if (!doctor) {
        res.status(404).json({ error: 'Doctor not found' });
        return;
      }

      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static searchDoctors(req: Request, res: Response): void {
    try {
      const { query, specialty } = req.query;
      let filteredDoctors = doctors;

      if (query) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes((query as string).toLowerCase()) ||
            doctor.specialty.toLowerCase().includes((query as string).toLowerCase())
        );
      }

      if (specialty) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.specialty.toLowerCase() === (specialty as string).toLowerCase()
        );
      }

      res.json(filteredDoctors);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}