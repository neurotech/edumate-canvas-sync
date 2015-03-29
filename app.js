'use strict';

var schedule = require('node-schedule');
var moment = require('moment');
var Acho = require('acho');

var program = require('./lib/cli');
var edumate = require('./lib/db/edumate');
var acho = new Acho({color: true});

edumate.query('network-traffic', 'SELECT * FROM DB2INST1.NETWORK_TRAFFIC', 'csv');

// edumate.query('terms', 'SELECT * FROM DB2INST1.VIEW_CANVAS_TERMS', 'csv')
//   .then(function(res) {
//     acho.success(res);
//     // next query
//     setTimeout(function() {
//       edumate.query('terms', 'SELECT * FROM DB2INST1.VIEW_CANVAS_TERMS', 'cache')
//         .then(function(res) {
//           acho.success(res);
//         }, function(err) {
//           acho.error(err);
//         });
//     }, 1500);
//   }, function(err) {
//     acho.error(err);
//   });

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });
