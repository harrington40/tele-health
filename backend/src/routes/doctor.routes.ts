import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const router: Router = Router();

// GET /api/doctors - Get all doctors
router.get('/', DoctorController.getAllDoctors);

// GET /api/doctors/search - Search doctors
router.get('/search', DoctorController.searchDoctors);

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', DoctorController.getDoctorById);

// PUT /api/doctors/:id/discount - Update doctor discount settings
router.put('/:id/discount', DoctorController.updateDoctorDiscount);

// GET /api/doctors/:id/pricing-history - Get doctor pricing history
router.get('/:id/pricing-history', DoctorController.getDoctorPricingHistory);

export default router;