// RethinkDB connection singleton
const rethinkdbdash = require('rethinkdbdash');

const r = rethinkdbdash({
  host: process.env.RETHINKDB_HOST || '207.180.247.153',
  port: process.env.RETHINKDB_PORT || 28015,
  db: process.env.RETHINKDB_DB || 'telehealth_db',
});

module.exports = r;
