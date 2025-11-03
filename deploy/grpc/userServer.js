// gRPC UserService server
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

function CreateUser(call, callback) {
  // Implement user creation logic here
  callback(null, {
    user_id: 'user123',
    name: call.request.name,
    email: call.request.email,
    profile_picture_url: call.request.profile_picture_url,
    message: 'User created',
  });
}

function GetUser(call, callback) {
  // Implement get user logic here
  callback(null, {
    user_id: call.request.user_id,
    name: 'Sample User',
    email: 'user@example.com',
    profile_picture_url: '',
    message: 'User found',
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(userProto.UserService.service, {
    CreateUser,
    GetUser,
  });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC UserService running on port 50052');
  });
}

if (require.main === module) {
  main();
}
