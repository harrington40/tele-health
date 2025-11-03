// gRPC FileService server using Backblaze for storage
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const backblaze = require('../services/backblaze');

const PROTO_PATH = path.join(__dirname, 'file.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const fileProto = grpc.loadPackageDefinition(packageDefinition).file;

// Dummy bucket info for demonstration
const BUCKET_ID = process.env.B2_BUCKET_ID;
const BUCKET_NAME = process.env.B2_BUCKET_NAME;

async function UploadFile(call, callback) {
  try {
    const { user_id, file_name, file_data, mime_type } = call.request;
    // Upload to Backblaze
    const result = await backblaze.uploadFile(BUCKET_ID, file_name, file_data, mime_type);
    callback(null, {
      file_id: result.data.fileId,
      file_url: result.data.fileUrl || '',
      message: 'File uploaded',
    });
  } catch (err) {
    callback(err, null);
  }
}

async function GetFileUrl(call, callback) {
  try {
    const { file_id } = call.request;
    // In a real app, lookup file info in DB and return URL
    callback(null, {
      file_id,
      file_url: 'https://f000.backblazeb2.com/file/' + BUCKET_NAME + '/' + file_id,
      message: 'File URL fetched',
    });
  } catch (err) {
    callback(err, null);
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(fileProto.FileService.service, {
    UploadFile,
    GetFileUrl,
  });
  server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC FileService running on port 50054');
  });
}

if (require.main === module) {
  main();
}
