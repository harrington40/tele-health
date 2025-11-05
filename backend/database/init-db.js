// =====================================================
// Database Initialization Script
// Run this to set up RethinkDB tables and sample data
// =====================================================

const { connect, close } = require('./connection');
const { setupUserSchema, insertSampleData } = require('./user_schema');

async function initializeDatabase() {
  let connection = null;

  try {
    console.log('🚀 Starting database initialization...\n');

    // Connect to RethinkDB
    connection = await connect();

    // Set up user schema (tables and indexes)
    console.log('\n📋 Setting up user schema...');
    await setupUserSchema(connection);

    // Insert sample data
    console.log('\n📝 Inserting sample data...');
    await insertSampleData(connection);

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📊 Sample users created:');
    console.log('   Admin: admin@telehealth.com (password: Admin123!)');
    console.log('   Doctor: dr.johnson@telehealth.com (password: Doctor123!)');
    console.log('   Patient: john.doe@example.com (password: Patient123!)');

  } catch (err) {
    console.error('\n❌ Database initialization failed:', err);
    process.exit(1);
  } finally {
    // Close connection
    if (connection) {
      await close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
