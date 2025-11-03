import B2 from 'backblaze-b2';
import { backblazeConfig, FILE_CATEGORIES, UPLOAD_LIMITS } from '../config/backblaze';

class BackblazeService {
  private b2: any;
  private authorized = false;
  private uploadUrl = '';
  private uploadAuthToken = '';

  constructor() {
    this.b2 = new B2({
      applicationKeyId: backblazeConfig.applicationKeyId,
      applicationKey: backblazeConfig.applicationKey
    });
  }

  /**
   * Sanitize file name for safe storage
   */
  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  }

  /**
   * Authorize with Backblaze B2
   */
  async authorize(): Promise<void> {
    try {
      if (this.authorized) return;

      const response = await this.b2.authorize();
      this.authorized = true;
      console.log('✅ Authorized with Backblaze B2');
    } catch (error) {
      console.error('❌ Backblaze authorization failed:', error);
      throw new Error('Failed to authorize with Backblaze');
    }
  }

  /**
   * Get upload URL for file uploads
   */
  async getUploadUrl(): Promise<void> {
    try {
      await this.authorize();

      const response = await this.b2.getUploadUrl({
        bucketId: backblazeConfig.bucketId
      });

      this.uploadUrl = response.data.uploadUrl;
      this.uploadAuthToken = response.data.authorizationToken;
    } catch (error) {
      console.error('❌ Failed to get upload URL:', error);
      throw new Error('Failed to get upload URL');
    }
  }

  /**
   * Upload a file to Backblaze B2
   */
  async uploadFile(
    file: File,
    category: string = FILE_CATEGORIES.MEDICAL_RECORDS,
    userId?: string
  ): Promise<{
    fileId: string;
    fileName: string;
    url: string;
    size: number;
    uploadedAt: Date;
  }> {
    try {
      // Validate file
      this.validateFile(file);

      // Ensure we have upload URL
      if (!this.uploadUrl || !this.uploadAuthToken) {
        await this.getUploadUrl();
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = userId
        ? `${category}/${userId}/${timestamp}_${randomId}.${fileExtension}`
        : `${category}/${timestamp}_${randomId}.${fileExtension}`;

      // Convert file to buffer
      const fileBuffer = await file.arrayBuffer();

      // Upload file
      const response = await this.b2.uploadFile({
        uploadUrl: this.uploadUrl,
        uploadAuthToken: this.uploadAuthToken,
        fileName: fileName,
        data: Buffer.from(fileBuffer),
        contentType: file.type,
        onUploadProgress: (event: any) => {
          console.log(`Upload progress: ${Math.round((event.loaded / event.total) * 100)}%`);
        }
      });

      // Generate public URL
      const publicUrl = `https://f002.backblazeb2.com/file/${backblazeConfig.bucketName}/${fileName}`;

      const result = {
        fileId: response.data.fileId,
        fileName: fileName,
        url: publicUrl,
        size: file.size,
        uploadedAt: new Date()
      };

      console.log('✅ File uploaded successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    category: string = FILE_CATEGORIES.MEDICAL_RECORDS,
    userId?: string
  ): Promise<Array<{
    fileId: string;
    fileName: string;
    url: string;
    size: number;
    uploadedAt: Date;
  }>> {
    const results = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, category, userId);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  /**
   * Delete a file from Backblaze B2
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.authorize();

      await this.b2.deleteFileVersion({
        fileId: fileId,
        fileName: '' // Not needed for fileId-based deletion
      });

      console.log('✅ File deleted successfully:', fileId);
    } catch (error) {
      console.error('❌ File deletion failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      await this.authorize();

      const response = await this.b2.getFileInfo({
        fileId: fileId
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
      throw new Error('Failed to get file info');
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(
    prefix?: string,
    maxFileCount: number = 100
  ): Promise<any[]> {
    try {
      await this.authorize();

      const response = await this.b2.listFileNames({
        bucketId: backblazeConfig.bucketId,
        prefix: prefix,
        maxFileCount: maxFileCount
      });

      return response.data.files;
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    const validation = this.validateFilePublic(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
  }

  /**
   * Public validation method that returns validation result
   */
  validateFilePublic(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > UPLOAD_LIMITS.maxFileSize) {
      return {
        isValid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of ${UPLOAD_LIMITS.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!UPLOAD_LIMITS.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${UPLOAD_LIMITS.allowedTypes.join(', ')}`
      };
    }

    // Check for malicious file names
    const fileName = file.name.toLowerCase();
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return {
        isValid: false,
        error: 'File name contains invalid characters'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate a unique file name
   */
  generateFileName(originalName: string, category: string, userId?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const baseName = userId
      ? `${category}/${userId}/${timestamp}_${randomId}`
      : `${category}/${timestamp}_${randomId}`;

    return `${baseName}.${extension}`;
  }
}

// Export singleton instance
export const backblazeService = new BackblazeService();
export default backblazeService;