// Quick script to query all users from RethinkDB
const { connect, close, r } = require('./connection');

async function queryAllUsers() {
  try {
    const connection = await connect();
    
    console.log('\n📊 Querying all users from database...\n');
    
    const cursor = await r.table('users').run(connection);
    const users = await cursor.toArray();
    
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Type: ${user.user_type}`);
      console.log(`   Status: ${user.verification_status}`);
      if (user.user_type === 'doctor') {
        console.log(`   Specialty: ${user.specialty}`);
        console.log(`   License: ${user.license_number}`);
      }
      if (user.user_type === 'patient') {
        console.log(`   Blood Type: ${user.blood_type || 'N/A'}`);
        console.log(`   Insurance: ${user.insurance?.provider || 'N/A'}`);
      }
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });
    
    // Query stats
    console.log('\n📈 Statistics:');
    const adminCount = users.filter(u => u.user_type === 'admin').length;
    const doctorCount = users.filter(u => u.user_type === 'doctor').length;
    const patientCount = users.filter(u => u.user_type === 'patient').length;
    const verifiedDoctors = users.filter(u => u.user_type === 'doctor' && u.verification_status === 'verified').length;
    
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Doctors: ${doctorCount} (${verifiedDoctors} verified)`);
    console.log(`   Patients: ${patientCount}`);
    
    await close();
    
  } catch (err) {
    console.error('Error querying users:', err);
    process.exit(1);
  }
}

queryAllUsers();
