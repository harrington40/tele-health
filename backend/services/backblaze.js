// Backblaze B2 storage service integration
const B2 = require('backblaze-b2');
require('dotenv').config();

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

async function authorize() {
  if (!b2.authorizationToken) {
    await b2.authorize();
  }
}

async function uploadFile(bucketId, fileName, fileBuffer, mimeType) {
  await authorize();
  const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId });
  return b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName,
    data: fileBuffer,
    mime: mimeType,
  });
}

async function downloadFileByName(bucketName, fileName) {
  await authorize();
  return b2.downloadFileByName({ bucketName, fileName });
}

module.exports = {
  uploadFile,
  downloadFileByName,
};
