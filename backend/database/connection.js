// =====================================================
// RethinkDB Connection Module
// =====================================================

const r = require('rethinkdb');

const dbConfig = {
  host: 'api.transtechologies.com',
  port: 28015,
  db: 'telehealth',
  authKey: '' // Add auth key if required
};

let connection = null;

/**
 * Connect to RethinkDB
 */
async function connect() {
  try {
    if (connection) {
      return connection;
    }

    connection = await r.connect(dbConfig);
    console.log('✅ Connected to RethinkDB at', dbConfig.host);

    // Create database if it doesn't exist
    try {
      await r.dbCreate(dbConfig.db).run(connection);
      console.log(`✅ Created database: ${dbConfig.db}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`⚠️  Database ${dbConfig.db} already exists`);
      } else {
        throw err;
      }
    }

    // Switch to the database
    connection.use(dbConfig.db);

    return connection;
  } catch (err) {
    console.error('❌ Failed to connect to RethinkDB:', err.message);
    throw err;
  }
}

/**
 * Close connection
 */
async function close() {
  if (connection) {
    await connection.close();
    connection = null;
    console.log('✅ Closed RethinkDB connection');
  }
}

/**
 * Get current connection
 */
function getConnection() {
  return connection;
}

module.exports = {
  connect,
  close,
  getConnection,
  r
};
