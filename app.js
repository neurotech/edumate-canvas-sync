var program = require('commander');
var Acho = require('acho');
var schedule = require('node-schedule');
var moment = require('moment');
var canvas = require('./lib/canvas');

var acho = new Acho({color: true});

// Command line support
program
  .command('upload [csv]')
  .description('Upload CSV as new SIS Import job.')
  .action(function(csv){
    canvas.sisUpload(csv)
      .then(function(data) {
        acho.success(data.status);
      }, function(error) {
        acho.error(error);
    });
  });

program
  .command('status')
  .description('Check Canvas SIS Import status.')
  .action(function(){
    canvas.sisStatus()
      .then(function(data) {
        console.log(data);
      }, function(error) {
        acho.error(error);
    });
  });

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });
