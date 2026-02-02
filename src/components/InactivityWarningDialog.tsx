import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Timer, Warning } from '@mui/icons-material';

interface InactivityWarningDialogProps {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
  onDismiss?: () => void; // Optional dismiss handler
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
}

const InactivityWarningDialog: React.FC<InactivityWarningDialogProps> = ({
  open,
  onExtend,
  onLogout,
  onDismiss,
  timeRemaining,
  totalTime,
}) => {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - countdown) / totalTime) * 100;

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        <Typography variant="h6" component="div">
          Session Timeout Warning
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You have been inactive for a while. Your session will expire in{' '}
              <strong>{formatTime(countdown)}</strong> for security reasons.
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To continue using the application, please click "Stay Logged In".
            Otherwise, you will be automatically logged out.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Timer fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Time remaining: {formatTime(countdown)}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={countdown < 30 ? "error" : "warning"}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onLogout}
          color="error"
          variant="outlined"
        >
          Logout Now
        </Button>
        {onDismiss && (
          <Button
            onClick={onDismiss}
            color="inherit"
            variant="text"
          >
            Dismiss
          </Button>
        )}
        <Button
          onClick={onExtend}
          color="primary"
          variant="contained"
          autoFocus
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityWarningDialog;