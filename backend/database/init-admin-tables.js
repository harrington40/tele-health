// Initialize admin-related database tables
const { r, connect, getConnection } = require('./connection');

async function initializeAdminTables() {
  try {
    await connect();
    const connection = getConnection();
    
    console.log('Initializing admin database tables...\n');

    // Create admin_activity_logs table
    try {
      await r.tableCreate('admin_activity_logs').run(connection);
      console.log('✅ Created table: admin_activity_logs');
      
      // Create indexes
      await r.table('admin_activity_logs').indexCreate('admin_id').run(connection);
      await r.table('admin_activity_logs').indexCreate('timestamp').run(connection);
      console.log('✅ Created indexes for admin_activity_logs');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⚠️  Table admin_activity_logs already exists');
      } else {
        throw err;
      }
    }

    // Create verification_history table
    try {
      await r.tableCreate('verification_history').run(connection);
      console.log('✅ Created table: verification_history');
      
      // Create indexes
      await r.table('verification_history').indexCreate('user_id').run(connection);
      await r.table('verification_history').indexCreate('admin_id').run(connection);
      await r.table('verification_history').indexCreate('timestamp').run(connection);
      console.log('✅ Created indexes for verification_history');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⚠️  Table verification_history already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Admin database tables initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin tables:', error);
    process.exit(1);
  }
}

initializeAdminTables();
