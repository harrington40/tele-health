import { Request, Response } from 'express';
import { appointments } from '../models/data';
import { Appointment } from '../models/types';

export class AppointmentController {
  static getAllAppointments(req: Request, res: Response): void {
    try {
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getAppointmentById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const appointment = appointments.find((a) => a.id === parseInt(id));

      if (!appointment) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static createAppointment(req: Request, res: Response): void {
    try {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        ...req.body,
      };

      appointments.push(newAppointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static updateAppointment(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const appointmentIndex = appointments.findIndex((a) => a.id === parseInt(id));

      if (appointmentIndex === -1) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...req.body };
      res.json(appointments[appointmentIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static deleteAppointment(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const appointmentIndex = appointments.findIndex((a) => a.id === parseInt(id));

      if (appointmentIndex === -1) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      appointments.splice(appointmentIndex, 1);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getAppointmentsByPatient(req: Request, res: Response): void {
    try {
      const { patientId } = req.params;
      const patientAppointments = appointments.filter(
        (a) => a.patientId === parseInt(patientId)
      );

      res.json(patientAppointments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}