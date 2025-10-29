// RethinkDB table creation for Services
module.exports = function(r) {
  return r.tableCreate('services');
};
