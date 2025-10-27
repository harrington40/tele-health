import { Request, Response } from 'express';
import fileService from '../services/file/file.service';
import { FileRecord } from '../models/types';

export class FileController {
  /**
   * Upload file metadata
   */
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const {
        fileName,
        originalName,
        mimeType,
        size,
        backblazeFileId,
        category,
        patientId,
        appointmentId,
        isPublic,
        tags,
        metadata
      } = req.body;

      // Get user ID from auth middleware (assuming it's set)
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const fileRecord = await fileService.uploadFile({
        fileName,
        originalName,
        mimeType,
        size: parseInt(size),
        backblazeFileId,
        uploadedBy: userId,
        category,
        patientId: patientId ? parseInt(patientId) : undefined,
        appointmentId: appointmentId ? parseInt(appointmentId) : undefined,
        isPublic: isPublic === 'true' || isPublic === true,
        tags: tags ? JSON.parse(tags) : [],
        metadata: metadata ? JSON.parse(metadata) : {}
      });

      res.status(201).json(fileRecord);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get files for user
   */
  static async getFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const {
        category,
        patientId,
        appointmentId,
        limit = '50',
        offset = '0'
      } = req.query;

      const files = await fileService.getFiles({
        userId,
        category: category as string,
        patientId: patientId ? parseInt(patientId as string) : undefined,
        appointmentId: appointmentId ? parseInt(appointmentId as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      res.json(files);
    } catch (error) {
      console.error('Error getting files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get file by ID
   */
  static async getFileById(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const file = await fileService.getFileById(fileId);

      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Check if user has access to this file
      if (file.uploadedBy !== userId && !file.isPublic && file.patientId !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(file);
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await fileService.deleteFile({
        fileId,
        userId
      });

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      if (error instanceof Error && error.message === 'File not found') {
        res.status(404).json({ error: 'File not found' });
      } else if (error instanceof Error && error.message === 'Unauthorized to delete this file') {
        res.status(403).json({ error: 'Access denied' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * Update file metadata
   */
  static async updateFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { category, tags, metadata, isPublic } = req.body;

      const updatedFile = await fileService.updateFile({
        fileId,
        userId,
        category,
        tags: tags ? JSON.parse(tags) : undefined,
        metadata: metadata ? JSON.parse(metadata) : undefined,
        isPublic: isPublic !== undefined ? (isPublic === 'true' || isPublic === true) : undefined
      });

      res.json(updatedFile);
    } catch (error) {
      console.error('Error updating file:', error);
      if (error instanceof Error && error.message === 'File not found') {
        res.status(404).json({ error: 'File not found' });
      } else if (error instanceof Error && error.message === 'Unauthorized to update this file') {
        res.status(403).json({ error: 'Access denied' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const stats = await fileService.getFileStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting file stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}