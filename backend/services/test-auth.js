// =====================================================
// Test Authentication Service
// Run this to test registration, login, and email verification
// =====================================================

const { connect, close } = require('../database/connection');
const authService = require('./authService');

async function testAuthService() {
  let connection = null;

  try {
    console.log('🧪 Starting authentication service tests...\n');

    // Connect to RethinkDB
    connection = await connect();

    // Test 1: Register a new patient
    console.log('📋 Test 1: Register a new patient');
    try {
      const patientData = {
        email: 'test.patient@example.com',
        password: 'TestPatient123!',
        first_name: 'Test',
        last_name: 'Patient',
        phone: '+1-555-111-2222',
        date_of_birth: '1995-05-15',
        gender: 'male',
        address: {
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA'
        },
        emergency_contact: {
          name: 'Emergency Contact',
          phone: '+1-555-999-0000',
          relationship: 'Parent'
        },
        insurance: {
          provider: 'Aetna',
          policy_number: 'AET987654321',
          group_number: 'GRP456'
        },
        consent_to_terms: true,
        consent_to_privacy: true,
        hipaa_consent: true
      };

      const patientResult = await authService.registerPatient(patientData);
      console.log(`   ✅ Patient registered: ${patientResult.email}`);
      console.log(`      ID: ${patientResult.id}`);
      console.log(`      Verification Token: ${patientResult.email_verification_token.substring(0, 20)}...`);
      
      // Store for later tests
      global.testPatientToken = patientResult.email_verification_token;
      global.testPatientEmail = patientResult.email;
    } catch (err) {
      if (err.message.includes('already registered')) {
        console.log(`   ⚠️  Patient already exists, skipping`);
        global.testPatientEmail = 'test.patient@example.com';
      } else {
        throw err;
      }
    }

    // Test 2: Register a new doctor
    console.log('\n📋 Test 2: Register a new doctor');
    try {
      const doctorData = {
        email: 'test.doctor@telehealth.com',
        password: 'TestDoctor123!',
        first_name: 'Test',
        last_name: 'Doctor',
        phone: '+1-555-222-3333',
        date_of_birth: '1988-08-20',
        gender: 'female',
        specialty: 'Pediatrics',
        license_number: 'MD98765',
        npi_number: 'NPI9876543210',
        medical_school: 'Stanford Medical School',
        graduation_year: 2012,
        years_of_experience: 13,
        bio: 'Board-certified pediatrician specializing in child development.',
        consultation_fee: 120.00,
        languages_spoken: ['English', 'French'],
        board_certifications: ['American Board of Pediatrics'],
        consent_to_terms: true,
        consent_to_privacy: true,
        hipaa_consent: true
      };

      const doctorResult = await authService.registerDoctor(doctorData);
      console.log(`   ✅ Doctor registered: ${doctorResult.email}`);
      console.log(`      ID: ${doctorResult.id}`);
      console.log(`      Verification Status: ${doctorResult.verification_status}`);
      console.log(`      Email Token: ${doctorResult.email_verification_token.substring(0, 20)}...`);
      
      global.testDoctorToken = doctorResult.email_verification_token;
      global.testDoctorEmail = doctorResult.email;
    } catch (err) {
      if (err.message.includes('already registered')) {
        console.log(`   ⚠️  Doctor already exists, skipping`);
        global.testDoctorEmail = 'test.doctor@telehealth.com';
      } else {
        throw err;
      }
    }

    // Test 3: Verify email
    console.log('\n📋 Test 3: Verify patient email');
    if (global.testPatientToken) {
      try {
        const verifyResult = await authService.verifyEmail(global.testPatientToken);
        console.log(`   ✅ Email verified: ${verifyResult.email}`);
      } catch (err) {
        if (err.message.includes('already verified')) {
          console.log(`   ⚠️  Email already verified`);
        } else {
          throw err;
        }
      }
    } else {
      console.log(`   ⚠️  Skipping - no token available`);
    }

    // Test 4: Verify doctor email
    console.log('\n📋 Test 4: Verify doctor email');
    if (global.testDoctorToken) {
      try {
        const verifyResult = await authService.verifyEmail(global.testDoctorToken);
        console.log(`   ✅ Email verified: ${verifyResult.email}`);
      } catch (err) {
        if (err.message.includes('already verified')) {
          console.log(`   ⚠️  Email already verified`);
        } else {
          throw err;
        }
      }
    } else {
      console.log(`   ⚠️  Skipping - no token available`);
    }

    // Test 5: Login with existing verified user (admin)
    console.log('\n📋 Test 5: Login with admin credentials');
    try {
      const loginResult = await authService.login(
        'admin@telehealth.com',
        'Admin123!',
        '127.0.0.1',
        'Test-Agent/1.0'
      );
      console.log(`   ✅ Login successful`);
      console.log(`      Token: ${loginResult.token.substring(0, 30)}...`);
      console.log(`      User: ${loginResult.user.first_name} ${loginResult.user.last_name}`);
      console.log(`      Type: ${loginResult.user.user_type}`);
      
      global.testAdminToken = loginResult.token;
    } catch (err) {
      console.log(`   ❌ Login failed: ${err.message}`);
    }

    // Test 6: Login with verified doctor
    console.log('\n📋 Test 6: Login with doctor credentials');
    try {
      const loginResult = await authService.login(
        'dr.johnson@telehealth.com',
        'Doctor123!',
        '127.0.0.1',
        'Test-Agent/1.0'
      );
      console.log(`   ✅ Login successful`);
      console.log(`      Token: ${loginResult.token.substring(0, 30)}...`);
      console.log(`      User: Dr. ${loginResult.user.last_name}`);
      console.log(`      Specialty: ${loginResult.user.specialty}`);
      
      global.testDoctorLoginToken = loginResult.token;
    } catch (err) {
      console.log(`   ❌ Login failed: ${err.message}`);
    }

    // Test 7: Attempt login with unverified email
    console.log('\n📋 Test 7: Attempt login with unverified patient (should fail)');
    try {
      await authService.login(
        global.testPatientEmail || 'test.patient@example.com',
        'TestPatient123!',
        '127.0.0.1',
        'Test-Agent/1.0'
      );
      console.log(`   ❌ Unexpected: Login succeeded (should have failed)`);
    } catch (err) {
      console.log(`   ✅ Login blocked: ${err.message}`);
    }

    // Test 8: Attempt login with wrong password
    console.log('\n📋 Test 8: Attempt login with wrong password');
    try {
      await authService.login(
        'admin@telehealth.com',
        'WrongPassword123!',
        '127.0.0.1',
        'Test-Agent/1.0'
      );
      console.log(`   ❌ Unexpected: Login succeeded (should have failed)`);
    } catch (err) {
      console.log(`   ✅ Login blocked: ${err.message}`);
    }

    // Test 9: Verify token
    console.log('\n📋 Test 9: Verify JWT token');
    if (global.testAdminToken) {
      try {
        const decoded = authService.verifyToken(global.testAdminToken);
        console.log(`   ✅ Token valid`);
        console.log(`      User ID: ${decoded.id}`);
        console.log(`      Email: ${decoded.email}`);
        console.log(`      Type: ${decoded.user_type}`);
      } catch (err) {
        console.log(`   ❌ Token verification failed: ${err.message}`);
      }
    }

    // Test 10: Logout
    console.log('\n📋 Test 10: Logout');
    if (global.testAdminToken) {
      try {
        const logoutResult = await authService.logout(global.testAdminToken);
        console.log(`   ✅ ${logoutResult.message}`);
      } catch (err) {
        console.log(`   ❌ Logout failed: ${err.message}`);
      }
    }

    console.log('\n✅ All authentication service tests completed!');

  } catch (err) {
    console.error('\n❌ Authentication test failed:', err);
  } finally {
    // Close connection
    if (connection) {
      await close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  testAuthService();
}

module.exports = { testAuthService };
