const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

console.log('Starting API Bridge Server...');

// Load protobuf definitions
const doctorProtoPath = '/opt/telehealth-grpc/grpc/doctor.proto';
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
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP API server running on port ${PORT}`);
});