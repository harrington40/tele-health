const rethinkdbdash = require('rethinkdbdash');

async function testConnection() {
    console.log('Testing RethinkDB connection...');
    console.log('Host:', process.env.RETHINKDB_HOST);
    console.log('Port:', process.env.RETHINKDB_PORT);
    console.log('DB:', process.env.RETHINKDB_DB);
    console.log('AuthKey:', process.env.RETHINKDB_AUTH_KEY ? '***' : '(none)');

    const r = rethinkdbdash({
        host: process.env.RETHINKDB_HOST || '207.180.247.153',
        port: parseInt(process.env.RETHINKDB_PORT) || 28015,
        db: process.env.RETHINKDB_DB || 'telehealth_db_db',
        authKey: process.env.RETHINKDB_AUTH_KEY || '',
    });

    try {
        const tables = await r.tableList().run();
        console.log('✅ Connected successfully! Tables:', tables);
        return true;
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        return false;
    }
}

// Run test
testConnection().then(success => {
    process.exit(success ? 0 : 1);
}).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});