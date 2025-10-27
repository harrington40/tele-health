import { useState, useCallback } from 'react';
import { backblazeService } from '../services/backblaze.service';
import { FILE_CATEGORIES } from '../config/backblaze';

interface UploadResult {
  fileId: string;
  fileName: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

interface UseFileUploadReturn {
  uploadFile: (file: File, category?: string, userId?: string) => Promise<UploadResult>;
  uploadFiles: (files: File[], category?: string, userId?: string) => Promise<UploadResult[]>;
  deleteFile: (fileId: string) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    category: string = FILE_CATEGORIES.MEDICAL_RECORDS,
    userId?: string
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file before upload
      const validation = backblazeService.validateFilePublic(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const result = await backblazeService.uploadFile(file, category, userId);
      setUploadProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadFiles = useCallback(async (
    files: File[],
    category: string = FILE_CATEGORIES.MEDICAL_RECORDS,
    userId?: string
  ): Promise<UploadResult[]> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate all files before upload
      for (const file of files) {
        const validation = backblazeService.validateFilePublic(file);
        if (!validation.isValid) {
          throw new Error(`File "${file.name}": ${validation.error}`);
        }
      }

      const results = await backblazeService.uploadFiles(files, category, userId);
      setUploadProgress(100);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    setError(null);

    try {
      await backblazeService.deleteFile(fileId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    isUploading,
    uploadProgress,
    error
  };
};