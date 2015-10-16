'use strict';

require('dotenv').load();

var chalk = require('chalk');
var moment = require('moment');

var datasets = require('./datasets');
var timetable = require('./lib/timetable');

var today = chalk.magenta(moment().format('DD/MM/YY'));
var now = chalk.yellow(moment().format('HH:mm:ss'));

console.log('Starting ' + chalk.green('edumate-canvas-sync') + ' on ' + today + ' at ' + now);
console.log(chalk.red('Canvas: ') + process.env.CANVAS_API_DOMAIN);
console.log(chalk.blue('Edumate: ') + process.env.EDUMATE_USERNAME + '@' + process.env.EDUMATE_HOST + ':' + process.env.EDUMATE_PORT + '/' + process.env.EDUMATE_PATH);

// Iterate over datasets and pass each one to timetable
for (var key in datasets) {
  if (datasets.hasOwnProperty(key)) {
    console.log('Scheduled job: ' + datasets[key].dataset);

    timetable.job(datasets[key])
      .then(function (results) {}, function (error) {
        console.error(error);
      });
  }
}