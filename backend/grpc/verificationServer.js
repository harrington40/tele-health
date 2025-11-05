const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const r = require('../services/rethinkdb');

const PROTO_PATH = path.join(__dirname, 'verification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const verificationProto = grpc.loadPackageDefinition(packageDefinition).verification;

// Submit credentials for verification
async function SubmitCredentials(call, callback) {
  try {
    const {
      doctor_id,
      medical_license_number,
      issuing_state,
      issuing_country,
      specialization_certificates,
      board_certifications,
      medical_school,
      graduation_year,
      npi_number,
      dea_number,
      professional_references,
      cv_document_url,
      license_document_url,
      certificate_urls
    } = call.request;

    const verificationRecord = {
      doctor_id,
      medical_license_number,
      issuing_state,
      issuing_country,
      specialization_certificates: specialization_certificates || [],
      board_certifications: board_certifications || [],
      medical_school,
      graduation_year,
      npi_number,
      dea_number,
      professional_references: professional_references || [],
      cv_document_url,
      license_document_url,
      certificate_urls: certificate_urls || [],
      status: 'pending',
      submitted_at: new Date().toISOString(),
      verified_at: null,
      admin_id: null,
      admin_notes: ''
    };

    const result = await r.table('verifications').insert(verificationRecord).run();
    const verification_id = result.generated_keys[0];

    // Update doctor status to pending verification
    await r.table('doctors').get(doctor_id).update({
      verification_status: 'pending',
      verification_id: verification_id
    }).run();

    callback(null, {
      verification_id,
      doctor_id,
      status: 'pending',
      message: 'Credentials submitted successfully. Our team will review within 48 hours.',
      submitted_at: verificationRecord.submitted_at
    });
  } catch (err) {
    console.error('Error submitting credentials:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to submit credentials'
    });
  }
}

// Admin verifies credentials
async function VerifyCredentials(call, callback) {
  try {
    const { verification_id, admin_id, status, notes } = call.request;

    const verified_at = new Date().toISOString();
    
    await r.table('verifications').get(verification_id).update({
      status,
      admin_id,
      admin_notes: notes,
      verified_at
    }).run();

    // Get doctor_id from verification
    const verification = await r.table('verifications').get(verification_id).run();
    
    // Update doctor verification status
    await r.table('doctors').get(verification.doctor_id).update({
      verification_status: status,
      is_verified: status === 'approved',
      verified_at: status === 'approved' ? verified_at : null
    }).run();

    callback(null, {
      success: true,
      message: `Credentials ${status}`,
      verified_at
    });
  } catch (err) {
    console.error('Error verifying credentials:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to verify credentials'
    });
  }
}

// Get verification status
async function GetVerificationStatus(call, callback) {
  try {
    const { doctor_id } = call.request;

    const verification = await r.table('verifications')
      .filter({ doctor_id })
      .orderBy(r.desc('submitted_at'))
      .limit(1)
      .run();

    if (verification.length === 0) {
      callback(null, {
        verification_id: '',
        status: 'not_submitted',
        submitted_at: '',
        verified_at: '',
        admin_notes: '',
        missing_documents: []
      });
      return;
    }

    const record = verification[0];
    const missing_documents = [];

    // Check for missing required documents
    if (!record.license_document_url) missing_documents.push('Medical License');
    if (!record.cv_document_url) missing_documents.push('CV/Resume');
    if (!record.npi_number) missing_documents.push('NPI Number');

    callback(null, {
      verification_id: record.id,
      status: record.status,
      submitted_at: record.submitted_at,
      verified_at: record.verified_at || '',
      admin_notes: record.admin_notes || '',
      missing_documents
    });
  } catch (err) {
    console.error('Error getting verification status:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to get verification status'
    });
  }
}

// Update verification status (admin use)
async function UpdateVerificationStatus(call, callback) {
  try {
    const { verification_id, status, admin_id, notes } = call.request;

    await r.table('verifications').get(verification_id).update({
      status,
      admin_id,
      admin_notes: notes,
      updated_at: new Date().toISOString()
    }).run();

    callback(null, {
      success: true,
      message: 'Verification status updated'
    });
  } catch (err) {
    console.error('Error updating verification status:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to update verification status'
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(verificationProto.VerificationService.service, {
    SubmitCredentials,
    VerifyCredentials,
    GetVerificationStatus,
    UpdateVerificationStatus
  });

  server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind verification server:', err);
      return;
    }
    server.start();
    console.log('gRPC VerificationService running on port 50054');
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };
