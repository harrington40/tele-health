import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Avatar,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Share,
  Launch,
  ContentCopy,
  WhatsApp,
  LinkedIn,
  YouTube,
  Telegram,
  Close,
  Send,
  TrendingUp,
  Favorite,
  Comment,
  Visibility,
  Group,
  Schedule
} from '@mui/icons-material';

// TikTok icon component since it's not in Material-UI
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <svg 
    viewBox="0 0 24 24" 
    style={{ width: 24, height: 24, ...sx }}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04 0z"/>
  </svg>
);

interface SocialMediaProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  showFollowButtons?: boolean;
  showShareButton?: boolean;
  currentUrl?: string;
}

const SocialMediaIntegration: React.FC<SocialMediaProps> = ({
  variant = 'horizontal',
  showFollowButtons = true,
  showShareButton = true,
  currentUrl = window.location.href
}) => {
  const [shareDialog, setShareDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [feedbackText, setFeedbackText] = useState('');

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook />,
      color: '#1877F2',
      url: 'https://facebook.com/telehealthportal',
      followers: '25.4K',
      description: 'Health tips, patient stories, and wellness content',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
      url: 'https://twitter.com/telehealthportal',
      followers: '18.7K',
      description: 'Latest healthcare news and quick health tips',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20out%20this%20amazing%20telehealth%20platform!`
    },
    {
      name: 'Instagram',
      icon: <Instagram />,
      color: '#E4405F',
      url: 'https://instagram.com/telehealthportal',
      followers: '32.1K',
      description: 'Visual health education and behind-the-scenes content',
      shareUrl: `https://www.instagram.com/`
    },
    {
      name: 'TikTok',
      icon: <TikTokIcon />,
      color: '#000000',
      url: 'https://tiktok.com/@telehealthportal',
      followers: '45.8K',
      description: 'Fun health education videos and doctor Q&As',
      shareUrl: 'https://www.tiktok.com/'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0A66C2',
      url: 'https://linkedin.com/company/telehealthportal',
      followers: '12.3K',
      description: 'Professional healthcare insights and industry news',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'YouTube',
      icon: <YouTube />,
      color: '#FF0000',
      url: 'https://youtube.com/@telehealthportal',
      followers: '89.2K',
      description: 'Educational videos and virtual consultations',
      shareUrl: 'https://www.youtube.com/'
    }
  ];

  const handlePlatformClick = (platform: any) => {
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (platform: any) => {
    if (platform.shareUrl) {
      window.open(platform.shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Link copied to clipboard!' });
    });
  };

  const handleFeedbackSubmit = () => {
    // In a real app, this would send feedback to your backend
    setSnackbar({ open: true, message: 'Thank you for your feedback!' });
    setFeedbackDialog(false);
    setFeedbackText('');
  };

  if (variant === 'grid') {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Follow Us on Social Media
        </Typography>
        <Grid container spacing={2}>
          {socialPlatforms.map((platform) => (
            <Grid item xs={12} sm={6} md={4} key={platform.name}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handlePlatformClick(platform)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: platform.color, mr: 2 }}>
                      {platform.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{platform.name}</Typography>
                      <Chip 
                        label={`${platform.followers} followers`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {platform.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (variant === 'vertical') {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Connect With Us
        </Typography>
        <List>
          {socialPlatforms.map((platform, index) => (
            <React.Fragment key={platform.name}>
              <ListItem
                button
                onClick={() => handlePlatformClick(platform)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: platform.color, width: 40, height: 40 }}>
                    {platform.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{platform.name}</Typography>
                      <Chip 
                        label={platform.followers}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={platform.description}
                />
                <IconButton size="small" color="primary">
                  <Launch />
                </IconButton>
              </ListItem>
              {index < socialPlatforms.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  }

  // Default horizontal variant
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {showFollowButtons && (
          <>
            <Typography variant="body2" color="text.secondary">
              Follow us:
            </Typography>
            {socialPlatforms.map((platform) => (
              <Tooltip key={platform.name} title={`Follow us on ${platform.name}`}>
                <IconButton
                  onClick={() => handlePlatformClick(platform)}
                  sx={{
                    color: platform.color,
                    '&:hover': {
                      bgcolor: platform.color,
                      color: 'white',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  {platform.icon}
                </IconButton>
              </Tooltip>
            ))}
          </>
        )}

        {showShareButton && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={() => setShareDialog(true)}
              size="small"
            >
              Share
            </Button>
          </>
        )}

        <Button
          variant="text"
          size="small"
          onClick={() => setFeedbackDialog(true)}
          startIcon={<Comment />}
        >
          Feedback
        </Button>
      </Box>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog}
        onClose={() => setShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Share Telehealth Portal
          <IconButton
            onClick={() => setShareDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Help others discover quality telehealth services!
          </Typography>
          
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                value={currentUrl}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
              <IconButton
                onClick={() => copyToClipboard(currentUrl)}
                color="primary"
              >
                <ContentCopy />
              </IconButton>
            </Box>
          </Paper>

          <Typography variant="subtitle1" gutterBottom>
            Share on social media:
          </Typography>
          <Grid container spacing={2}>
            {socialPlatforms.slice(0, 4).map((platform) => (
              <Grid item xs={6} key={platform.name}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={platform.icon}
                  onClick={() => handleShare(platform)}
                  sx={{
                    color: platform.color,
                    borderColor: platform.color,
                    '&:hover': {
                      bgcolor: platform.color,
                      color: 'white'
                    }
                  }}
                >
                  {platform.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              <TrendingUp sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              Join over 150,000+ users who trust Telehealth Portal for their healthcare needs!
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialog}
        onClose={() => setFeedbackDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Share Your Feedback
          <IconButton
            onClick={() => setFeedbackDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            We'd love to hear about your experience with our platform!
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us what you think about our telehealth services..."
            variant="outlined"
            sx={{ mt: 2 }}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Your feedback helps us improve our services and better serve our community.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFeedbackSubmit}
            disabled={!feedbackText.trim()}
            startIcon={<Send />}
          >
            Send Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

// Social Media Stats Component
export const SocialMediaStats: React.FC = () => {
  const stats = [
    { platform: 'Facebook', icon: <Facebook />, followers: '25.4K', engagement: '8.2%', color: '#1877F2' },
    { platform: 'Instagram', icon: <Instagram />, followers: '32.1K', engagement: '12.1%', color: '#E4405F' },
    { platform: 'TikTok', icon: <TikTokIcon />, followers: '45.8K', engagement: '15.7%', color: '#000000' },
    { platform: 'Twitter', icon: <Twitter />, followers: '18.7K', engagement: '6.3%', color: '#1DA1F2' }
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid item xs={6} sm={3} key={stat.platform}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: stat.color, mx: 'auto', mb: 1 }}>
              {stat.icon}
            </Avatar>
            <Typography variant="h6">{stat.followers}</Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.platform}
            </Typography>
            <Chip 
              label={`${stat.engagement} engagement`}
              size="small"
              color="success"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SocialMediaIntegration;