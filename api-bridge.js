const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

console.log('Starting API Bridge Server...');

// Initialize RethinkDB connection
const { connect } = require('./backend/database/connection');
connect().then(() => {
  console.log('✅ RethinkDB connected and ready');
}).catch(err => {
  console.error('❌ Failed to connect to RethinkDB:', err);
});

// Load protobuf definitions
const path = require('path');
const doctorProtoPath = path.join(__dirname, 'backend/grpc/doctor.proto');
console.log('Loading protobuf from:', doctorProtoPath);
const packageDefinition = protoLoader.loadSync(doctorProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const doctorProto = grpc.loadPackageDefinition(packageDefinition).doctor;

// Create gRPC client
const doctorClient = new doctorProto.DoctorService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

const app = express();
const PORT = 8081;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Authentication routes
const authRoutes = require('./backend/routes/authRoutes');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

// REST endpoint to get all doctors
app.get('/api/doctors', (req, res) => {
  console.log('Received request for doctors');

  doctorClient.GetAllDoctors({}, (error, response) => {
    if (error) {
      console.error('gRPC error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('gRPC response:', response);

        // Transform doctor data to match frontend interface
    const doctors = response.doctors.map(doctor => ({
      id: parseInt(doctor.doctorId) || 0,
      name: doctor.name || '',
      specialty: doctor.specialty || '',
      rating: doctor.rating || 0,
      reviews: doctor.reviews || 0,
      price: doctor.price || 0,
      availability: doctor.availability || '',
      image: doctor.imageUrl || '/api/placeholder/120/120',
      location: doctor.location ? `${doctor.location.city}, ${doctor.location.state}` : '',
      country: doctor.location?.country || '',
      isOnline: doctor.isOnline || false,
      bio: doctor.bio || '',
      education: doctor.education || '',
      experience: doctor.experience || 0
    }));

    console.log('Sending doctors:', doctors.length);
    res.json({ doctors });
  });
});

// Doctor Dashboard endpoints
app.get('/api/doctor/dashboard/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  console.log('Fetching dashboard for doctor:', doctorId);

  // Mock data for now - will be replaced with gRPC calls
  const dashboardData = {
    doctorInfo: {
      id: doctorId,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      license: 'MD12345',
      rating: 4.8,
      verificationStatus: 'verified',
    },
    stats: {
      totalPatients: 156,
      todayAppointments: 8,
      pendingDocuments: 3,
      averageRating: 4.8,
    },
    patients: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        lastVisit: '2024-11-01',
        nextAppointment: '2024-11-15',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
        lastVisit: '2024-10-28',
        status: 'active',
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '(555) 456-7890',
        lastVisit: '2024-10-25',
        nextAppointment: '2024-11-10',
        status: 'active',
      },
    ],
    appointments: [
      {
        id: '1',
        patientName: 'John Doe',
        date: '2024-11-15',
        time: '10:00 AM',
        type: 'video',
        status: 'upcoming',
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        date: '2024-11-15',
        time: '11:30 AM',
        type: 'in-person',
        status: 'upcoming',
      },
      {
        id: '3',
        patientName: 'Michael Brown',
        date: '2024-11-10',
        time: '2:00 PM',
        type: 'video',
        status: 'upcoming',
      },
    ],
    documents: [
      {
        id: '1',
        name: 'Lab Results - Blood Test',
        type: 'lab_result',
        patientName: 'John Doe',
        uploadedAt: '2024-11-01',
        status: 'approved',
        canDownload: true,
      },
      {
        id: '2',
        name: 'X-Ray Results',
        type: 'imaging',
        patientName: 'Jane Smith',
        uploadedAt: '2024-10-28',
        status: 'pending',
        canDownload: false,
      },
    ],
  };

  res.json(dashboardData);
});

// Get doctor patients
app.get('/api/doctor/:doctorId/patients', (req, res) => {
  const { doctorId } = req.params;
  console.log('Fetching patients for doctor:', doctorId);

  const patients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      lastVisit: '2024-11-01',
      nextAppointment: '2024-11-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      lastVisit: '2024-10-28',
      status: 'active',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '(555) 456-7890',
      lastVisit: '2024-10-25',
      nextAppointment: '2024-11-10',
      status: 'active',
    },
  ];

  res.json({ patients });
});

// Get doctor appointments
app.get('/api/doctor/:doctorId/appointments', (req, res) => {
  const { doctorId } = req.params;
  console.log('Fetching appointments for doctor:', doctorId);

  const appointments = [
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-11-15',
      time: '10:00 AM',
      type: 'video',
      status: 'upcoming',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-11-15',
      time: '11:30 AM',
      type: 'in-person',
      status: 'upcoming',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      date: '2024-11-10',
      time: '2:00 PM',
      type: 'video',
      status: 'upcoming',
    },
  ];

  res.json({ appointments });
});

// Get doctor documents
app.get('/api/doctor/:doctorId/documents', (req, res) => {
  const { doctorId } = req.params;
  console.log('Fetching documents for doctor:', doctorId);

  const documents = [
    {
      id: '1',
      name: 'Lab Results - Blood Test',
      type: 'lab_result',
      patientName: 'John Doe',
      uploadedAt: '2024-11-01',
      status: 'approved',
      canDownload: true,
    },
    {
      id: '2',
      name: 'X-Ray Results',
      type: 'imaging',
      patientName: 'Jane Smith',
      uploadedAt: '2024-10-28',
      status: 'pending',
      canDownload: false,
    },
    {
      id: '3',
      name: 'Prescription - Medication',
      type: 'prescription',
      patientName: 'Michael Brown',
      uploadedAt: '2024-10-25',
      status: 'approved',
      canDownload: true,
    },
  ];

  res.json({ documents });
});

// Upload document
app.post('/api/doctor/:doctorId/documents/upload', express.json(), (req, res) => {
  const { doctorId } = req.params;
  const { name, type, patientId } = req.body;
  
  console.log('Uploading document for doctor:', doctorId);

  const newDocument = {
    id: Date.now().toString(),
    name,
    type,
    patientName: 'Patient Name',
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    canDownload: false,
  };

  res.json({ document: newDocument, message: 'Document uploaded successfully' });
});

// Share document
app.post('/api/doctor/:doctorId/documents/:documentId/share', express.json(), (req, res) => {
  const { doctorId, documentId } = req.params;
  const { patientId, permissions } = req.body;

  console.log('Sharing document:', documentId, 'with patient:', patientId);

  res.json({ 
    success: true, 
    message: 'Document shared successfully',
    shareId: Date.now().toString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP API server running on port ${PORT}`);
});