import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const router: Router = Router();

// GET /api/doctors - Get all doctors
router.get('/', DoctorController.getAllDoctors);

// GET /api/doctors/search - Search doctors
router.get('/search', DoctorController.searchDoctors);

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', DoctorController.getDoctorById);

export default router;