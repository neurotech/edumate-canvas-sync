var path = require('path');
var config = {};

// Canvas Variables
var domain = 'YOUR-ORGANISATION-HERE.instructure.com';
var token = 'SECRET';

config.http = {
  host: 'http://localhost',
  port: 3333
};

config.canvas = {
  auth: { 'Authorization': 'Bearer ' + token },
  upload: 'https://' + domain + '/api/v1/accounts/self/sis_imports.json?import_type=instructure_csv',
  uploadStatus: 'https://' + domain + '/api/v1/accounts/self/sis_imports/'
};

config.db2 = {
  host: 'HOSTNAME',
  port: 'PORT',
  suffix: '/SUFFIX',
  username: 'USERNAME',
  password: 'SECRET'
};

config.init = {
  libpath: './drivers/db2jcc.jar',
  drivername: 'com.ibm.db2.jcc.DB2Driver',
  url: 'jdbc:' + 'db2://' + config.db2.host + ':' + config.db2.port + config.db2.suffix + ':user=' + config.db2.username + ';password=' + config.db2.password + ';'
};

config.cache = {
  value: 5,
  units: 'minutes',
  path: path.join(__dirname, '/db/')
};

module.exports = config;
