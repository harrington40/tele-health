const r = require('rethinkdb');
const config = {
  host: 'localhost',
  port: 28015,
  db: 'telehealth_db_db',
  authKey: ''
};
console.log('Connecting to local RethinkDB...');
r.connect(config, (err, conn) => {
  if (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected');
  r.tableList().run(conn, (err, tables) => {
    if (err) {
      console.error('Error listing tables:', err.message);
      process.exit(1);
    }
    console.log('Tables:', tables);
    conn.close();
    process.exit(0);
  });
});