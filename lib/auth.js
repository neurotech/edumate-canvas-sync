const relay = require('rollbar-relay');
var auth = {};

var people = {
  id: 1337,
  name: 'Manual Sync'
};

auth.validate = (decoded, request, cb) => {
  if (decoded.id !== people.id) {
    var critical = new Error(`Unauthorised attempt to request a manual sync by ${request.info.remoteAddress}!`);
    var custom = {
      url: `${request.connection.info.protocol}://${request.info.host}${request.url.path}`,
      decoded: decoded
    };
    relay.critical(critical, custom);
    return cb(null, false);
  } else {
    return cb(null, true);
  }
};

module.exports = auth;
