import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Rating,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  Fade,
  useTheme
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  VideoCall,
  LocationOn,
  Star,
  TrendingUp,
  AutoAwesome,
  CheckCircle,
  Bolt,
  Psychology,
  LocalHospital,
  MonetizationOn,
  Schedule
} from '@mui/icons-material';
import { TimeSlot, Doctor } from '../../types';

interface SmartSlotCardProps {
  slot: TimeSlot;
  doctor: Doctor;
  isSelected: boolean;
  isRecommended: boolean;
  confidence?: number;
  onSelect: (slot: TimeSlot) => void;
}

export const SmartSlotCard: React.FC<SmartSlotCardProps> = ({
  slot,
  doctor,
  isSelected,
  isRecommended,
  confidence,
  onSelect
}) => {
  const theme = useTheme();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyColor = () => {
    const today = new Date();
    const slotDate = new Date(slot.date);
    const daysDiff = Math.ceil((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return 'error';
    if (daysDiff <= 3) return 'warning';
    return 'success';
  };

  return (
    <Fade in={true} timeout={500}>
      <Card
        sx={{
          cursor: 'pointer',
          position: 'relative',
          border: isSelected ? '3px solid' : '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isSelected 
            ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)'
            : 'background.paper',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            '& .smart-features': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          overflow: 'visible'
        }}
        onClick={() => onSelect(slot)}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: 16,
              zIndex: 2
            }}
          >
            <Chip
              label="🎯 Best Match"
              color="primary"
              size="small"
              icon={<AutoAwesome />}
              sx={{
                fontWeight: 'bold',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            />
          </Box>
        )}

        {/* Availability Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: slot.available ? 'success.main' : 'error.main',
            boxShadow: `0 0 0 3px ${slot.available ? theme.palette.success.light : theme.palette.error.light}40`,
            animation: slot.available ? 'pulse 2s infinite' : 'none'
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Doctor Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={doctor.image}
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                border: `3px solid ${theme.palette.primary.light}20`
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {doctor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {doctor.specialty} • {doctor.experience} years
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={doctor.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {doctor.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({doctor.reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Time and Date Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  textAlign: 'center'
                }}
              >
                <CalendarToday color="primary" sx={{ mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {formatDate(slot.date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  textAlign: 'center'
                }}
              >
                <AccessTime color="primary" sx={{ mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {formatTime(slot.time)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Features and Benefits */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<VideoCall />}
                label="Video Call"
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Schedule />}
                label={`${slot.duration} min`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<Bolt />}
                label="Instant Join"
                size="small"
                color={getUrgencyColor()}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Smart Features (Hidden until hover) */}
          <Box
            className="smart-features"
            sx={{
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
              mb: 2
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
              🤖 AI Insights:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {isRecommended && (
                <Chip label="Perfect time match" size="small" color="success" variant="outlined" />
              )}
              {doctor.rating >= 4.8 && (
                <Chip label="Top rated" size="small" color="primary" variant="outlined" />
              )}
              {confidence && confidence > 85 && (
                <Chip label="High confidence" size="small" color="info" variant="outlined" />
              )}
            </Box>
          </Box>

          {/* Confidence Score */}
          {confidence && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Match Confidence
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {confidence.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={confidence}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: confidence > 80 
                      ? 'linear-gradient(90deg, #4caf50, #8bc34a)'
                      : confidence > 60
                      ? 'linear-gradient(90deg, #ff9800, #ffc107)'
                      : 'linear-gradient(90deg, #f44336, #ff5722)'
                  }
                }}
              />
            </Box>
          )}

          {/* Price and Action */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MonetizationOn color="success" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                ${slot.price}
              </Typography>
            </Box>
            
            <Button
              variant={isSelected ? "contained" : "outlined"}
              size="small"
              startIcon={isSelected ? <CheckCircle /> : <Star />}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                ...(isSelected && {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                })
              }}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

interface ConfidenceIndicatorProps {
  confidence: number;
  reasons: string[];
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  reasons
}) => {
  const getConfidenceColor = () => {
    if (confidence >= 85) return 'success';
    if (confidence >= 70) return 'warning';
    return 'error';
  };

  const getConfidenceIcon = () => {
    if (confidence >= 85) return <CheckCircle />;
    if (confidence >= 70) return <AutoAwesome />;
    return <Psychology />;
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${
          confidence >= 85 ? '#e8f5e8' : confidence >= 70 ? '#fff3e0' : '#ffebee'
        } 0%, rgba(255,255,255,0.8) 100%)`,
        border: '1px solid',
        borderColor: `${getConfidenceColor()}.light`,
        borderRadius: 3
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getConfidenceIcon()}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
            AI Confidence: {confidence.toFixed(1)}%
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Our smart algorithm analyzed your preferences and found these insights:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {reasons.map((reason, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star color="primary" fontSize="small" />
              <Typography variant="body2">{reason}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};