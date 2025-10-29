// RethinkDB table creation for Reviews
module.exports = function(r) {
  return r.tableCreate('reviews');
};
