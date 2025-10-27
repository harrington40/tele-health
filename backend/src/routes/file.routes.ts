import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { validateFileUpload, rateLimitFileUploads, addSecurityHeaders } from '../middleware/fileValidation.middleware';

const router: Router = Router();

// Apply security headers to all file routes
router.use(addSecurityHeaders);

// POST /api/files - Upload file metadata
router.post('/', rateLimitFileUploads, validateFileUpload, FileController.uploadFile);

// GET /api/files - Get files for user
router.get('/', FileController.getFiles);

// GET /api/files/stats - Get file statistics
router.get('/stats', FileController.getFileStats);

// GET /api/files/:fileId - Get file by ID
router.get('/:fileId', FileController.getFileById);

// PUT /api/files/:fileId - Update file metadata
router.put('/:fileId', FileController.updateFile);

// DELETE /api/files/:fileId - Delete file
router.delete('/:fileId', FileController.deleteFile);

export default router;