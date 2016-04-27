'use strict';

const relay = require('rollbar-relay');
const config = require('./config');
const datasets = require('./datasets');
const timetable = require('./lib/timetable');

relay.info(`Starting edumate-canvas-sync | Canvas Domain: ${config.canvas.domain} | Edumate Connection: ${config.edumate.username}@${config.edumate.host}:${config.edumate.port}/${config.edumate.suffix}`);

// Iterate over datasets and pass each one to timetable
for (var key in datasets) {
  if (datasets.hasOwnProperty(key)) {
    timetable.job(datasets[key])
      .then((results) => {}, (error) => {
        relay.error(error);
      });
    relay.info(`Scheduled Job: ${datasets[key].dataset}`);
  }
}
