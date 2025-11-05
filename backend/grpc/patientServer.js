const r = require('../services/rethinkdb');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'patient.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

// Helper function to convert DB patient to proto format
function dbToProto(patient) {
  return {
    patient_id: patient.id || patient.patientId,
    user_id: patient.userId || '',
    name: patient.name || '',
    email: patient.email || '',
    phone: patient.phone || '',
    date_of_birth: patient.dateOfBirth || '',
    gender: patient.gender || '',
    address: patient.address ? {
      street: patient.address.street || '',
      city: patient.address.city || '',
      state: patient.address.state || '',
      zip_code: patient.address.zipCode || '',
      country: patient.address.country || ''
    } : null,
    emergency_contact: patient.emergencyContact ? {
      name: patient.emergencyContact.name || '',
      phone: patient.emergencyContact.phone || '',
      relationship: patient.emergencyContact.relationship || ''
    } : null,
    medical_history: patient.medicalHistory || [],
    allergies: patient.allergies || [],
    medications: (patient.medications || []).map(med => ({
      name: med.name || '',
      dosage: med.dosage || '',
      frequency: med.frequency || '',
      prescribed_by: med.prescribedBy || '',
      start_date: med.startDate || '',
      next_dose: med.nextDose || '',
      remaining: med.remaining || 0
    })),
    health_metrics: patient.healthMetrics ? {
      heart_rate: patient.healthMetrics.heartRate || 0,
      blood_pressure: patient.healthMetrics.bloodPressure || '',
      temperature: patient.healthMetrics.temperature || 0,
      weight: patient.healthMetrics.weight || 0,
      height: patient.healthMetrics.height || 0,
      bmi: patient.healthMetrics.bmi || 0,
      last_updated: patient.healthMetrics.lastUpdated || ''
    } : null,
    health_score: patient.healthScore || 0,
    insurance_info: patient.insuranceInfo ? {
      provider: patient.insuranceInfo.provider || '',
      policy_number: patient.insuranceInfo.policyNumber || '',
      group_number: patient.insuranceInfo.groupNumber || ''
    } : null,
    blood_type: patient.bloodType || '',
    chronic_conditions: patient.chronicConditions || [],
    appointment_history: (patient.appointmentHistory || []).map(apt => ({
      id: apt.id || '',
      doctor: apt.doctor || '',
      specialty: apt.specialty || '',
      date: apt.date || '',
      diagnosis: apt.diagnosis || '',
      notes: apt.notes || '',
      follow_up: apt.followUp || '',
      notification: apt.notification || ''
    })),
    is_active: patient.isActive || false,
    created_at: patient.createdAt || '',
    updated_at: patient.updatedAt || ''
  };
}

async function GetAllPatients(call, callback) {
  try {
    const patients = await r.table('patients').run();
    const protoPatients = patients.map(dbToProto);
    callback(null, { patients: protoPatients });
  } catch (err) {
    console.error('Error in GetAllPatients:', err);
    callback(err, null);
  }
}

async function GetPatient(call, callback) {
  try {
    const patients = await r.table('patients')
      .filter({ patientId: call.request.patient_id })
      .run();
    
    if (patients.length === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Patient not found'
      });
    }
    
    callback(null, {
      patient: dbToProto(patients[0]),
      message: 'Patient found'
    });
  } catch (err) {
    console.error('Error in GetPatient:', err);
    callback(err, null);
  }
}

async function CreatePatient(call, callback) {
  try {
    const newPatient = {
      patientId: `patient_${Date.now()}`,
      userId: `user_${Date.now()}`,
      name: call.request.name,
      email: call.request.email,
      phone: call.request.phone,
      dateOfBirth: call.request.date_of_birth,
      gender: call.request.gender,
      address: call.request.address ? {
        street: call.request.address.street,
        city: call.request.address.city,
        state: call.request.address.state,
        zipCode: call.request.address.zip_code,
        country: call.request.address.country
      } : {},
      medicalHistory: [],
      allergies: [],
      medications: [],
      healthMetrics: {},
      healthScore: 100,
      chronicConditions: [],
      appointmentHistory: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await r.table('patients').insert(newPatient).run();
    
    callback(null, {
      patient: dbToProto(newPatient),
      message: 'Patient created successfully'
    });
  } catch (err) {
    console.error('Error in CreatePatient:', err);
    callback(err, null);
  }
}

async function UpdatePatient(call, callback) {
  try {
    const updateData = {
      updatedAt: new Date().toISOString(),
      ...call.request.patient_data
    };
    
    await r.table('patients')
      .filter({ patientId: call.request.patient_id })
      .update(updateData)
      .run();
    
    const updated = await r.table('patients')
      .filter({ patientId: call.request.patient_id })
      .run();
    
    callback(null, {
      patient: dbToProto(updated[0]),
      message: 'Patient updated successfully'
    });
  } catch (err) {
    console.error('Error in UpdatePatient:', err);
    callback(err, null);
  }
}

async function DeletePatient(call, callback) {
  try {
    await r.table('patients')
      .filter({ patientId: call.request.patient_id })
      .delete()
      .run();
    
    callback(null, {
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (err) {
    console.error('Error in DeletePatient:', err);
    callback(err, null);
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(patientProto.PatientService.service, {
    CreatePatient,
    GetPatient,
    GetAllPatients,
    UpdatePatient,
    DeletePatient
  });
  
  server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC PatientService running on port 50054');
  });
}

if (require.main === module) {
  main();
}

module.exports = { GetAllPatients, GetPatient, CreatePatient, UpdatePatient, DeletePatient };
