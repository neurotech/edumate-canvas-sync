var path = require('path');
var config = {};

// Canvas Variables
var domain = 'ORGANISATION.instructure.com';
var token = 'SECRET';

config.http = {
  host: 'localhost',
  port: 3000
};

config.canvas = {
  auth: { 'Authorization': 'Bearer ' + token },
  api: {
    sis: {
      get: 'https://' + domain + '/api/v1/accounts/self/sis_imports/',
      post: 'https://' + domain + '/api/v1/accounts/self/sis_imports.json?import_type=instructure_csv'
    }
  }
};

config.edumate = {
  host: 'HOST',
  port: 'PORT',
  suffix: '/PATH',
  username: 'USERNAME',
  password: 'SECRET'
};

config.init = {
  libpath: './drivers/db2jcc.jar',
  drivername: 'com.ibm.db2.jcc.DB2Driver',
  url: 'jdbc:' + 'db2://' + config.edumate.host + ':' + config.edumate.port + config.edumate.suffix + ':user=' + config.edumate.username + ';password=' + config.edumate.password + ';'
};

config.csv = {
  path: path.join(__dirname, '/csv/')
};

config.cache = {
  value: 5,
  units: 'minutes',
  path: path.join(__dirname, '/cache/')
};

module.exports = config;
