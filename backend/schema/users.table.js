// RethinkDB table creation for Users
module.exports = function(r) {
  return r.tableCreate('users');
};
