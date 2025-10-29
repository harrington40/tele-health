// RethinkDB table creation for Video Sessions
module.exports = function(r) {
  return r.tableCreate('video_sessions');
};
