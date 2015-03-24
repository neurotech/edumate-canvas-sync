'use strict';

var schedule = require('node-schedule');
var moment = require('moment');
var Acho = require('acho');

var program = require('./lib/cli');
var edumate = require('./lib/db/edumate');
var acho = new Acho({color: true});

edumate.query('staff', 'SELECT * FROM DB2INST1.view_canvas_staff_users ORDER BY login_id')
  .then(function(res) {
    acho.info(res);
  });

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });