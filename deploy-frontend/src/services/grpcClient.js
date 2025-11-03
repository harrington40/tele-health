// Real gRPC-web client for connecting to remote server
// Connects to api.transtechologies.com for live data

import { grpc } from 'grpc-web';

// Import generated protobuf and gRPC-web clients
import { DoctorServiceClient } from '../proto/doctor_grpc_web_pb.js';
import { BookingServiceClient } from '../proto/booking_grpc_web_pb.js';
import { UserServiceClient } from '../proto/user_grpc_web_pb.js';
import { FileServiceClient } from '../proto/file_grpc_web_pb.js';

// Import protobuf messages
import {
  GetAllDoctorsRequest,
  GetDoctorRequest,
  CreateDoctorRequest
} from '../proto/doctor_pb.js';

import {
  BookingRequest,
  GetBookingRequest
} from '../proto/booking_pb.js';

import {
  CreateUserRequest,
  GetUserRequest
} from '../proto/user_pb.js';

import {
  UploadFileRequest,
  GetFileUrlRequest
} from '../proto/file_pb.js';

// Lazy load MQTT to avoid chunk loading issues
let mqttClient = null;
let Paho = null;

const initMQTT = async () => {
  if (!Paho) {
    try {
      const pahoModule = await import('paho-mqtt');
      Paho = pahoModule.default;
      mqttClient = new Paho.Client(
        'api.transtechologies.com',
        8083,
        'telehealth-frontend-' + Date.now()
      );

      const MQTT_OPTIONS = {
        userName: process.env.REACT_APP_MQTT_USERNAME || '',
        password: process.env.REACT_APP_MQTT_PASSWORD || '',
        onSuccess: () => console.log('Connected to MQTT broker'),
        onFailure: (error) => console.error('MQTT connection error:', error),
      };

      mqttClient.onConnectionLost = (responseObject) => {
        console.log('MQTT connection lost:', responseObject.errorMessage);
      };

      mqttClient.onMessageArrived = (message) => {
        console.log('Received MQTT message:', message.destinationName, message.payloadString);
      };

      // Optional MQTT connection
      mqttClient.connect(MQTT_OPTIONS);
    } catch (error) {
      console.warn('MQTT not available:', error);
    }
  }
  return mqttClient;
};

// MQTT Helper Functions
export const connectMQTT = async () => {
  return await initMQTT();
};

export const publishNotification = async (message) => {
  const client = await initMQTT();
  if (client && client.isConnected()) {
    const msg = new Paho.Message(JSON.stringify(message));
    msg.destinationName = 'telehealth/notifications';
    msg.qos = 1;
    client.send(msg);
  }
};

export const publishAppointmentUpdate = async (appointmentData) => {
  const client = await initMQTT();
  if (client && client.isConnected()) {
    const msg = new Paho.Message(JSON.stringify(appointmentData));
    msg.destinationName = 'telehealth/appointments';
    msg.qos = 1;
    client.send(msg);
  }
};

export const publishChatMessage = async (chatData) => {
  const client = await initMQTT();
  if (client && client.isConnected()) {
    const msg = new Paho.Message(JSON.stringify(chatData));
    msg.destinationName = 'telehealth/chat';
    msg.qos = 1;
    client.send(msg);
  }
};

// gRPC-web client instances
const grpcOptions = {
  'grpc-web': true,
  'grpc.binary-metadata': true,
  'grpc.default-compression-algorithm': 0,
  'grpc.default-compression-level': 0,
};

// gRPC Client Configurations
const doctorHost = process.env.REACT_APP_GRPC_DOCTOR_HOST || 'http://localhost:50053';
const bookingHost = process.env.REACT_APP_GRPC_BOOKING_HOST || 'http://localhost:50051';
const userHost = process.env.REACT_APP_GRPC_USER_HOST || 'http://localhost:50052';
const fileHost = process.env.REACT_APP_GRPC_FILE_HOST || 'http://localhost:50054';

// Convert host:port to full gRPC-web URL
const formatGrpcHost = (host) => {
  if (host.includes('://')) {
    return host; // Already a full URL
  }
  // For gRPC-web, we need HTTP (not HTTPS) for remote server without SSL
  return `http://${host}`;
};

const doctorClient = new DoctorServiceClient(formatGrpcHost(doctorHost), null, null);
const bookingClient = new BookingServiceClient(formatGrpcHost(bookingHost), null, null);
const userClient = new UserServiceClient(formatGrpcHost(userHost), null, null);
const fileClient = new FileServiceClient(formatGrpcHost(fileHost), null, null);

