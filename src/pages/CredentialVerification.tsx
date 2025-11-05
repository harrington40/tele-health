import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Upload,
  CheckCircle,
  Description,
  School,
  Verified,
  CloudUpload,
  Delete,
  Info,
} from '@mui/icons-material';

const CredentialVerification: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    license: null,
    cv: null,
    certificates: null,
  });

  const steps = [
    'Personal Information',
    'Medical License',
    'Certifications',
    'Review & Submit',
  ];

  const [formData, setFormData] = useState({
    licenseNumber: '',
    issuingState: '',
    issuingCountry: 'USA',
    npiNumber: '',
    deaNumber: '',
    medicalSchool: '',
    graduationYear: '',
    specializations: '',
    boardCertifications: '',
    professionalReferences: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = () => {
    // API call to submit credentials
    console.log('Submitting credentials:', formData, uploadedFiles);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" icon={<Info />}>
                Please provide your professional credentials. All information will be verified by our medical team.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Medical License Number"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                helperText="Your state medical license number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issuing State"
                required
                value={formData.issuingState}
                onChange={(e) => setFormData({ ...formData, issuingState: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NPI Number"
                required
                value={formData.npiNumber}
                onChange={(e) => setFormData({ ...formData, npiNumber: e.target.value })}
                helperText="National Provider Identifier"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DEA Number (if applicable)"
                value={formData.deaNumber}
                onChange={(e) => setFormData({ ...formData, deaNumber: e.target.value })}
                helperText="Drug Enforcement Administration number"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning">
                Please upload clear copies of your medical license. Accepted formats: PDF, JPG, PNG (Max 5MB)
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Medical License Document
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUpload />}
                    >
                      Upload License
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('license', e)}
                      />
                    </Button>
                    {uploadedFiles.license && (
                      <Chip
                        label={uploadedFiles.license.name}
                        onDelete={() =>
                          setUploadedFiles((prev) => ({ ...prev, license: null }))
                        }
                        color="success"
                        icon={<CheckCircle />}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    CV / Resume
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUpload />}
                    >
                      Upload CV
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('cv', e)}
                      />
                    </Button>
                    {uploadedFiles.cv && (
                      <Chip
                        label={uploadedFiles.cv.name}
                        onDelete={() =>
                          setUploadedFiles((prev) => ({ ...prev, cv: null }))
                        }
                        color="success"
                        icon={<CheckCircle />}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Medical School"
                required
                value={formData.medicalSchool}
                onChange={(e) => setFormData({ ...formData, medicalSchool: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Graduation Year"
                required
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specializations"
                multiline
                rows={2}
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                helperText="Enter your medical specializations (e.g., Cardiology, Internal Medicine)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Board Certifications"
                multiline
                rows={2}
                value={formData.boardCertifications}
                onChange={(e) => setFormData({ ...formData, boardCertifications: e.target.value })}
                helperText="List your board certifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Certificate Documents
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUpload />}
                    >
                      Upload Certificates
                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('certificates', e)}
                      />
                    </Button>
                    {uploadedFiles.certificates && (
                      <Chip
                        label={uploadedFiles.certificates.name}
                        onDelete={() =>
                          setUploadedFiles((prev) => ({ ...prev, certificates: null }))
                        }
                        color="success"
                        icon={<CheckCircle />}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Ready to Submit!
              </Typography>
              <Typography variant="body2">
                Please review your information before submitting for verification.
              </Typography>
            </Alert>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="License Number"
                      secondary={formData.licenseNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="NPI Number"
                      secondary={formData.npiNumber || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Medical School"
                      secondary={formData.medicalSchool || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Documents
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      {uploadedFiles.license ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Description color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Medical License"
                      secondary={uploadedFiles.license?.name || 'Not uploaded'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {uploadedFiles.cv ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Description color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="CV/Resume"
                      secondary={uploadedFiles.cv?.name || 'Not uploaded'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {uploadedFiles.certificates ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Description color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Certificates"
                      secondary={uploadedFiles.certificates?.name || 'Not uploaded'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 2 }}>
              Our verification team will review your credentials within 48 hours. You'll receive
              an email notification once the verification is complete.
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Medical Credential Verification
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the verification process to start accepting patients
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<Verified />}
                  size="large"
                >
                  Submit for Verification
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} size="large">
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CredentialVerification;
