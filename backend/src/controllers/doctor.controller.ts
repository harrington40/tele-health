import { Request, Response } from 'express';
import { doctors } from '../models/data';
import { Doctor, PricingActivity } from '../models/types';

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
      const doctor = doctors.find((d) => d.id === id);

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

  static updateDoctorDiscount(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { discountSettings } = req.body;
      
      const doctorIndex = doctors.findIndex((d) => d.id === id);
      
      if (doctorIndex === -1) {
        res.status(404).json({ error: 'Doctor not found' });
        return;
      }

      // Update discount settings
      doctors[doctorIndex].discountSettings = discountSettings;

      // Add to pricing history
      const activity: PricingActivity = {
        id: Date.now().toString(),
        doctorId: id,
        action: discountSettings.isEnabled ? 'discount_enabled' as const : 'discount_disabled' as const,
        description: discountSettings.isEnabled 
          ? `Enabled ${discountSettings.discountPercentage}% discount`
          : 'Disabled active discount',
        timestamp: new Date().toISOString(),
        discountPercentage: discountSettings.discountPercentage,
      };

      if (!doctors[doctorIndex].pricingHistory) {
        doctors[doctorIndex].pricingHistory = [];
      }
      doctors[doctorIndex].pricingHistory!.unshift(activity);

      res.json({ 
        message: 'Discount settings updated successfully',
        doctor: doctors[doctorIndex]
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getDoctorPricingHistory(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const doctor = doctors.find((d) => d.id === id);

      if (!doctor) {
        res.status(404).json({ error: 'Doctor not found' });
        return;
      }

      res.json(doctor.pricingHistory || []);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}