import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FILE_CATEGORIES, UPLOAD_LIMITS } from '../../config/backblaze';

interface FileUploadProps {
  onUploadComplete?: (files: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  category?: string;
  userId?: string;
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

interface UploadResult {
  fileId: string;
  fileName: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  category = FILE_CATEGORIES.MEDICAL_RECORDS,
  userId,
  multiple = false,
  maxFiles = 5,
  acceptedTypes = UPLOAD_LIMITS.allowedTypes.join(','),
  label = 'Upload Files',
  helperText = 'Select files to upload',
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);

  const { uploadFiles, isUploading, uploadProgress, error } = useFileUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Validate file count
    if (multiple && files.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > UPLOAD_LIMITS.maxFileSize) {
        onUploadError?.(`File ${file.name} exceeds size limit of ${UPLOAD_LIMITS.maxFileSize / (1024 * 1024)}MB`);
        return;
      }

      if (!UPLOAD_LIMITS.allowedTypes.includes(file.type)) {
        onUploadError?.(`File type ${file.type} is not allowed for ${file.name}`);
        return;
      }
    }

    setSelectedFiles(multiple ? files : [files[0]]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const results = await uploadFiles(selectedFiles, category, userId);
      setUploadedFiles(prev => [...prev, ...results]);
      setSelectedFiles([]);
      onUploadComplete?.(results);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      onUploadError?.(errorMessage);
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon color="primary" />;
    }
    return <FileIcon color="action" />;
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      </Box>

      {/* File Input */}
      <Box sx={{ mb: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled || isUploading}
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          fullWidth
        >
          Choose Files
        </Button>
      </Box>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files:
          </Typography>
          <List dense>
            {selectedFiles.map((file, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveSelectedFile(index)}
                    disabled={isUploading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading}
            fullWidth
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </Box>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {uploadProgress}% uploaded
          </Typography>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Files:
          </Typography>
          <List dense>
            {uploadedFiles.map((file, index) => (
              <ListItem key={file.fileId} divider>
                {getFileIcon(file.fileName)}
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{file.fileName.split('/').pop()}</Typography>
                      <Chip
                        label="Uploaded"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={`${formatFileSize(file.size)} • ${file.uploadedAt.toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveUploadedFile(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};