const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load protobuf
const packageDefinition = protoLoader.loadSync(
  '/opt/telehealth-grpc/grpc/doctor.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const doctorProto = grpc.loadPackageDefinition(packageDefinition).doctor;

// Create client
const client = new doctorProto.DoctorService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

// Test the service
const request = {};
client.getAllDoctors(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Doctors:', response.doctors.length);
    console.log('First doctor:', response.doctors[0]);
  }
  process.exit(0);
});