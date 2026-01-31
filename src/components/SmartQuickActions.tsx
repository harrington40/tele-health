import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Collapse,
  LinearProgress,
  Badge,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  PersonAdd,
  Notifications,
  Schedule,
  PriorityHigh,
  Queue,
  Speed,
  SelfImprovement,
  Campaign,
  SmartToy,
  AccessTime,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { SmartQuickActionsService, QuickAction, SmartContext } from '../services/smartQuickActions';

interface SmartQuickActionsProps {
  waitingRoomCount: number;
  urgentPatients: number;
  todaysAppointments: number;
  completedToday: number;
  averageConsultationTime: number;
  onActionExecute?: (action: QuickAction) => void;
}

const SmartQuickActions: React.FC<SmartQuickActionsProps> = ({
  waitingRoomCount,
  urgentPatients,
  todaysAppointments,
  completedToday,
  averageConsultationTime,
  onActionExecute,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [smartActions, setSmartActions] = useState<QuickAction[]>([]);
  const [context, setContext] = useState<SmartContext | null>(null);
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const quickActionsService = SmartQuickActionsService.getInstance();

  useEffect(() => {
    const currentTime = new Date();
    const smartContext: SmartContext = {
      currentTime,
      waitingRoomCount,
      urgentPatients,
      todaysAppointments,
      completedToday,
      averageConsultationTime,
      workloadLevel: 'medium',
      timeOfDay: quickActionsService.getTimeOfDay(currentTime),
    };

    const analyzedContext = quickActionsService.analyzeWorkloadLevel(smartContext);
    setContext(analyzedContext);

    const actions = quickActionsService.generateSmartActions(analyzedContext);
    setSmartActions(actions);
  }, [waitingRoomCount, urgentPatients, todaysAppointments, completedToday, averageConsultationTime]);

  const handleActionClick = async (action: QuickAction) => {
    setExecutingAction(action.id);

    try {
      // Simulate action execution time
      await new Promise(resolve => setTimeout(resolve, action.estimatedTime * 100));

      action.action();
      onActionExecute?.(action);
    } catch (error) {
      console.error('Action execution failed:', error);
    } finally {
      setExecutingAction(null);
    }
  };

  const getActionIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      person_add: <PersonAdd />,
      campaign: <Campaign />,
      schedule: <Schedule />,
      emergency: <PriorityHigh />,
      queue: <Queue />,
      speed: <Speed />,
      self_improvement: <SelfImprovement />,
      notifications: <Notifications />,
      group_add: <PersonAdd />,
    };
    return iconMap[iconName] || <SmartToy />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return '#d32f2f';
      case 'patient': return '#1976d2';
      case 'schedule': return '#388e3c';
      case 'communication': return '#f57c00';
      default: return '#757575';
    }
  };

  const topActions = smartActions.slice(0, 3);
  const remainingActions = smartActions.slice(3);

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Smart Quick Actions
            </Typography>
            {context && (
              <Chip
                size="small"
                label={`${context.workloadLevel.toUpperCase()} WORKLOAD`}
                color={context.workloadLevel === 'overloaded' ? 'error' : context.workloadLevel === 'high' ? 'warning' : 'success'}
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Top Priority Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {topActions.map((action) => (
            <Box
              key={action.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: action.priority === 'high' ? 'error.light' : 'divider',
                backgroundColor: action.priority === 'high' ? 'error.50' : 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: getCategoryColor(action.category),
                  mr: 2,
                  width: 32,
                  height: 32,
                }}
              >
                {getActionIcon(action.icon)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {action.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={action.priority.toUpperCase()}
                    color={getPriorityColor(action.priority) as any}
                    sx={{ fontSize: '0.6rem', height: 18 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {action.smartScore}% match
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {action.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    ~{action.estimatedTime} min
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="small"
                onClick={() => handleActionClick(action)}
                disabled={executingAction === action.id}
                sx={{
                  minWidth: 80,
                  borderRadius: 2,
                }}
              >
                {executingAction === action.id ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption">Running</Typography>
                    <LinearProgress sx={{ width: 20, height: 4 }} />
                  </Box>
                ) : (
                  'Execute'
                )}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Expandable Additional Actions */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Additional Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
              {remainingActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outlined"
                  startIcon={getActionIcon(action.icon)}
                  onClick={() => handleActionClick(action)}
                  disabled={executingAction === action.id}
                  sx={{
                    justifyContent: 'flex-start',
                    p: 1.5,
                    borderRadius: 2,
                    textAlign: 'left',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.5,
                    '&:hover': {
                      boxShadow: 1,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ flex: 1 }}>
                      {action.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${action.smartScore}%`}
                      color="primary"
                      sx={{ fontSize: '0.6rem', height: 16 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {action.description}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
        </Collapse>

        {/* Smart Insights */}
        {context && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 16 }} />
              Smart Insights
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={`Workload: ${context.workloadLevel}`}
                color={context.workloadLevel === 'overloaded' ? 'error' : context.workloadLevel === 'high' ? 'warning' : 'success'}
              />
              <Chip
                size="small"
                label={`Time: ${context.timeOfDay}`}
                color="info"
              />
              <Chip
                size="small"
                label={`${smartActions.length} actions available`}
                color="primary"
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartQuickActions;