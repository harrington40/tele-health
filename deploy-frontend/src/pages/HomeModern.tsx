
import React, { useState } from 'react';
import Navbar from '../components/Layout/NavbarModern';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Button,
  Chip,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { CalendarToday, LocalHospital, Person, AccessTime, CheckCircle, VideoCall, Psychology, Replay } from '@mui/icons-material';
// @ts-ignore
import { motion } from 'framer-motion';


const steps = [
  { label: 'Select Service', icon: <LocalHospital /> },
  { label: 'Choose Doctor', icon: <Person /> },
  { label: 'Pick Time', icon: <AccessTime /> },
  { label: 'Confirm', icon: <CheckCircle /> }
];

const serviceData = [
  {
    id: 1,
    name: 'General Consultation',
    description: 'Comprehensive consult with a physician.',
    duration: '30 min',
    price: 75,
    icon: '🩺',
    online: true
  },
  {
    id: 2,
    name: 'Specialist',
    description: 'Consultation with a medical specialist.',
    duration: '45 min',
    price: 120,
    icon: '👨‍⚕️',
    online: true
  },
  {
    id: 3,
    name: 'Mental Health',
    description: 'Professional mental health counseling.',
    duration: '50 min',
    price: 90,
    icon: '🧠',
    online: true
  },
  {
    id: 4,
    name: 'Follow-up',
    description: 'Follow-up consultation for ongoing treatment.',
    duration: '20 min',
    price: 50,
    icon: '🔁',
    online: true
  }
];

interface GlassCardProps {
  $selected: boolean;
}
const GlassCard = styled(motion.div)<GlassCardProps>(({ theme, $selected }) => ({
  background: 'rgba(255,255,255,0.7)',
  boxShadow: $selected
    ? '0 8px 32px 0 rgba(14,165,165,0.25), 0 4px 20px rgba(25,118,210,0.15)'
    : '0 4px 20px rgba(0,0,0,0.05)',
  borderRadius: 16,
  border: $selected ? '2px solid #0ea5a5' : '1px solid #e0e0e0',
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  position: 'relative',
  cursor: 'pointer',
  overflow: 'hidden',
  minWidth: 260,
  maxWidth: 320,
  margin: '0 auto',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 32px 0 rgba(25,118,210,0.15), 0 4px 20px rgba(14,165,165,0.15)'
  },
  ...($selected && {
    animation: 'pulse 1.2s infinite',
    '@keyframes pulse': {
      '0%': { boxShadow: '0 0 0 0 rgba(14,165,165,0.3)' },
      '70%': { boxShadow: '0 0 0 10px rgba(14,165,165,0)' },
      '100%': { boxShadow: '0 0 0 0 rgba(14,165,165,0)' }
    }
  })
}));

const PillBadge = styled('span')(() => ({
  background: '#e0f7f6',
  color: '#0ea5a5',
  borderRadius: 12,
  padding: '4px 10px',
  fontWeight: 500,
  fontSize: 13,
  marginLeft: 8
}));

const GradientButton = styled(Button)(() => ({
  background: 'linear-gradient(90deg, #1976d2 0%, #0ea5a5 100%)',
  color: '#fff',
  borderRadius: 10,
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
  '&:hover': {
    background: 'linear-gradient(90deg, #0ea5a5 0%, #1976d2 100%)',
    opacity: 0.95
  },
  '&.Mui-disabled': {
    opacity: 0.5
  }
}));

const OutlinedButton = styled(Button)(() => ({
  border: '1px solid #ddd',
  color: '#666',
  background: 'transparent',
  borderRadius: 10,
  fontWeight: 500,
  '&:hover': {
    background: '#f5f5f5'
  }
}));

const HomeModern: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // For mobile carousel scroll
  const serviceGridStyle = isMobile
    ? { display: 'flex', overflowX: 'auto', columnGap: 20, paddingBottom: 16 } as React.CSSProperties
    : { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 32 } as React.CSSProperties;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #E8F7F5 0%, #FFFFFF 100%)' }}>
      <Navbar />
      <main style={{ paddingTop: 32, maxWidth: 1200, margin: '0 auto' }}>
        {/* Gradient/Image Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 4 }}>
          <CalendarToday sx={{ color: '#0ea5a5', fontSize: 36 }} />
          <Typography variant="h4" fontWeight={700} color="#1976d2">
            Book Your Appointment
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, ml: 0.5 }}>
          Smart booking with AI-powered recommendations
        </Typography>

        {/* Stepper with Icons */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((step, idx) => (
            <Step key={step.label} completed={activeStep > idx}>
              <StepLabel icon={step.icon} sx={{
                '& .MuiStepIcon-root': {
                  color: activeStep === idx ? '#0ea5a5' : '#b2dfdb',
                  fontSize: 32
                }
              }}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Service Cards Grid */}
        {activeStep === 0 && (
          <Box
            sx={{ mb: 6 }}
            style={serviceGridStyle}
          >
            {serviceData.map((service) => (
              <GlassCard
                key={service.id}
                $selected={selectedService === service.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 120 }}
                onClick={() => setSelectedService(service.id)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
              >
                <CardContent style={{ padding: 28, textAlign: 'left' }}>
                  <Box sx={{ fontSize: 36, mb: 1 }}>{service.icon}</Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 1 }}>
                    {service.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: '#1976d2' }} />
                    <Typography variant="body2">{service.duration}</Typography>
                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 600, color: '#1976d2' }}>
                      ${service.price}
                    </Typography>
                  </Box>
                  {service.online && <PillBadge>Online</PillBadge>}
                </CardContent>
              </GlassCard>
            ))}
          </Box>
        )}

        {/* Step 2–4 placeholders (for demo) */}
        {activeStep > 0 && (
          <Box sx={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bdbdbd', fontSize: 28 }}>
            Coming soon: Step {activeStep + 1}
          </Box>
        )}

        {/* Sticky Button Row */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mt: 6,
          position: isMobile ? 'fixed' : 'static',
          left: 0,
          bottom: isMobile ? 0 : 'auto',
          width: isMobile ? '100vw' : 'auto',
          background: isMobile ? 'rgba(255,255,255,0.95)' : 'none',
          p: isMobile ? 2 : 0,
          zIndex: 10,
          boxShadow: isMobile ? '0 -2px 16px rgba(25,118,210,0.07)' : 'none'
        }}>
          <OutlinedButton
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            sx={{ minWidth: 110 }}
          >
            Back
          </OutlinedButton>
          <GradientButton
            onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={activeStep === 0 && selectedService === null}
            sx={{ minWidth: 120 }}
          >
            {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
          </GradientButton>
        </Box>

        {/* Footer Placeholder */}
        <footer style={{ height: 80, marginTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#607d8b', background: 'linear-gradient(90deg, #1976d2 0%, #0ea5a5 100%)', fontWeight: 500, borderRadius: 16 }}>
          Telehealth Portal © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
};

export default HomeModern;
