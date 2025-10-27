import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

const router: Router = Router();

// GET /api/services - Get all services
router.get('/', ServiceController.getAllServices);

// GET /api/services/:id - Get service by ID
router.get('/:id', ServiceController.getServiceById);

// GET /api/services/category/:category - Get services by category
router.get('/category/:category', ServiceController.getServicesByCategory);

export default router;