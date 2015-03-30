'use strict';

var path = require('path');
var config = {};

/* Canvas Credentials */
var domain = 'ORGANISATION.instructure.com';
var token = 'SECRET';

/* Edumate Credentials */
config.edumate = {
  host: 'HOST',
  port: 'PORT',
  suffix: '/PATH',
  username: 'USERNAME',
  password: 'SECRET'
};

/* Canvas API */
config.canvas = {
  auth: { 'Authorization': 'Bearer ' + token },
  api: {
    sis: {
      get: 'https://' + domain + '/api/v1/accounts/self/sis_imports/',
      post: 'https://' + domain + '/api/v1/accounts/self/sis_imports.json?import_type=instructure_csv'
    }
  }
};

/* jdbc Initialisation Object */
config.init = {
  libpath: path.join(__dirname, '/drivers/db2jcc.jar'),
  drivername: 'com.ibm.db2.jcc.DB2Driver',
  url: 'jdbc:' + 'db2://' + config.edumate.host + ':' + config.edumate.port + config.edumate.suffix + ':user=' + config.edumate.username + ';password=' + config.edumate.password + ';'
};

module.exports = config;