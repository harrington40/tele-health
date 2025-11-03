import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { backblazeService } from '../../services/backblaze.service';

interface UploadedFile {
  fileId: string;
  fileName: string;
  url: string;
  size: number;
  uploadedAt: Date;
  category?: string;
}

interface FileManagerProps {
  userId?: string;
  category?: string;
  onFileDeleted?: (fileId: string) => void;
  onFileDownloaded?: (fileId: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  userId,
  category,
  onFileDeleted,
  onFileDownloaded
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file: UploadedFile | null }>({
    open: false,
    file: null
  });

  // Mock data for demonstration - in real app, this would come from backend
  const mockFiles: UploadedFile[] = [
    {
      fileId: 'file1',
      fileName: 'blood_test_results.pdf',
      url: '#',
      size: 245760,
      uploadedAt: new Date('2024-01-15'),
      category: 'medical_records'
    },
    {
      fileId: 'file2',
      fileName: 'prescription_jan2024.jpg',
      url: '#',
      size: 512000,
      uploadedAt: new Date('2024-01-10'),
      category: 'prescriptions'
    },
    {
      fileId: 'file3',
      fileName: 'consultation_notes.docx',
      url: '#',
      size: 128000,
      uploadedAt: new Date('2024-01-08'),
      category: 'consultation_notes'
    }
  ];

  useEffect(() => {
    loadFiles();
  }, [userId, category]);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the backend API
      // For now, we'll use mock data filtered by category
      const filteredFiles = category
        ? mockFiles.filter(file => file.category === category)
        : mockFiles;

      setFiles(filteredFiles);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      // In a real implementation, this would get the download URL from Backblaze
      // For now, we'll simulate the download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onFileDownloaded?.(file.fileId);
    } catch (err) {
      setError('Failed to download file');
      console.error('Error downloading file:', err);
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    try {
      // In a real implementation, this would call backblazeService.deleteFile
      // await backblazeService.deleteFile(file.fileId);

      // Remove from local state
      setFiles(prev => prev.filter(f => f.fileId !== file.fileId));
      setDeleteDialog({ open: false, file: null });

      onFileDeleted?.(file.fileId);
    } catch (err) {
      setError('Failed to delete file');
      console.error('Error deleting file:', err);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon color="primary" />;
      case 'doc':
      case 'docx':
        return <DocIcon color="info" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Uploaded Files {category && `(${category.replace('_', ' ')})`}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadFiles}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {files.length === 0 ? (
        <Alert severity="info">
          No files uploaded yet. Use the upload form above to add files.
        </Alert>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.fileId} divider>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {getFileIcon(file.fileName)}
              </Box>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {file.fileName}
                    </Typography>
                    {file.category && (
                      <Chip
                        label={file.category.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)} • Uploaded {formatDate(file.uploadedAt)}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Download">
                  <IconButton
                    edge="end"
                    onClick={() => handleDownload(file)}
                    sx={{ mr: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    onClick={() => setDeleteDialog({ open: true, file })}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, file: null })}
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.file?.fileName}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, file: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteDialog.file && handleDelete(deleteDialog.file)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};