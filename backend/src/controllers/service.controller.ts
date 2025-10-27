import { Request, Response } from 'express';
import { services } from '../models/data';

export class ServiceController {
  static getAllServices(req: Request, res: Response): void {
    try {
      const { category } = req.query;

      let filteredServices = services;

      if (category) {
        filteredServices = filteredServices.filter(
          (service) => service.category.toLowerCase() === (category as string).toLowerCase()
        );
      }

      res.json(filteredServices);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getServiceById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const service = services.find((s) => s.id === parseInt(id));

      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getServicesByCategory(req: Request, res: Response): void {
    try {
      const { category } = req.params;
      const categoryServices = services.filter(
        (service) => service.category.toLowerCase() === category.toLowerCase()
      );

      res.json(categoryServices);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}