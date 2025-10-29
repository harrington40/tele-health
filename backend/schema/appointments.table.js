// RethinkDB table creation for Appointments
module.exports = function(r) {
  return r.tableCreate('appointments');
};
