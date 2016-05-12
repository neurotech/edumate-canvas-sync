'use strict';

var auth = {};

var people = {
  id: 1337,
  name: 'Manual Sync'
};

auth.validate = (decoded, request, callback) => {
  if (decoded.id !== people.id) {
    // TODO: Log to rollbar
    return callback(null, false);
  } else {
    return callback(null, true);
  }
};

module.exports = auth;
