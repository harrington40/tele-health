const r = require('rethinkdb');
const config = {
  host: '207.180.247.153',
  port: 28015,
  authKey: 'Cosinesine900**'
};
async function check() {
  const conn = await r.connect(config);
  const dbList = await r.dbList().run(conn);
  console.log('Databases:', dbList);
  for (const dbName of dbList) {
    console.log(`\nDatabase: ${dbName}`);
    const tables = await r.db(dbName).tableList().run(conn).catch(e => console.error('  error:', e.message));
    console.log('  Tables:', tables);
  }
  conn.close();
}
check().catch(console.error);