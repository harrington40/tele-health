const r = require('./services/rethinkdb');
async function test() {
    try {
        const doctors = await r.table('users').filter({user_type: 'doctor'});
        const count = await doctors.count();
        console.log('Doctors count:', count);
        const list = await doctors.limit(5);
        console.log('First doctor:', list);
    } catch (err) {
        console.error('Error:', err);
    }
}
test();