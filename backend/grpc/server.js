// Basic gRPC server for BookingService
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'booking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const bookingProto = grpc.loadPackageDefinition(packageDefinition).booking;

function CreateBooking(call, callback) {
  // Implement booking logic here
  callback(null, {
    booking_id: 'sample123',
    status: 'success',
    message: 'Booking created',
  });
}

function GetBooking(call, callback) {
  // Implement get booking logic here
  callback(null, {
    booking_id: call.request.booking_id,
    status: 'success',
    message: 'Booking found',
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(bookingProto.BookingService.service, {
    CreateBooking,
    GetBooking,
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC BookingService running on port 50051');
  });
}

if (require.main === module) {
  main();
}
