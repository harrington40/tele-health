// @ts-nocheck
import * as grpc from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { db } from '../../config/database';
import logger from '../../utils/logger';
import { FileRecord } from '../../models/types';

interface UploadFileRequest {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  backblazeFileId: string;
  uploadedBy: number;
  category: string;
  patientId?: number;
  appointmentId?: number;
  isPublic?: boolean;
  tags?: string[];
  metadata?: { [key: string]: any };
}

interface GetFilesRequest {
  userId: number;
  category?: string;
  patientId?: number;
  appointmentId?: number;
  limit?: number;
  offset?: number;
}

interface DeleteFileRequest {
  fileId: string;
  userId: number;
}

interface UpdateFileRequest {
  fileId: string;
  userId: number;
  category?: string;
  tags?: string[];
  metadata?: { [key: string]: any };
  isPublic?: boolean;
}

class FileService {
  private tableName = 'files';

  /**
   * Initialize the files table
   */
  async initializeTable(): Promise<void> {
    try {
      const exists = await db.tableList().contains(this.tableName).run();
      if (!exists) {
        await db.tableCreate(this.tableName).run();
        await db.table(this.tableName).indexCreate('uploadedBy').run();
        await db.table(this.tableName).indexCreate('category').run();
        await db.table(this.tableName).indexCreate('patientId').run();
        await db.table(this.tableName).indexCreate('appointmentId').run();
        await db.table(this.tableName).indexCreate('uploadedAt').run();
        logger.info('Files table created with indexes');
      }
    } catch (error) {
      logger.error('Error initializing files table:', error);
      throw error;
    }
  }

  /**
   * Upload file metadata to database
   */
  async uploadFile(request: UploadFileRequest): Promise<FileRecord> {
    try {
      const fileRecord: FileRecord = {
        id: uuidv4(),
        fileName: request.fileName,
        originalName: request.originalName,
        mimeType: request.mimeType,
        size: request.size,
        url: `https://f000.backblazeb2.com/file/${config.backblaze.bucketName}/${request.fileName}`,
        backblazeFileId: request.backblazeFileId,
        uploadedBy: request.uploadedBy,
        uploadedAt: new Date().toISOString(),
        category: request.category,
        patientId: request.patientId,
        appointmentId: request.appointmentId,
        isPublic: request.isPublic || false,
        tags: request.tags || [],
        metadata: request.metadata || {}
      };

      await db.table(this.tableName).insert(fileRecord).run();
      logger.info(`File uploaded: ${fileRecord.id}`);
      return fileRecord;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Get files for a user
   */
  async getFiles(request: GetFilesRequest): Promise<FileRecord[]> {
    try {
      let query = db.table(this.tableName);

      // Filter by user (files uploaded by or accessible to the user)
      query = query.filter((file: any) => {
        return file('uploadedBy').eq(request.userId).or(
          file('isPublic').eq(true).and(
            file('patientId').eq(request.userId)
          )
        );
      });

      // Additional filters
      if (request.category) {
        query = query.filter({ category: request.category });
      }
      if (request.patientId) {
        query = query.filter({ patientId: request.patientId });
      }
      if (request.appointmentId) {
        query = query.filter({ appointmentId: request.appointmentId });
      }

      // Sort by upload date (newest first)
      query = query.orderBy(db.desc('uploadedAt'));

      // Pagination
      if (request.limit) {
        query = query.limit(request.limit);
      }
      if (request.offset) {
        query = query.skip(request.offset);
      }

      const result = await query.run();
      return result;
    } catch (error) {
      logger.error('Error getting files:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string): Promise<FileRecord | null> {
    try {
      const result = await db.table(this.tableName).get(fileId).run();
      return result;
    } catch (error) {
      logger.error('Error getting file by ID:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(request: DeleteFileRequest): Promise<boolean> {
    try {
      // First check if user owns the file
      const file = await this.getFileById(request.fileId);
      if (!file) {
        throw new Error('File not found');
      }

      if (file.uploadedBy !== request.userId) {
        throw new Error('Unauthorized to delete this file');
      }

      // Delete from database
      await db.table(this.tableName).get(request.fileId).delete().run();

      // TODO: Also delete from Backblaze B2
      // This would require calling the Backblaze API to delete the file

      logger.info(`File deleted: ${request.fileId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  async updateFile(request: UpdateFileRequest): Promise<FileRecord> {
    try {
      // First check if user owns the file
      const file = await this.getFileById(request.fileId);
      if (!file) {
        throw new Error('File not found');
      }

      if (file.uploadedBy !== request.userId) {
        throw new Error('Unauthorized to update this file');
      }

      const updates: Partial<FileRecord> = {};
      if (request.category !== undefined) updates.category = request.category;
      if (request.tags !== undefined) updates.tags = request.tags;
      if (request.metadata !== undefined) updates.metadata = request.metadata;
      if (request.isPublic !== undefined) updates.isPublic = request.isPublic;

      const result = await db.table(this.tableName)
        .get(request.fileId)
        .update(updates)
        .run();

      if (result.replaced === 0) {
        throw new Error('File not found or no changes made');
      }

      // Return updated file
      const updatedFile = await this.getFileById(request.fileId);
      logger.info(`File updated: ${request.fileId}`);
      return updatedFile!;
    } catch (error) {
      logger.error('Error updating file:', error);
      throw error;
    }
  }

  /**
   * Get file statistics for a user
   */
  async getFileStats(userId: number): Promise<{
    totalFiles: number;
    totalSize: number;
    categories: { [key: string]: number };
  }> {
    try {
      const files = await db.table(this.tableName)
        .filter({ uploadedBy: userId })
        .run();

      const stats = {
        totalFiles: files.length,
        totalSize: files.reduce((sum: number, file: FileRecord) => sum + file.size, 0),
        categories: {} as { [key: string]: number }
      };

      // Count files by category
      files.forEach((file: FileRecord) => {
        stats.categories[file.category] = (stats.categories[file.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting file stats:', error);
      throw error;
    }
  }
}

export default new FileService();