// =====================================================
// HTTP API Test Client
// Test authentication endpoints via HTTP requests
// =====================================================

const axios = require('axios');

const API_URL = 'http://207.180.247.153:8081/api';

// Test data
let testPatient = null;
let testDoctor = null;
let adminToken = null;
let doctorToken = null;

async function runAPITests() {
  console.log('🧪 Starting HTTP API Tests...\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Register a new patient
    console.log('📋 Test 1: POST /api/auth/register/patient');
    try {
      const patientData = {
        email: `patient.${Date.now()}@test.com`,
        password: 'TestPass123!',
        first_name: 'John',
        last_name: 'Smith',
        phone: '+1-555-111-2222',
        date_of_birth: '1992-03-15',
        gender: 'male',
        address: {
          street: '789 Maple St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'USA'
        },
        emergency_contact: {
          name: 'Jane Smith',
          phone: '+1-555-222-3333',
          relationship: 'Spouse'
        },
        insurance: {
          provider: 'UnitedHealthcare',
          policy_number: 'UHC123456',
          group_number: 'GRP999'
        },
        consent_to_terms: true,
        consent_to_privacy: true,
        hipaa_consent: true
      };

      const response = await axios.post(`${API_URL}/auth/register/patient`, patientData);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Message: ${response.data.message}`);
      console.log(`   ✅ Patient ID: ${response.data.data.id}`);
      testPatient = response.data.data;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
    }

    // Test 2: Register a new doctor
    console.log('\n📋 Test 2: POST /api/auth/register/doctor');
    try {
      const doctorData = {
        email: `doctor.${Date.now()}@test.com`,
        password: 'DoctorPass123!',
        first_name: 'Emily',
        last_name: 'Williams',
        phone: '+1-555-444-5555',
        specialty: 'Internal Medicine',
        license_number: `MD${Date.now()}`,
        npi_number: 'NPI1234567890',
        medical_school: 'Yale School of Medicine',
        graduation_year: 2015,
        years_of_experience: 10,
        bio: 'Internal medicine specialist',
        consultation_fee: 175.00,
        languages_spoken: ['English'],
        board_certifications: ['American Board of Internal Medicine'],
        consent_to_terms: true,
        consent_to_privacy: true,
        hipaa_consent: true
      };

      const response = await axios.post(`${API_URL}/auth/register/doctor`, doctorData);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Message: ${response.data.message}`);
      console.log(`   ✅ Doctor ID: ${response.data.data.id}`);
      console.log(`   ✅ Verification Status: ${response.data.data.verification_status}`);
      testDoctor = response.data.data;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
    }

    // Test 3: Login with existing admin
    console.log('\n📋 Test 3: POST /api/auth/login (Admin)');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@telehealth.com',
        password: 'Admin123!'
      });
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Message: ${response.data.message}`);
      console.log(`   ✅ Token: ${response.data.data.token.substring(0, 30)}...`);
      console.log(`   ✅ User: ${response.data.data.user.first_name} ${response.data.data.user.last_name}`);
      console.log(`   ✅ Role: ${response.data.data.user.user_type}`);
      adminToken = response.data.data.token;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
    }

    // Test 4: Login with verified doctor
    console.log('\n📋 Test 4: POST /api/auth/login (Doctor)');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'dr.johnson@telehealth.com',
        password: 'Doctor123!'
      });
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Token: ${response.data.data.token.substring(0, 30)}...`);
      console.log(`   ✅ User: Dr. ${response.data.data.user.last_name}`);
      console.log(`   ✅ Specialty: ${response.data.data.user.specialty}`);
      console.log(`   ✅ Rating: ${response.data.data.user.average_rating}⭐`);
      doctorToken = response.data.data.token;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
    }

    // Test 5: Get current user info
    console.log('\n📋 Test 5: GET /api/auth/me (with admin token)');
    if (adminToken) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   ✅ User ID: ${response.data.data.id}`);
        console.log(`   ✅ Email: ${response.data.data.email}`);
        console.log(`   ✅ Name: ${response.data.data.first_name} ${response.data.data.last_name}`);
        console.log(`   ✅ Type: ${response.data.data.user_type}`);
        console.log(`   ✅ Admin Level: ${response.data.data.admin_level}`);
      } catch (err) {
        console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
      }
    } else {
      console.log(`   ⚠️  Skipped - no admin token`);
    }

    // Test 6: Attempt login with wrong password
    console.log('\n📋 Test 6: POST /api/auth/login (Wrong password)');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@telehealth.com',
        password: 'WrongPassword!'
      });
      console.log(`   ❌ Unexpected: Login succeeded`);
    } catch (err) {
      console.log(`   ✅ Login blocked: ${err.response?.data?.message || err.message}`);
    }

    // Test 7: Attempt access without token
    console.log('\n📋 Test 7: GET /api/auth/me (without token)');
    try {
      await axios.get(`${API_URL}/auth/me`);
      console.log(`   ❌ Unexpected: Access granted`);
    } catch (err) {
      console.log(`   ✅ Access denied: ${err.response?.data?.message || err.message}`);
    }

    // Test 8: Logout
    console.log('\n📋 Test 8: POST /api/auth/logout');
    if (adminToken) {
      try {
        const response = await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   ✅ Message: ${response.data.message}`);
      } catch (err) {
        console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
      }
    } else {
      console.log(`   ⚠️  Skipped - no admin token`);
    }

    // Test 9: Attempt to use token after logout
    console.log('\n📋 Test 9: GET /api/auth/me (after logout)');
    if (adminToken) {
      try {
        await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        console.log(`   ⚠️  Token still valid (session deleted but JWT not expired)`);
      } catch (err) {
        console.log(`   ✅ Access denied: ${err.response?.data?.message || err.message}`);
      }
    }

    console.log('\n✅ All HTTP API tests completed!\n');

    // Summary
    console.log('📊 Summary:');
    console.log(`   - New patients registered: ${testPatient ? '1' : '0'}`);
    console.log(`   - New doctors registered: ${testDoctor ? '1' : '0'}`);
    console.log(`   - Admin login: ${adminToken ? 'Success' : 'Failed'}`);
    console.log(`   - Doctor login: ${doctorToken ? 'Success' : 'Failed'}`);

  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
  }
}

// Run if called directly
if (require.main === module) {
  runAPITests();
}

module.exports = { runAPITests };
