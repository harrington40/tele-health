// =====================================================
// Test Database Queries
// Run this to test RethinkDB operations
// =====================================================

const { connect, close, r } = require('./connection');

async function testQueries() {
  let connection = null;

  try {
    console.log('🧪 Starting database query tests...\n');

    // Connect to RethinkDB
    connection = await connect();

    // Test 1: Find all users
    console.log('📋 Test 1: Find all users');
    const allUsers = await r.table('users').run(connection);
    const usersArray = await allUsers.toArray();
    console.log(`   ✅ Found ${usersArray.length} users`);
    usersArray.forEach(user => {
      console.log(`      - ${user.email} (${user.user_type}) - ${user.verification_status}`);
    });

    // Test 2: Find user by email
    console.log('\n📋 Test 2: Find user by email');
    const userByEmail = await r.table('users')
      .filter({ email: 'dr.johnson@telehealth.com' })
      .limit(1)
      .run(connection);
    const emailResult = await userByEmail.toArray();
    if (emailResult.length > 0) {
      console.log(`   ✅ Found: ${emailResult[0].first_name} ${emailResult[0].last_name}`);
      console.log(`      Specialty: ${emailResult[0].specialty}`);
      console.log(`      Rating: ${emailResult[0].average_rating}`);
    }

    // Test 3: Find all verified doctors
    console.log('\n📋 Test 3: Find all verified doctors');
    const verifiedDoctors = await r.table('users')
      .filter({
        user_type: 'doctor',
        verification_status: 'verified',
        is_active: true
      })
      .run(connection);
    const doctorsArray = await verifiedDoctors.toArray();
    console.log(`   ✅ Found ${doctorsArray.length} verified doctors`);
    doctorsArray.forEach(doc => {
      console.log(`      - Dr. ${doc.last_name} (${doc.specialty}) - ${doc.average_rating}⭐`);
    });

    // Test 4: Find doctors by specialty
    console.log('\n📋 Test 4: Find doctors by specialty (Cardiology)');
    const cardiologists = await r.table('users')
      .filter({
        user_type: 'doctor',
        specialty: 'Cardiology',
        verification_status: 'verified'
      })
      .orderBy(r.desc('average_rating'))
      .run(connection);
    const cardioArray = await cardiologists.toArray();
    console.log(`   ✅ Found ${cardioArray.length} cardiologists`);

    // Test 5: Update user profile
    console.log('\n📋 Test 5: Update user profile');
    const patientCursor = await r.table('users')
      .filter({ user_type: 'patient' })
      .limit(1)
      .run(connection);
    const patients = await patientCursor.toArray();
    
    if (patients.length > 0) {
      const patientId = patients[0].id;
      await r.table('users')
        .get(patientId)
        .update({
          phone: '+1-555-999-8888',
          updated_at: r.now()
        })
        .run(connection);
      console.log(`   ✅ Updated patient phone number`);

      // Verify update
      const updated = await r.table('users').get(patientId).run(connection);
      console.log(`      New phone: ${updated.phone}`);
    }

    // Test 6: Insert activity log
    console.log('\n📋 Test 6: Insert activity log');
    const activityResult = await r.table('user_activity_log')
      .insert({
        user_id: usersArray[0].id,
        activity_type: 'test_query',
        description: 'Testing database queries',
        metadata: { test: true },
        created_at: r.now()
      })
      .run(connection);
    console.log(`   ✅ Inserted activity log`);

    // Test 7: Get activity logs for a user
    console.log('\n📋 Test 7: Get activity logs');
    const activityLogs = await r.table('user_activity_log')
      .filter({ user_id: usersArray[0].id })
      .orderBy(r.desc('created_at'))
      .limit(5)
      .run(connection);
    const logsArray = await activityLogs.toArray();
    console.log(`   ✅ Found ${logsArray.length} activity logs`);
    logsArray.forEach(log => {
      console.log(`      - ${log.activity_type}: ${log.description}`);
    });

    // Test 8: Count users by type
    console.log('\n📋 Test 8: Count users by type');
    const adminCount = await r.table('users').filter({ user_type: 'admin' }).count().run(connection);
    const doctorCount = await r.table('users').filter({ user_type: 'doctor' }).count().run(connection);
    const patientCount = await r.table('users').filter({ user_type: 'patient' }).count().run(connection);
    console.log(`   ✅ Admins: ${adminCount}, Doctors: ${doctorCount}, Patients: ${patientCount}`);

    // Test 9: Test compound index
    console.log('\n📋 Test 9: Test compound index (user_type + verification_status)');
    const verifiedPatients = await r.table('users')
      .getAll(['patient', 'verified'], { index: 'user_type_status' })
      .run(connection);
    const verifiedPatientsArray = await verifiedPatients.toArray();
    console.log(`   ✅ Found ${verifiedPatientsArray.length} verified patients using compound index`);

    // Test 10: Test session creation
    console.log('\n📋 Test 10: Create test session');
    const sessionResult = await r.table('user_sessions')
      .insert({
        user_id: usersArray[0].id,
        token: 'test-jwt-token-' + Date.now(),
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: r.now()
      })
      .run(connection);
    console.log(`   ✅ Created test session`);

    // Test 11: Find active sessions
    console.log('\n📋 Test 11: Find active sessions');
    const now = new Date().toISOString();
    const activeSessions = await r.table('user_sessions')
      .filter(r.row('expires_at').gt(now))
      .run(connection);
    const sessionsArray = await activeSessions.toArray();
    console.log(`   ✅ Found ${sessionsArray.length} active sessions`);

    // Test 12: Complex query - doctors with ratings above 4.5
    console.log('\n📋 Test 12: Find top-rated doctors (rating > 4.5)');
    const topDoctors = await r.table('users')
      .filter(r.row('user_type').eq('doctor')
        .and(r.row('average_rating').gt(4.5))
        .and(r.row('verification_status').eq('verified')))
      .orderBy(r.desc('average_rating'))
      .run(connection);
    const topDoctorsArray = await topDoctors.toArray();
    console.log(`   ✅ Found ${topDoctorsArray.length} top-rated doctors`);
    topDoctorsArray.forEach(doc => {
      console.log(`      - Dr. ${doc.last_name}: ${doc.average_rating}⭐ (${doc.total_reviews} reviews)`);
    });

    console.log('\n✅ All database query tests completed successfully!');

  } catch (err) {
    console.error('\n❌ Query test failed:', err);
  } finally {
    // Close connection
    if (connection) {
      await close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  testQueries();
}

module.exports = { testQueries };
