process.env.RETHINKDB_AUTH_KEY = 'Cosinesine900';
const r = require('rethinkdbdash')({
  host: '207.180.247.153',
  port: 28015,
  db: 'telehealth_db_db',
  authKey: process.env.RETHINKDB_AUTH_KEY || ''
});
console.log('Testing connection with auth key:', process.env.RETHINKDB_AUTH_KEY);
r.tableList().then(tables => {
  console.log('Tables:', tables);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});