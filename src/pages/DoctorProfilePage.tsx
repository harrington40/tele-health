import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  VideoCall,
  Schedule,
  LocationOn,
  School,
  WorkHistory,
  Star,
  Language,
  VerifiedUser,
  CalendarToday,
  AccessTime,
  Phone,
  Email,
  CheckCircle,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Mock doctor data - in real app, fetch based on ID
  const doctor = {
    id: parseInt(id || '1'),
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.9,
    reviews: 124,
    price: 34,
    availability: 'Available Today',
    image: '/api/placeholder/200/200',
    location: 'Online',
    isOnline: true,
    bio: 'Dr. Sarah Johnson is a board-certified family medicine physician with over 12 years of experience in primary care. She specializes in preventive medicine, chronic disease management, and comprehensive family healthcare. Dr. Johnson is passionate about building long-term relationships with her patients and providing personalized care that addresses both physical and emotional well-being.',
    education: [
      'MD - Harvard Medical School (2012)',
      'Residency - Massachusetts General Hospital (2015)',
      'Fellowship - Preventive Medicine, Johns Hopkins (2016)',
    ],
    experience: 12,
    languages: ['English', 'Spanish', 'French'],
    certifications: [
      'Board Certified in Family Medicine',
      'Advanced Cardiac Life Support (ACLS)',
      'Basic Life Support (BLS)',
      'Certified in Telehealth',
    ],
    workingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed',
    },
    services: [
      'Annual Physical Exams',
      'Chronic Disease Management',
      'Preventive Care',
      'Mental Health Screening',
      'Prescription Refills',
      'Urgent Care Consultations',
    ],
    patientReviews: [
      {
        id: 1,
        patientName: 'Emily R.',
        rating: 5,
        comment: 'Dr. Johnson is exceptional! She took the time to listen to all my concerns and provided thorough explanations. Highly recommend!',
        date: '2024-03-15',
      },
      {
        id: 2,
        patientName: 'Michael K.',
        rating: 5,
        comment: 'Professional, knowledgeable, and caring. The video consultation was seamless and convenient.',
        date: '2024-03-10',
      },
      {
        id: 3,
        patientName: 'Jessica M.',
        rating: 4,
        comment: 'Great experience overall. Dr. Johnson was very thorough and helped me understand my condition better.',
        date: '2024-03-08',
      },
    ],
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBookAppointment = () => {
    setBookingDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }} className="profile-header">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              {doctor.isOnline && (
                <Chip
                  label="Available Online"
                  color="success"
                  icon={<CheckCircle />}
                  sx={{ mb: 1 }}
                  className="availability-chip"
                />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {doctor.name}
            </Typography>
            <Typography variant="h6" color="primary.main" gutterBottom>
              {doctor.specialty}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={doctor.rating} readOnly precision={0.1} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {doctor.rating} ({doctor.patientReviews.length} reviews)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip icon={<WorkHistory />} label={`${doctor.experience} years experience`} />
              <Chip icon={<VerifiedUser />} label="Board Certified" />
              <Chip icon={<Language />} label={`${doctor.languages.length} languages`} />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{doctor.location}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">{doctor.availability}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                ${doctor.price}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                per consultation
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<VideoCall />}
                fullWidth
                sx={{ mb: 2 }}
                onClick={handleBookAppointment}
              >
                Book Video Call
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                fullWidth
              >
                Call Now
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper elevation={2}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="About" />
          <Tab label="Experience & Education" />
          <Tab label="Services" />
          <Tab label="Reviews" />
          <Tab label="Availability" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            About Dr. {doctor.name.split(' ').pop()}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {doctor.bio}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Languages
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {doctor.languages.map((language) => (
              <Chip key={language} label={language} variant="outlined" />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <List>
            {doctor.education.map((edu, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <School color="primary" />
                </ListItemIcon>
                <ListItemText primary={edu} />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          <List>
            {doctor.certifications.map((cert, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <VerifiedUser color="success" />
                </ListItemIcon>
                <ListItemText primary={cert} />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Services Offered
          </Typography>
          <Grid container spacing={2}>
            {doctor.services.map((service, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">{service}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Patient Reviews
          </Typography>
          <Grid container spacing={3}>
            {doctor.patientReviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.patientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2">{review.comment}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Working Hours
          </Typography>
          <List>
            {Object.entries(doctor.workingHours).map(([day, hours]) => (
              <ListItem key={day}>
                <ListItemIcon>
                  <AccessTime color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={day.charAt(0).toUpperCase() + day.slice(1)}
                  secondary={hours}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Ready to book your consultation? You'll be redirected to our booking system to select your preferred time slot.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Consultation Details:
            </Typography>
            <Typography variant="body2">• Video consultation: ${doctor.price}</Typography>
            <Typography variant="body2">• Duration: 30 minutes</Typography>
            <Typography variant="body2">• Available today</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setBookingDialogOpen(false);
              navigate('/booking', { state: { doctorId: doctor.id } });
            }}
          >
            Continue to Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorProfilePage;