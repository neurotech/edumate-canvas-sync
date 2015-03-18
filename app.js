var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('./config');
var canvas = require('./lib/canvas');

//canvas.sisUpload('staff');
canvas.sisStatus();

// node-schedule:

// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });
