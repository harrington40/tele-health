const r = require('rethinkdbdash')({
  host: '207.180.247.153',
  port: 28015,
  db: 'telehealth_db_db',
  authKey: 'Cosinesine900**'
});

async function test() {
  try {
    console.log('Testing with password: Cosinesine900**');
    const tables = await r.tableList();
    console.log('Success! Tables:', tables);
    return true;
  } catch (err) {
    console.error('Error with first password:', err.message);
    return false;
  }
}

async function test2() {
  const r2 = require('rethinkdbdash')({
    host: '207.180.247.153',
    port: 28015,
    db: 'telehealth_db_db',
    authKey: 'Cosinesineine900**'
  });
  try {
    console.log('Testing with password: Cosinesineine900**');
    const tables = await r2.tableList();
    console.log('Success! Tables:', tables);
    return true;
  } catch (err) {
    console.error('Error with second password:', err.message);
    return false;
  }
}

async function run() {
  const success1 = await test();
  if (!success1) {
    await test2();
  }
  process.exit(0);
}

run().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});