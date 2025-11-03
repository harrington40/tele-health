import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Fab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Shield,
  VerifiedUser,
  Security,
  MedicalServices,
  Policy,
  CheckCircle,
  ExpandMore,
  Download,
  Print,
  Share,
  Business,
  LocationOn,
  Update,
  Gavel,
  Assignment,
  Lock,
  VpnKey,
} from '@mui/icons-material';

const HIPAACompliancePage: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>('panel1');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const lastUpdated = 'December 15, 2024';

  const complianceSteps = [
    {
      label: 'Security Risk Assessment',
      description: 'Annual comprehensive security risk analysis of all systems and processes.',
    },
    {
      label: 'Access Controls Implementation',
      description: 'Role-based access controls, unique user IDs, and automatic logoff procedures.',
    },
    {
      label: 'Encryption Standards',
      description: 'End-to-end encryption for all PHI transmission and storage.',
    },
    {
      label: 'Audit Controls & Monitoring',
      description: 'Continuous monitoring, logging, and regular audit reviews.',
    },
    {
      label: 'Incident Response Planning',
      description: 'Comprehensive breach response and notification procedures.',
    },
    {
      label: 'Staff Training & Awareness',
      description: 'Annual HIPAA training for all employees and contractors.',
    },
  ];

  const hipaaSections = [
    {
      id: 'overview',
      title: 'HIPAA Compliance Overview',
      icon: <Shield />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Telehealth Portal is fully committed to HIPAA compliance, implementing comprehensive safeguards to protect patient health information and ensure the privacy and security of all protected health information (PHI).
          </Typography>

          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Fully HIPAA Compliant:</strong> Our platform meets all HIPAA Security Rule, Privacy Rule, and Breach Notification Rule requirements with additional state-specific compliance measures.
            </Typography>
          </Alert>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Privacy Rule</Typography>
                <Typography variant="body2">Patient rights and information usage</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">Security Rule</Typography>
                <Typography variant="body2">Technical safeguards and controls</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Assignment sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Breach Notification</Typography>
                <Typography variant="body2">Incident reporting and response</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'privacy-rule',
      title: 'Privacy Rule Compliance',
      icon: <Policy />,
      color: 'secondary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our Privacy Rule compliance ensures patients have control over their health information:
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Patient Rights Under HIPAA</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Access"
                    secondary="Access and obtain copies of your health records"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Amend"
                    secondary="Request corrections to inaccurate information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Accounting"
                    secondary="Receive reports of disclosures of your PHI"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Request Restrictions"
                    secondary="Request limitations on certain uses and disclosures"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Right to Confidential Communications"
                    secondary="Request alternative means of communication"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Permitted Uses & Disclosures</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Treatment"
                    secondary="PHI used for your care and treatment coordination"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Payment"
                    secondary="Billing and payment processing for services"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Healthcare Operations"
                    secondary="Quality assurance, training, and business management"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Authorization Required"
                    secondary="Marketing, fundraising, and research require consent"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      id: 'security-rule',
      title: 'Security Rule Implementation',
      icon: <Lock />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our comprehensive security measures protect your health information:
          </Typography>

          <Typography variant="h6" gutterBottom>Security Implementation Steps</Typography>
          <Stepper orientation="vertical" sx={{ mb: 3 }}>
            {complianceSteps.map((step, index) => (
              <Step key={step.label} active={true}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2">{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <VpnKey sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">Access Controls</Typography>
                <Typography variant="body2">Multi-factor authentication and role-based access</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Security sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">Encryption</Typography>
                <Typography variant="body2">AES-256 encryption for data at rest and in transit</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <Update sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">Audit Controls</Typography>
                <Typography variant="body2">Comprehensive logging and monitoring systems</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Shield sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">Integrity Controls</Typography>
                <Typography variant="body2">Data integrity and anti-malware protection</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      id: 'breach-notification',
      title: 'Breach Notification Rule',
      icon: <Assignment />,
      color: 'warning',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our breach notification procedures ensure prompt response and reporting:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Breach Response Process</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Immediate Assessment"
                    secondary="Security team assesses potential breach within 24 hours"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Risk Evaluation"
                    secondary="Determine if breach poses significant risk of harm"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Notification Timeline"
                    secondary="Notify affected individuals within 60 days of discovery"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Regulatory Reporting"
                    secondary="Report to HHS Office for Civil Rights as required"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Media Notification"
                    secondary="Notify media outlets for breaches affecting 500+ individuals"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">What We Notify You About</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Nature of Breach"
                    secondary="Description of what happened and what information was compromised"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Affected Information"
                    secondary="Types of PHI involved in the breach"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Protection Steps"
                    secondary="Steps you can take to protect yourself"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contact Information"
                    secondary="How to contact us for more information or assistance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Credit Monitoring"
                    secondary="Free credit monitoring services when applicable"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>No Breaches Reported:</strong> As of our last audit, we have not experienced any breaches requiring notification under HIPAA rules.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      id: 'business-associates',
      title: 'Business Associate Compliance',
      icon: <Business />,
      color: 'info',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We maintain strict business associate agreements with all vendors and partners:
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Business Associate Agreements (BAAs)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Cloud Service Providers"
                    secondary="All cloud infrastructure providers have signed BAAs"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Payment Processors"
                    secondary="PCI DSS compliant payment processing with PHI safeguards"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="IT Support Vendors"
                    secondary="All technical support providers bound by HIPAA requirements"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Backup & Recovery Services"
                    secondary="Offsite backup providers with encryption and access controls"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Vendor Due Diligence</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Security Assessments"
                    secondary="Annual security reviews of all business associates"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contract Reviews"
                    secondary="Regular review and updates of all BAAs"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Incident Reporting"
                    secondary="Immediate notification requirements for security incidents"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Termination Procedures"
                    secondary="Secure data destruction upon contract termination"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      id: 'audits-training',
      title: 'Audits & Staff Training',
      icon: <VerifiedUser />,
      color: 'success',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Regular audits and comprehensive training ensure ongoing compliance:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="h6" color="success.dark" gutterBottom>
                  <VerifiedUser sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Annual Audits
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Comprehensive security risk assessments" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Internal HIPAA compliance audits" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Third-party penetration testing" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Business continuity testing" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Incident response drills" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Typography variant="h6" color="primary.dark" gutterBottom>
                  <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Staff Training
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Annual HIPAA training for all employees" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Role-specific security training" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Privacy awareness programs" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Incident reporting procedures" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Ongoing security awareness" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" color="info.dark" gutterBottom>
              Compliance Documentation
            </Typography>
            <Typography variant="body2">
              All audit reports, training records, and compliance documentation are maintained for a minimum of 6 years and are available for regulatory review upon request.
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      id: 'certifications',
      title: 'Certifications & Standards',
      icon: <Gavel />,
      color: 'primary',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our HIPAA compliance is validated through industry certifications and standards:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter' }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.dark">HITRUST CSF</Typography>
                <Typography variant="body2">Comprehensive security framework certification</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.lighter' }}>
                <Security sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" color="secondary.dark">SOC 2 Type II</Typography>
                <Typography variant="body2">Security, availability, and confidentiality</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter' }}>
                <Shield sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" color="success.dark">ISO 27001</Typography>
                <Typography variant="body2">Information security management systems</Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter' }}>
                <Policy sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" color="warning.dark">NIST Framework</Typography>
                <Typography variant="body2">National Institute of Standards and Technology</Typography>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Compliance Timeline</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="HIPAA Compliant Since 2018" color="primary" icon={<CheckCircle />} />
            <Chip label="Annual Audits Completed" color="secondary" icon={<CheckCircle />} />
            <Chip label="Zero Major Findings" color="success" icon={<CheckCircle />} />
            <Chip label="Continuous Monitoring Active" color="info" icon={<CheckCircle />} />
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2
            }}>
              <Shield sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              HIPAA Compliance
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
              Protecting Your Health Information
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Last Updated: ${lastUpdated}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                label="100% HIPAA Compliant"
                sx={{ bgcolor: 'success.main', color: 'white' }}
                icon={<VerifiedUser />}
              />
              <Chip
                label="Annual Audits Passed"
                sx={{ bgcolor: 'primary.main', color: 'white' }}
                icon={<CheckCircle />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* HIPAA Sections */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, boxShadow: 3 }}>
              {hipaaSections.map((section, index) => (
                <Accordion
                  key={section.id}
                  expanded={expandedPanel === `panel${index + 1}`}
                  onChange={handleAccordionChange(`panel${index + 1}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: `${section.color}.lighter`,
                      '&:hover': { bgcolor: `${section.color}.light` }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        bgcolor: `${section.color}.main`,
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {section.icon}
                      </Avatar>
                      <Typography variant="h6" color={`${section.color}.dark`}>
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {section.content}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Compliance Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Download HIPAA Notice
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Print Compliance Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Share with Provider
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="secondary">
                Contact Compliance Officer
              </Typography>
              <Typography variant="body2" paragraph>
                Questions about HIPAA compliance or patient rights?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Email:</strong> compliance@telehealthportal.com
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> 1-800-HIPAA-01
                </Typography>
                <Typography variant="body2">
                  <strong>Fax:</strong> 1-888-HIPAA-FX
                </Typography>
                <Typography variant="body2">
                  <strong>Hours:</strong> Mon-Fri 8AM-8PM EST
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="success">
                Compliance Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="Privacy Rule: Compliant" color="success" size="small" />
                <Chip label="Security Rule: Compliant" color="success" size="small" />
                <Chip label="Breach Rule: Compliant" color="success" size="small" />
                <Chip label="Business Associates: Compliant" color="success" size="small" />
                <Chip label="Training: Current" color="success" size="small" />
                <Chip label="Audits: Passed" color="success" size="small" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Shield />
      </Fab>
    </Box>
  );
};

export default HIPAACompliancePage;