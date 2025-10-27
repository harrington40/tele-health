import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router: Router = Router();

// GET /api/appointments - Get all appointments
router.get('/', AppointmentController.getAllAppointments);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', AppointmentController.getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', AppointmentController.createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', AppointmentController.updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', AppointmentController.deleteAppointment);

// GET /api/appointments/patient/:patientId - Get appointments by patient
router.get('/patient/:patientId', AppointmentController.getAppointmentsByPatient);

export default router;