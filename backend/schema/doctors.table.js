// RethinkDB table creation for Doctors
module.exports = function(r) {
  return r.tableCreate('doctors');
};