// Doctor Service Methods
export { doctorClient };
export const getAllDoctors = (callback) => {
  const request = new GetAllDoctorsRequest();
  doctorClient.getAllDoctors(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC GetAllDoctors error:', err);
      callback(err, null);
    } else {
      // Convert protobuf response to plain objects
      const doctors = response.getDoctorsList().map(doctor => ({
        id: doctor.getDoctorId(),
        name: doctor.getName(),
        specialty: doctor.getSpecialty(),
        rating: doctor.getRating(),
        reviews: doctor.getReviews(),
        price: doctor.getPrice(),
        availability: doctor.getAvailability(),
        location: doctor.getLocation(),
        isOnline: doctor.getIsonline(),
        image: doctor.getProfilePictureUrl() || '/api/placeholder/120/120'
      }));
      callback(null, { doctors });
    }
  });
};

export const getDoctor = (doctorId, callback) => {
  const request = new GetDoctorRequest();
  request.setDoctorId(doctorId);
  doctorClient.getDoctor(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC GetDoctor error:', err);
      callback(err, null);
    } else {
      const doctor = {
        id: response.getDoctorId(),
        name: response.getName(),
        specialty: response.getSpecialty(),
        rating: 0, // Not in response
        reviews: 0, // Not in response
        price: 0, // Not in response
        availability: 'Available', // Default
        location: 'Remote', // Default
        isOnline: true, // Default
        image: response.getProfilePictureUrl() || '/api/placeholder/120/120'
      };
      callback(null, { doctor });
    }
  });
};

// Booking Service Methods
export { bookingClient };
export const createBooking = (bookingData, callback) => {
  const request = new BookingRequest();
  request.setUserId(bookingData.userId);
  request.setDoctorId(bookingData.doctorId);
  request.setServiceId(bookingData.serviceId || 'general');
  request.setTime(bookingData.time);

  bookingClient.createBooking(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC CreateBooking error:', err);
      callback(err, null);
    } else {
      callback(null, {
        bookingId: response.getBookingId(),
        status: response.getStatus(),
        message: response.getMessage()
      });
    }
  });
};

export const getBooking = (bookingId, callback) => {
  const request = new GetBookingRequest();
  request.setBookingId(bookingId);

  bookingClient.getBooking(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC GetBooking error:', err);
      callback(err, null);
    } else {
      callback(null, {
        bookingId: response.getBookingId(),
        status: response.getStatus(),
        message: response.getMessage()
      });
    }
  });
};

// User Service Methods
export { userClient };
export const createUser = (userData, callback) => {
  const request = new CreateUserRequest();
  request.setName(userData.name);
  request.setEmail(userData.email);
  request.setPassword(userData.password);
  request.setProfilePictureUrl(userData.profilePictureUrl || '');

  userClient.createUser(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC CreateUser error:', err);
      callback(err, null);
    } else {
      callback(null, {
        userId: response.getUserId(),
        name: response.getName(),
        email: response.getEmail(),
        profilePictureUrl: response.getProfilePictureUrl(),
        message: response.getMessage()
      });
    }
  });
};

export const getUser = (userId, callback) => {
  const request = new GetUserRequest();
  request.setUserId(userId);

  userClient.getUser(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC GetUser error:', err);
      callback(err, null);
    } else {
      callback(null, {
        userId: response.getUserId(),
        name: response.getName(),
        email: response.getEmail(),
        profilePictureUrl: response.getProfilePictureUrl(),
        message: response.getMessage()
      });
    }
  });
};

// File Service Methods
export { fileClient };
export const uploadFile = (fileData, callback) => {
  const request = new UploadFileRequest();
  request.setUserId(fileData.userId);
  request.setFileName(fileData.fileName);
  request.setFileData(fileData.fileData);
  request.setMimeType(fileData.mimeType);

  fileClient.uploadFile(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC UploadFile error:', err);
      callback(err, null);
    } else {
      callback(null, {
        fileId: response.getFileId(),
        fileUrl: response.getFileUrl(),
        message: response.getMessage()
      });
    }
  });
};

export const getFileUrl = (fileId, callback) => {
  const request = new GetFileUrlRequest();
  request.setFileId(fileId);

  fileClient.getFileUrl(request, {}, (err, response) => {
    if (err) {
      console.error('gRPC GetFileUrl error:', err);
      callback(err, null);
    } else {
      callback(null, {
        fileId: response.getFileId(),
        fileUrl: response.getFileUrl(),
        message: response.getMessage()
      });
    }
  });
};
