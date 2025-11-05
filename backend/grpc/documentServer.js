const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const r = require('../services/rethinkdb');

const PROTO_PATH = path.join(__dirname, 'documents.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const documentsProto = grpc.loadPackageDefinition(packageDefinition).documents;

// Upload document
async function UploadDocument(call, callback) {
  try {
    const {
      uploader_id,
      uploader_type,
      document_name,
      document_type,
      file_url,
      file_size,
      mime_type,
      patient_id,
      description
    } = call.request;

    const document = {
      uploader_id,
      uploader_type,
      document_name,
      document_type,
      file_url,
      file_size,
      mime_type,
      patient_id,
      description,
      uploaded_at: new Date().toISOString(),
      status: 'active'
    };

    const result = await r.table('documents').insert(document).run();
    const document_id = result.generated_keys[0];

    callback(null, {
      document_id,
      message: 'Document uploaded successfully',
      uploaded_at: document.uploaded_at
    });
  } catch (err) {
    console.error('Error uploading document:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to upload document'
    });
  }
}

// Share document with patient/doctor
async function ShareDocument(call, callback) {
  try {
    const {
      document_id,
      shared_by_id,
      shared_by_type,
      shared_with_id,
      shared_with_type,
      permission,
      expiration_date,
      notes
    } = call.request;

    const share = {
      document_id,
      shared_by_id,
      shared_by_type,
      shared_with_id,
      shared_with_type,
      permission,
      expiration_date,
      notes,
      status: 'pending_approval',
      shared_at: new Date().toISOString(),
      approved_at: null,
      approver_notes: ''
    };

    const result = await r.table('document_shares').insert(share).run();
    const share_id = result.generated_keys[0];

    callback(null, {
      share_id,
      message: 'Document share request sent. Awaiting recipient approval.',
      status: 'pending_approval'
    });
  } catch (err) {
    console.error('Error sharing document:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to share document'
    });
  }
}

// Get shared documents for a user
async function GetSharedDocuments(call, callback) {
  try {
    const { user_id, user_type, filter_status } = call.request;

    // Get documents shared with this user
    let query = r.table('document_shares')
      .filter({ shared_with_id: user_id });

    if (filter_status && filter_status !== 'all') {
      query = query.filter({ status: filter_status });
    }

    const shares = await query.run();

    // Get full document details
    const documents = await Promise.all(shares.map(async (share) => {
      const doc = await r.table('documents').get(share.document_id).run();
      
      // Get patient/doctor name
      let sharedByName = '';
      if (share.shared_by_type === 'doctor') {
        const doctor = await r.table('doctors').get(share.shared_by_id).run();
        sharedByName = doctor ? doctor.name : 'Unknown';
      } else {
        const patient = await r.table('patients').get(share.shared_by_id).run();
        sharedByName = patient ? patient.name : 'Unknown';
      }

      let patientName = '';
      if (doc.patient_id) {
        const patient = await r.table('patients').get(doc.patient_id).run();
        patientName = patient ? patient.name : 'Unknown';
      }

      return {
        document_id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        file_url: doc.file_url,
        uploaded_by: sharedByName,
        uploaded_at: doc.uploaded_at,
        shared_with: user_id,
        permission: share.permission,
        status: share.status,
        patient_name: patientName,
        description: doc.description || '',
        can_download: share.status === 'approved' && share.permission === 'download'
      };
    }));

    callback(null, { documents });
  } catch (err) {
    console.error('Error getting shared documents:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to get shared documents'
    });
  }
}

// Approve document access
async function ApproveDocumentAccess(call, callback) {
  try {
    const { share_id, approver_id, approved, notes } = call.request;

    const status = approved ? 'approved' : 'rejected';
    
    await r.table('document_shares').get(share_id).update({
      status,
      approved_at: new Date().toISOString(),
      approver_notes: notes
    }).run();

    callback(null, {
      success: true,
      message: `Document access ${status}`
    });
  } catch (err) {
    console.error('Error approving document access:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to approve document access'
    });
  }
}

// Download document
async function DownloadDocument(call, callback) {
  try {
    const { document_id, user_id, user_type } = call.request;

    // Check if user has permission
    const share = await r.table('document_shares')
      .filter({
        document_id,
        shared_with_id: user_id,
        status: 'approved'
      })
      .limit(1)
      .run();

    if (share.length === 0) {
      callback(null, {
        file_url: '',
        file_name: '',
        mime_type: '',
        success: false,
        message: 'Access denied or not approved'
      });
      return;
    }

    const document = await r.table('documents').get(document_id).run();

    // Log download activity
    await r.table('document_activity').insert({
      document_id,
      user_id,
      user_type,
      action: 'download',
      timestamp: new Date().toISOString()
    }).run();

    callback(null, {
      file_url: document.file_url,
      file_name: document.document_name,
      mime_type: document.mime_type,
      success: true,
      message: 'Document ready for download'
    });
  } catch (err) {
    console.error('Error downloading document:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to download document'
    });
  }
}

// Revoke access
async function RevokeAccess(call, callback) {
  try {
    const { share_id, revoked_by_id } = call.request;

    await r.table('document_shares').get(share_id).update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_by_id
    }).run();

    callback(null, {
      success: true,
      message: 'Document access revoked'
    });
  } catch (err) {
    console.error('Error revoking access:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to revoke access'
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(documentsProto.DocumentService.service, {
    UploadDocument,
    ShareDocument,
    GetSharedDocuments,
    ApproveDocumentAccess,
    DownloadDocument,
    RevokeAccess
  });

  server.bindAsync('0.0.0.0:50055', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind document server:', err);
      return;
    }
    server.start();
    console.log('gRPC DocumentService running on port 50055');
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };
