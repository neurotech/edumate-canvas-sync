var path = require('path');
var schedule = require('node-schedule');
var config = {};

// Canvas Variables
var domain = 'ORGANISATION.instructure.com';
var token = 'SECRET';

config.http = {
  host: 'http://localhost',
  port: 3333
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

config.uploadSchedules = {
  test: { minute: [new schedule.Range(0,59)] },
  staff: { hour: 10, minute: 0, dayOfWeek: 4 },
  courses: { hour: 11, minute: 30, dayOfWeek: [new schedule.Range(1,5)] },
  enrolments: { hour: [new schedule.Range(8,18)], minute: 0, dayOfWeek: [new schedule.Range(1,5)] },
  accounts: { hour: 9, minute: 0, dayOfWeek: 5 }
};

config.db2 = {
  host: 'HOST',
  port: 'PORT',
  suffix: '/PATH',
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
