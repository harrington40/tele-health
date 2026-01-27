const { connect, r } = require('./database/connection');

async function test() {
    try {
        console.log('Connecting via auth service connection...');
        const conn = await connect();
        console.log('Connected successfully');
        const tables = await r.tableList().run(conn);
        console.log('Tables:', tables);
        return true;
    } catch (err) {
        console.error('Connection failed:', err.message);
        return false;
    }
}

test().then(success => {
    process.exit(success ? 0 : 1);
}).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});