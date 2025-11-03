// Main gRPC-web server that combines all services
const express = require('express');
const { grpc } = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const cors = require('cors');

// Import RethinkDB connection
const r = require('./services/rethinkdb');

// Load protobuf definitions
const doctorProtoPath = path.join(__dirname, 'grpc/doctor.proto');
const bookingProtoPath = path.join(__dirname, 'grpc/booking.proto');
const userProtoPath = path.join(__dirname, 'grpc/user.proto');
const fileProtoPath = path.join(__dirname, 'grpc/file.proto');

const doctorPackageDefinition = protoLoader.loadSync(doctorProtoPath, {});
const bookingPackageDefinition = protoLoader.loadSync(bookingProtoPath, {});
const userPackageDefinition = protoLoader.loadSync(userProtoPath, {});
const filePackageDefinition = protoLoader.loadSync(fileProtoPath, {});

const doctorProto = grpc.loadPackageDefinition(doctorPackageDefinition).doctor;
const bookingProto = grpc.loadPackageDefinition(bookingPackageDefinition).booking;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;
const fileProto = grpc.loadPackageDefinition(filePackageDefinition).file;

// Doctor Service Implementation
async function GetAllDoctors(call, callback) {
  try {
    console.log('Fetching all doctors from database...');
    const doctors = await r.table('doctors').run();
    console.log(`Found ${doctors.length} doctors in database`);

    // Map database fields to protobuf format
    const protoDoctors = doctors.map(doc => ({
      doctor_id: doc.id || doc.doctor_id,
      name: doc.name,
      specialty: doc.specialty,
      profile_picture_url: doc.profile_picture_url || doc.image || '',
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      price: doc.price || 0,
      availability: doc.availability || '',
      location: doc.location || '',
      isOnline: doc.isOnline || false,
    }));

    callback(null, { doctors: protoDoctors });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    callback(err, null);
  }
}

function GetDoctor(call, callback) {
  // Implementation for getting a single doctor
  callback(null, {
    doctor_id: call.request.doctor_id,
    name: 'Sample Doctor',
    specialty: 'General Medicine',
    profile_picture_url: '',
    rating: 4.5,
    reviews: 100,
    price: 50,
    availability: 'Available Today',
    location: 'New York, NY',
    isOnline: true,
  });
}

function CreateDoctor(call, callback) {
  // Implementation for creating a doctor
  callback(null, {
    doctor_id: 'new_doctor_' + Date.now(),
    name: call.request.name,
    specialty: call.request.specialty,
    profile_picture_url: call.request.profile_picture_url || '',
    message: 'Doctor created successfully',
  });
}

// Booking Service Implementation
function CreateBooking(call, callback) {
  callback(null, {
    booking_id: 'booking_' + Date.now(),
    status: 'confirmed',
    message: 'Booking created successfully',
  });
}

function GetBooking(call, callback) {
  callback(null, {
    booking_id: call.request.booking_id,
    status: 'confirmed',
    message: 'Booking found',
  });
}

// User Service Implementation
function CreateUser(call, callback) {
  callback(null, {
    user_id: 'user_' + Date.now(),
    name: call.request.name,
    email: call.request.email,
    message: 'User created successfully',
  });
}

function GetUser(call, callback) {
  callback(null, {
    user_id: call.request.user_id,
    name: 'Sample User',
    email: 'user@example.com',
  });
}

// File Service Implementation
function UploadFile(call, callback) {
  callback(null, {
    file_id: 'file_' + Date.now(),
    url: 'https://example.com/files/' + Date.now(),
    message: 'File uploaded successfully',
  });
}

function GetFileUrl(call, callback) {
  callback(null, {
    url: 'https://example.com/files/' + call.request.file_id,
  });
}

// Create gRPC server
const server = new grpc.Server();

// Add services to server
server.addService(doctorProto.DoctorService.service, {
  GetAllDoctors,
  GetDoctor,
  CreateDoctor,
});

server.addService(bookingProto.BookingService.service, {
  CreateBooking,
  GetBooking,
});

server.addService(userProto.UserService.service, {
  CreateUser,
  GetUser,
});

server.addService(fileProto.FileService.service, {
  UploadFile,
  GetFileUrl,
});

// Start gRPC server
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind gRPC server:', err);
    return;
  }
  server.start();
  console.log(`gRPC server running on port ${port}`);
});

// Create Express server for gRPC-web proxy
const app = express();
app.use(cors());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server for gRPC-web
const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => {
  console.log(`gRPC-web proxy server running on port ${HTTP_PORT}`);
});

console.log('TeleHealth gRPC services starting...');</content>
<parameter name="filePath">/mnt/c/Users/harri/designProject2020/tele-health/backend/main-server.js