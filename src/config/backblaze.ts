// Backblaze B2 Configuration
export const backblazeConfig = {
  applicationKeyId: process.env.REACT_APP_BACKBLAZE_KEY_ID || '',
  applicationKey: process.env.REACT_APP_BACKBLAZE_APPLICATION_KEY || '',
  bucketId: process.env.REACT_APP_BACKBLAZE_BUCKET_ID || '',
  bucketName: process.env.REACT_APP_BACKBLAZE_BUCKET_NAME || 'telehealth-files',
  endpoint: 'https://api.backblazeb2.com'
};

// File upload limits
export const UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
};

// File categories for organization
export const FILE_CATEGORIES = {
  PROFILE_IMAGES: 'profile-images',
  MEDICAL_RECORDS: 'medical-records',
  PRESCRIPTIONS: 'prescriptions',
  CONSULTATION_FILES: 'consultation-files',
  LAB_RESULTS: 'lab-results'
};