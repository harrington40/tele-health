import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  MonitorHeart,
  FitnessCenter,
  Restaurant,
  Thermostat,
  MoreVert
} from '@mui/icons-material';
import { HealthMetric } from '../../types';

interface HealthMetricCardProps {
  metric: HealthMetric;
  trend?: 'up' | 'down' | 'stable';
  target?: { min: number; max: number };
  showTrend?: boolean;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  metric,
  trend = 'stable',
  target,
  showTrend = true
}) => {
  const theme = useTheme();

  const getMetricIcon = (type: string) => {
    const icons = {
      'blood-pressure': <MonitorHeart />,
      'weight': <FitnessCenter />,
      'heart-rate': <MonitorHeart />,
      'temperature': <Thermostat />,
      'blood-sugar': <Restaurant />,
      'oxygen-saturation': <MonitorHeart />
    };
    return icons[type as keyof typeof icons] || <Timeline />;
  };

  const getTrendIcon = (trendType: string) => {
    switch (trendType) {
      case 'up':
        return <TrendingUp color="error" />;
      case 'down':
        return <TrendingDown color="success" />;
      default:
        return <Timeline color="primary" />;
    }
  };

  const getTrendColor = (trendType: string) => {
    switch (trendType) {
      case 'up':
        return metric.type === 'weight' || metric.type === 'blood-pressure' ? 'error' : 'success';
      case 'down':
        return metric.type === 'weight' || metric.type === 'blood-pressure' ? 'success' : 'error';
      default:
        return 'primary';
    }
  };

  const getMetricStatus = () => {
    if (!target || typeof metric.value !== 'number') return 'normal';
    
    if (metric.value < target.min) return 'low';
    if (metric.value > target.max) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'error';
      case 'low':
        return 'warning';
      default:
        return 'success';
    }
  };

  const formatMetricName = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const status = getMetricStatus();

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette[getStatusColor(status)].main}20`,
        borderLeft: `4px solid ${theme.palette[getStatusColor(status)].main}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                backgroundColor: `${theme.palette[getStatusColor(status)].main}15`,
                color: `${theme.palette[getStatusColor(status)].main}`
              }}
            >
              {getMetricIcon(metric.type)}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {formatMetricName(metric.type)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(metric.date)}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="More options">
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {metric.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {metric.unit}
          </Typography>
        </Box>

        {target && typeof metric.value === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Target Range: {target.min} - {target.max} {metric.unit}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, ((metric.value - target.min) / (target.max - target.min)) * 100))}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: theme.palette[getStatusColor(status)].main
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={status}
            color={getStatusColor(status)}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
          
          {showTrend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getTrendIcon(trend)}
              <Typography variant="caption" color={`${getTrendColor(trend)}.main`}>
                {trend === 'stable' ? 'Stable' : trend === 'up' ? 'Rising' : 'Falling'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={metric.source}
            size="small"
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
          {metric.source === 'device' && (
            <Chip
              label="Auto-sync"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

interface HealthMetricsGridProps {
  metrics: HealthMetric[];
  trends: { [key: string]: 'up' | 'down' | 'stable' };
  targets?: { [key: string]: { min: number; max: number } };
}

export const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({
  metrics,
  trends,
  targets = {}
}) => {
  // Get the latest metric for each type
  const latestMetrics = metrics.reduce((acc, metric) => {
    const existing = acc[metric.type];
    if (!existing || new Date(metric.date) > new Date(existing.date)) {
      acc[metric.type] = metric;
    }
    return acc;
  }, {} as { [key: string]: HealthMetric });

  const defaultTargets = {
    'blood-pressure': { min: 90, max: 120 }, // Systolic
    'heart-rate': { min: 60, max: 100 },
    'weight': { min: 140, max: 180 },
    'blood-sugar': { min: 70, max: 140 },
    'temperature': { min: 97, max: 99 },
    'oxygen-saturation': { min: 95, max: 100 }
  };

  return (
    <Grid container spacing={3}>
      {Object.values(latestMetrics).map((metric) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={metric.id}>
          <HealthMetricCard
            metric={metric}
            trend={trends[metric.type]}
            target={targets[metric.type] || defaultTargets[metric.type as keyof typeof defaultTargets]}
            showTrend={true}
          />
        </Grid>
      ))}
    </Grid>
  );
};