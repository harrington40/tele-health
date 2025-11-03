const r = require('../services/rethinkdb');
async function GetAllDoctors(call, callback) {
  try {
    const doctors = await r.table('doctors').run();
    // Map DB fields to proto fields if needed
    const protoDoctors = doctors.map(doc => ({
      doctor_id: doc.id,
      name: doc.name,
      specialty: doc.specialty,
      profile_picture_url: doc.profile_picture_url || '',
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      price: doc.price || 0,
      availability: doc.availability || '',
      location: doc.location || '',
      isOnline: doc.isOnline || false,
    }));
    callback(null, { doctors: protoDoctors });
  } catch (err) {
    callback(err, null);
  }
}
// gRPC DoctorService server
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'doctor.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const doctorProto = grpc.loadPackageDefinition(packageDefinition).doctor;

function CreateDoctor(call, callback) {
  // Implement doctor creation logic here
  callback(null, {
    doctor_id: 'doctor123',
    name: call.request.name,
    specialty: call.request.specialty,
    profile_picture_url: call.request.profile_picture_url,
    message: 'Doctor created',
  });
}

function GetDoctor(call, callback) {
  // Implement get doctor logic here
  callback(null, {
    doctor_id: call.request.doctor_id,
    name: 'Sample Doctor',
    specialty: 'General',
    profile_picture_url: '',
    message: 'Doctor found',
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(doctorProto.DoctorService.service, {
    CreateDoctor,
    GetDoctor,
    GetAllDoctors,
  });
  server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC DoctorService running on port 50053');
  });
}

if (require.main === module) {
  main();
}
