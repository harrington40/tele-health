import { Request, Response, NextFunction } from 'express';

// File validation constants
export const FILE_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf'
  ],
  allowedCategories: [
    'medical_records',
    'prescriptions',
    'consultation_notes',
    'lab_results',
    'imaging',
    'insurance',
    'other'
  ]
};

export interface FileValidationError {
  field: string;
  message: string;
}

/**
 * Validate file upload metadata
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction): void => {
  const errors: FileValidationError[] = [];

  const {
    fileName,
    originalName,
    mimeType,
    size,
    category
  } = req.body;

  // Validate required fields
  if (!fileName) {
    errors.push({ field: 'fileName', message: 'File name is required' });
  }

  if (!originalName) {
    errors.push({ field: 'originalName', message: 'Original file name is required' });
  }

  if (!mimeType) {
    errors.push({ field: 'mimeType', message: 'MIME type is required' });
  }

  if (!size) {
    errors.push({ field: 'size', message: 'File size is required' });
  } else {
    const fileSize = parseInt(size);
    if (isNaN(fileSize)) {
      errors.push({ field: 'size', message: 'File size must be a valid number' });
    } else if (fileSize > FILE_VALIDATION.maxSize) {
      errors.push({
        field: 'size',
        message: `File size exceeds maximum limit of ${FILE_VALIDATION.maxSize / (1024 * 1024)}MB`
      });
    } else if (fileSize <= 0) {
      errors.push({ field: 'size', message: 'File size must be greater than 0' });
    }
  }

  // Validate MIME type
  if (mimeType && !FILE_VALIDATION.allowedTypes.includes(mimeType)) {
    errors.push({
      field: 'mimeType',
      message: `File type ${mimeType} is not allowed. Allowed types: ${FILE_VALIDATION.allowedTypes.join(', ')}`
    });
  }

  // Validate category
  if (category && !FILE_VALIDATION.allowedCategories.includes(category)) {
    errors.push({
      field: 'category',
      message: `Category '${category}' is not allowed. Allowed categories: ${FILE_VALIDATION.allowedCategories.join(', ')}`
    });
  }

  // Validate file name (prevent path traversal)
  if (fileName && (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\'))) {
    errors.push({
      field: 'fileName',
      message: 'File name contains invalid characters'
    });
  }

  if (originalName && (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\'))) {
    errors.push({
      field: 'originalName',
      message: 'Original file name contains invalid characters'
    });
  }

  // Validate optional fields
  if (req.body.patientId) {
    const patientId = parseInt(req.body.patientId);
    if (isNaN(patientId) || patientId <= 0) {
      errors.push({ field: 'patientId', message: 'Patient ID must be a valid positive number' });
    }
  }

  if (req.body.appointmentId) {
    const appointmentId = parseInt(req.body.appointmentId);
    if (isNaN(appointmentId) || appointmentId <= 0) {
      errors.push({ field: 'appointmentId', message: 'Appointment ID must be a valid positive number' });
    }
  }

  // Validate tags (if provided)
  if (req.body.tags) {
    try {
      const tags = JSON.parse(req.body.tags);
      if (!Array.isArray(tags)) {
        errors.push({ field: 'tags', message: 'Tags must be an array' });
      } else if (tags.length > 10) {
        errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
      } else if (tags.some((tag: any) => typeof tag !== 'string' || tag.length > 50)) {
        errors.push({ field: 'tags', message: 'Tags must be strings with maximum 50 characters each' });
      }
    } catch (e) {
      errors.push({ field: 'tags', message: 'Tags must be valid JSON' });
    }
  }

  // Validate metadata (if provided)
  if (req.body.metadata) {
    try {
      const metadata = JSON.parse(req.body.metadata);
      if (typeof metadata !== 'object' || Array.isArray(metadata)) {
        errors.push({ field: 'metadata', message: 'Metadata must be an object' });
      } else {
        // Check metadata size (limit to 1KB)
        const metadataSize = JSON.stringify(metadata).length;
        if (metadataSize > 1024) {
          errors.push({ field: 'metadata', message: 'Metadata size exceeds 1KB limit' });
        }
      }
    } catch (e) {
      errors.push({ field: 'metadata', message: 'Metadata must be valid JSON' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
    return;
  }

  next();
};

/**
 * Rate limiting for file uploads (simple in-memory implementation)
 */
const uploadCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitFileUploads = (req: Request, res: Response, next: NextFunction): void => {
  const userId = (req as any).user?.id;
  if (!userId) {
    next();
    return;
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxUploads = 50; // Max 50 uploads per 15 minutes

  const userUploads = uploadCounts.get(userId.toString());

  if (!userUploads || now > userUploads.resetTime) {
    // Reset or initialize
    uploadCounts.set(userId.toString(), {
      count: 1,
      resetTime: now + windowMs
    });
  } else if (userUploads.count >= maxUploads) {
    res.status(429).json({
      error: 'Too many file uploads',
      message: 'You have exceeded the maximum number of file uploads. Please try again later.',
      retryAfter: Math.ceil((userUploads.resetTime - now) / 1000)
    });
    return;
  } else {
    userUploads.count++;
  }

  next();
};

/**
 * Security headers for file responses
 */
export const addSecurityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Content Security Policy for file serving
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' https://f000.backblazeb2.com");

  next();
};