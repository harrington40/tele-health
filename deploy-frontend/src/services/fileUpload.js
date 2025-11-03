// File upload helper using gRPC FileService
import { fileClient } from './grpcClient';

export function uploadFile({ userId, fileName, fileBuffer, mimeType }) {
  return new Promise((resolve, reject) => {
    fileClient.UploadFile({
      user_id: userId,
      file_name: fileName,
      file_data: fileBuffer,
      mime_type: mimeType,
    }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function getFileUrl(fileId) {
  return new Promise((resolve, reject) => {
    fileClient.GetFileUrl({ file_id: fileId }, (err, response) => {
      if (err) return reject(err);
      resolve(response.file_url);
    });
  });
}
