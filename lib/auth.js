'use strict';

const relay = require('rollbar-relay');
var auth = {};

var people = {
  id: 1337,
  name: 'Manual Sync'
};

auth.validate = (decoded, request, callback) => {
  if (decoded.id !== people.id) {
    var critical = `Unauthorised attempt to request a manual sync by ${request.info.remoteAddress}!`;
    var custom = {
      url: `${request.connection.info.protocol}://${request.info.host}/${request.url.path}`,
      decoded: decoded
    };
    relay.critical(critical, custom);
    return callback(null, false);
  } else {
    return callback(null, true);
  }
};

module.exports = auth;
