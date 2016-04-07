'use strict';

const moment = require('moment');
const config = require('./config');
const datasets = require('./datasets');
const timetable = require('./lib/timetable');

var today = moment().format('DD/MM/YY');
var now = moment().format('HH:mm:ss');

console.log(`
  ----------------------------
  Starting edumate-canvas-sync
  Date: ${today}
  Time: ${now}
  Canvas Domain: ${config.canvas.domain}
  Edumate Connection: ${config.edumate.username}@${config.edumate.host}:${config.edumate.port}/${config.edumate.suffix}
  ----------------------------
`);

// Iterate over datasets and pass each one to timetable
for (var key in datasets) {
  if (datasets.hasOwnProperty(key)) {
    timetable.job(datasets[key])
      .then((results) => {
        console.log(results);
        console.log(`SIS Upload #${results.id} (${results.dataset}) started on ${results.local_date} at ${results.local_time}.`);
      }, (error) => {
        console.error({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        });
      });
    console.log(`Scheduled Job: ${datasets[key].dataset}`);
  }
}

process.on('uncaughtException', (err) => {
  console.error({
    fatal: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  });
  process.exit(1);
});
