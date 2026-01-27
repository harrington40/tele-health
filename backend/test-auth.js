const r = require('./services/rethinkdb');

async function test() {
    try {
        console.log('Testing connection with current auth key...');
        const tables = await r.tableList().run();
        console.log('Success! Tables:', tables);
        return true;
    } catch (err) {
        console.error('Connection failed:', err.message);
        // Try without auth key
        console.log('Trying without auth key...');
        const rethinkdbdash = require('rethinkdbdash');
        const r2 = rethinkdbdash({
            host: process.env.RETHINKDB_HOST || '207.180.247.153',
            port: parseInt(process.env.RETHINKDB_PORT) || 28015,
            db: process.env.RETHINKDB_DB || 'telehealth_db_db',
            authKey: ''
        });
        try {
            const tables2 = await r2.tableList().run();
            console.log('Success without auth key! Tables:', tables2);
            return true;
        } catch (err2) {
            console.error('Failed without auth key:', err2.message);
            return false;
        }
    }
}

test().then(success => {
    console.log(success ? 'Connection test passed' : 'Connection test failed');
    process.exit(success ? 0 : 1);
}).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});