// Simple database test
const r = require('rethinkdbdash')({
  host: '207.180.247.153',
  port: 28015,
  db: 'telehealth_db_db',
  password: 'Cosinesine900**',
});

async function test() {
  try {
    console.log('Connecting to database...');
    const tables = await r.db('telehealth_db_db').tableList().run();
    console.log('Tables:', tables);

    if (tables.includes('users')) {
      const doctors = await r.table('users').filter({ user_type: 'doctor' }).run();
      console.log('Doctors found:', doctors.length);
      console.log('First doctor:', doctors[0]);
    } else {
      console.log('Users table not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

test();