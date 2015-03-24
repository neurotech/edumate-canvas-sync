'use strict';

var schedule = require('node-schedule');
var moment = require('moment');

var program = require('./lib/cli');
var edumate = require('./lib/edumate');

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });