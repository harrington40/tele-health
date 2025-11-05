// Update user passwords with proper bcrypt hashing
const bcrypt = require('bcrypt');
const { r, connect, getConnection } = require('./connection');

const SALT_ROUNDS = 10;

const users = [
  { email: 'admin@telehealth.com', password: 'Admin123!' },
  { email: 'dr.johnson@telehealth.com', password: 'Doctor123!' },
  { email: 'john.doe@example.com', password: 'Patient123!' }
];

async function updatePasswords() {
  try {
    await connect();
    const connection = getConnection();
    
    console.log('Updating user passwords...\n');
    
    for (const user of users) {
      // Hash the password
      const password_hash = await bcrypt.hash(user.password, SALT_ROUNDS);
      
      // Update the user
      const result = await r.table('users')
        .filter({ email: user.email })
        .update({ password_hash })
        .run(connection);
      
      if (result.replaced > 0) {
        console.log(`✅ Updated password for ${user.email}`);
      } else {
        console.log(`⚠️  User not found: ${user.email}`);
      }
    }
    
    console.log('\n✅ Password update complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords();
