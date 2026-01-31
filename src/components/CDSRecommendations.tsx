import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Collapse,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Avatar,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Warning,
  Info,
  Error,
  CheckCircle,
  MedicalServices,
  Science,
  LocalHospital,
  Psychology,
  ThumbUp,
  ThumbDown,
  Close,
  Lightbulb,
  Assignment,
  Timeline,
} from '@mui/icons-material';
import { CDSRecommendation, CDSKnowledgeSource } from '../types';
import { OpenCDSEngine } from '../services/openCDS.service';

interface CDSRecommendationsProps {
  recommendations: CDSRecommendation[];
  onAcceptRecommendation?: (recommendation: CDSRecommendation) => void;
  onRejectRecommendation?: (recommendation: CDSRecommendation) => void;
  onAcknowledgeRecommendation?: (recommendation: CDSRecommendation) => void;
  onViewDetails?: (recommendation: CDSRecommendation) => void;
}

const CDSRecommendations: React.FC<CDSRecommendationsProps> = ({
  recommendations,
  onAcceptRecommendation,
  onRejectRecommendation,
  onAcknowledgeRecommendation,
  onViewDetails,
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<CDSRecommendation | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<CDSKnowledgeSource[]>([]);

  const cdsEngine = OpenCDSEngine.getInstance();

  useEffect(() => {
    setKnowledgeSources(cdsEngine.getKnowledgeSources());
  }, []);

  const handleExpandCard = (recommendationId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(recommendationId)) {
      newExpanded.delete(recommendationId);
    } else {
      newExpanded.add(recommendationId);
    }
    setExpandedCards(newExpanded);
  };

  const handleViewDetails = (recommendation: CDSRecommendation) => {
    setSelectedRecommendation(recommendation);
    setDetailsDialogOpen(true);
    onViewDetails?.(recommendation);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return <MedicalServices />;
      case 'diagnostic':
        return <Science />;
      case 'preventive':
        return <LocalHospital />;
      case 'monitoring':
        return <Timeline />;
      case 'alert':
        return <Warning />;
      default:
        return <Lightbulb />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  const getRelevantSources = (sourceIds: string[]) => {
    return knowledgeSources.filter(source => sourceIds.includes(source.id));
  };

  if (recommendations.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Lightbulb sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No Clinical Decision Support Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The system will provide recommendations when relevant clinical conditions are detected.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Clinical Decision Support ({recommendations.length})
            </Typography>
          </Box>

          <List>
            {recommendations.map((recommendation, index) => (
              <React.Fragment key={recommendation.id}>
                <ListItem
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: recommendation.status === 'pending' ? 'action.hover' : 'background.paper',
                  }}
                >
                  <ListItemIcon>
                    <Badge
                      color={getPriorityColor(recommendation.priority) as any}
                      variant="dot"
                      invisible={recommendation.priority === 'low'}
                    >
                      <Avatar sx={{ bgcolor: `${getSeverityColor(recommendation.severity)}.main` }}>
                        {getCategoryIcon(recommendation.category)}
                      </Avatar>
                    </Badge>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {recommendation.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={recommendation.priority.toUpperCase()}
                          color={getPriorityColor(recommendation.priority) as any}
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip
                          size="small"
                          label={formatConfidence(recommendation.confidence)}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {recommendation.description}
                      </Typography>
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {recommendation.status === 'pending' && (
                      <>
                        <Tooltip title="Accept Recommendation">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => onAcceptRecommendation?.(recommendation)}
                          >
                            <ThumbUp />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Recommendation">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onRejectRecommendation?.(recommendation)}
                          >
                            <ThumbDown />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(recommendation)}
                      >
                        <Assignment />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandCard(recommendation.id)}
                    >
                      {expandedCards.has(recommendation.id) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </ListItem>

                <Collapse in={expandedCards.has(recommendation.id)}>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Alert
                      severity={getSeverityColor(recommendation.severity) as any}
                      sx={{ mb: 2 }}
                      icon={getSeverityIcon(recommendation.severity)}
                    >
                      <Typography variant="body2">
                        <strong>Supporting Evidence:</strong> {recommendation.supportingEvidence}
                      </Typography>
                    </Alert>

                    {recommendation.suggestedActions.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Suggested Actions:
                        </Typography>
                        {recommendation.suggestedActions.map((action, idx) => (
                          <Chip
                            key={idx}
                            label={action}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}

                    {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Alternatives:
                        </Typography>
                        {recommendation.alternatives.map((alt, idx) => (
                          <Chip
                            key={idx}
                            label={alt}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}

                    {recommendation.contraindications && recommendation.contraindications.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Contraindications:
                        </Typography>
                        <Typography variant="body2">
                          {recommendation.contraindications.join(', ')}
                        </Typography>
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Generated: {new Date(recommendation.timestamp).toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {getRelevantSources(recommendation.knowledgeSources).map(source => (
                          <Tooltip key={source.id} title={`${source.name} (${source.credibility} credibility)`}>
                            <Chip
                              size="small"
                              label={source.name}
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Collapse>

                {index < recommendations.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedRecommendation && getSeverityIcon(selectedRecommendation.severity)}
            {selectedRecommendation?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecommendation && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedRecommendation.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={`Priority: ${selectedRecommendation.priority}`} />
                <Chip label={`Category: ${selectedRecommendation.category}`} />
                <Chip label={`Confidence: ${formatConfidence(selectedRecommendation.confidence)}`} />
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Supporting Evidence
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedRecommendation.supportingEvidence}
              </Typography>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Knowledge Sources
              </Typography>
              <Box sx={{ mb: 2 }}>
                {getRelevantSources(selectedRecommendation.knowledgeSources).map(source => (
                  <Box key={source.id} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">{source.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {source.description} • Last updated: {source.lastUpdated}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Triggered Conditions
              </Typography>
              <List dense>
                {selectedRecommendation.triggeredConditions.map((condition, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={`${condition.type}: ${condition.operator} ${condition.value}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedRecommendation?.status === 'pending' && (
            <>
              <Button
                color="error"
                onClick={() => {
                  onRejectRecommendation?.(selectedRecommendation);
                  setDetailsDialogOpen(false);
                }}
              >
                Reject
              </Button>
              <Button
                color="success"
                onClick={() => {
                  onAcceptRecommendation?.(selectedRecommendation);
                  setDetailsDialogOpen(false);
                }}
              >
                Accept
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CDSRecommendations;