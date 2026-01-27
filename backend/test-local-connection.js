const rethinkdbdash = require('rethinkdbdash');

async function testConnection(host, authKey) {
    console.log(`Testing connection to ${host} with authKey ${authKey ? '***' : '(none)'}`);
    const r = rethinkdbdash({
        host: host,
        port: 28015,
        db: 'telehealth_db_db',
        authKey: authKey || ''
    });
    try {
        const tables = await r.tableList().run();
        console.log('✅ Success! Tables:', tables);
        return true;
    } catch (err) {
        console.error('❌ Failed:', err.message);
        return false;
    }
}

async function main() {
    console.log('Testing localhost connection...');
    // Try without auth
    const success1 = await testConnection('localhost', '');
    if (!success1) {
        // Try with auth key from env
        const authKey = process.env.RETHINKDB_AUTH_KEY;
        if (authKey) {
            console.log('Trying with auth key from env...');
            await testConnection('localhost', authKey);
        }
    }
    // Also try remote host
    console.log('Testing remote host connection...');
    await testConnection('207.180.247.153', process.env.RETHINKDB_AUTH_KEY || '');
}

main().catch(err => console.error('Unexpected error:', err));