const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Initialize database connection
const { connect } = require('./database/connection');

// Load protobuf definitions
const doctorProtoPath = __dirname + '/grpc/doctor.proto';
const patientProtoPath = __dirname + '/grpc/patient.proto';

const doctorPackageDef = protoLoader.loadSync(doctorProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const patientPackageDef = protoLoader.loadSync(patientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const doctorProto = grpc.loadPackageDefinition(doctorPackageDef).doctor;
const patientProto = grpc.loadPackageDefinition(patientPackageDef).patient;

// Create gRPC clients
const doctorClient = new doctorProto.DoctorService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

const patientClient = new patientProto.PatientService(
  'localhost:50054',
  grpc.credentials.createInsecure()
);

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use auth routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// REST endpoint to get all doctors
app.get('/api/doctors', (req, res) => {
  console.log('Received request for doctors');

  doctorClient.GetAllDoctors({}, (error, response) => {
    if (error) {
      console.error('gRPC error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('gRPC response:', JSON.stringify(response, null, 2));

    // Convert protobuf response to JSON-friendly format
    const doctors = response.doctors.map(doctor => ({
      id: doctor.doctor_id || doctor.doctorId || Math.floor(Math.random() * 10000),
      name: doctor.name || 'Unknown Doctor',
      specialty: doctor.specialty || 'General Practice',
      rating: parseFloat(doctor.rating) || 4.5,
      reviews: parseInt(doctor.reviews) || 100,
      price: parseInt(doctor.price) || 75,
      availability: doctor.availability || 'Available Today',
      location: typeof doctor.location === 'object' 
        ? (doctor.location.city || 'New York') 
        : (doctor.location || 'New York'),
      image: doctor.profile_picture_url || doctor.imageUrl || '/default-doctor.jpg',
      isOnline: Boolean(doctor.isOnline),
      experience: doctor.experience || 5,
      bio: doctor.bio || '',
      languages: doctor.languages || [],
      education: doctor.education || [],
      certifications: doctor.certifications || []
    }));

    console.log('Sending doctors:', doctors.length);
    console.log('Sample doctor:', doctors[0]);
    res.json({ doctors });
  });
});

// REST endpoint to get all patients
app.get('/api/patients', (req, res) => {
  console.log('Received request for patients');

  patientClient.GetAllPatients({}, (error, response) => {
    if (error) {
      console.error('gRPC error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('gRPC response - patients:', response.patients.length);

    // Convert protobuf response to JSON-friendly format
    const patients = response.patients.map(patient => ({
      id: patient.patient_id,
      userId: patient.user_id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      address: patient.address,
      emergencyContact: patient.emergency_contact,
      medicalHistory: patient.medical_history,
      allergies: patient.allergies,
      medications: patient.medications,
      healthMetrics: patient.health_metrics,
      healthScore: patient.health_score,
      insuranceInfo: patient.insurance_info,
      bloodType: patient.blood_type,
      chronicConditions: patient.chronic_conditions,
      appointmentHistory: patient.appointment_history,
      isActive: patient.is_active,
      createdAt: patient.created_at,
      updatedAt: patient.updated_at
    }));

    console.log('Sending patients:', patients.length);
    res.json({ patients });
  });
});

// REST endpoint to get single patient
app.get('/api/patients/:patientId', (req, res) => {
  console.log('Received request for patient:', req.params.patientId);

  patientClient.GetPatient({ patient_id: req.params.patientId }, (error, response) => {
    if (error) {
      console.error('gRPC error:', error);
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = {
      id: response.patient.patient_id,
      userId: response.patient.user_id,
      name: response.patient.name,
      email: response.patient.email,
      phone: response.patient.phone,
      dateOfBirth: response.patient.date_of_birth,
      gender: response.patient.gender,
      address: response.patient.address,
      emergencyContact: response.patient.emergency_contact,
      medicalHistory: response.patient.medical_history,
      allergies: response.patient.allergies,
      medications: response.patient.medications,
      healthMetrics: response.patient.health_metrics,
      healthScore: response.patient.health_score,
      insuranceInfo: response.patient.insurance_info,
      bloodType: response.patient.blood_type,
      chronicConditions: response.patient.chronic_conditions,
      appointmentHistory: response.patient.appointment_history,
      isActive: response.patient.is_active,
      createdAt: response.patient.created_at,
      updatedAt: response.patient.updated_at
    };

    res.json({ patient });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server after connecting to database
async function startServer() {
  try {
    await connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP API server running on port ${PORT}`);
      console.log(`Doctors API: http://localhost:${PORT}/api/doctors`);
      console.log(`Patients API: http://localhost:${PORT}/api/patients`);
      console.log(`Auth API: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
