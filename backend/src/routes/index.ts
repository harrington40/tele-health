import { Router } from 'express';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import serviceRoutes from './service.routes';
import fileRoutes from './file.routes';

const router: Router = Router();

// API Routes
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/files', fileRoutes as any);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;