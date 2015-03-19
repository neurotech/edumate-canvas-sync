var program = require('commander');
var schedule = require('node-schedule');
var moment = require('moment');
var canvas = require('./lib/canvas');

program
  .command('upload [csv]')
  .description('Upload CSV as new SIS Import job.')
  .action(function(csv){
    canvas.sisUpload(csv);
  });

program
  .command('status')
  .description('Check Canvas SIS Import status.')
  .action(function(){
    canvas.sisStatus()
      .then(function(data) {
        console.log(data);
      }, function(error) {
        console.error(error);
    });
  });

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });
