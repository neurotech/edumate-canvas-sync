'use strict';

var schedule = require('node-schedule');
var moment = require('moment');
var Acho = require('acho');

var program = require('./lib/cli');
var edumate = require('./lib/db/edumate');
var datasets = require('./datasets');
var acho = new Acho({color: true});

edumate.query(datasets.terms.name, datasets.terms.sql);

program.parse(process.argv);

/*
node-schedule:
--------------
schedule.scheduleJob(config.uploadSchedules.test, function(){
  console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
});
*/