'use strict';

const relay = require('rollbar-relay');
const config = require('./config');
const log = require('./lib/log');
const datasets = require('./datasets');
const timetable = require('./lib/timetable');
const server = require('./lib/hapi');

relay.info(`Started edumate-canvas-sync | Canvas Domain: ${config.canvas.domain} | Edumate Connection: ${config.edumate.username}@${config.edumate.host}:${config.edumate.port}/${config.edumate.suffix}`);

server.start(() => {
  log(`hapi server up - version: ${server.version}`);
});

// Iterate over the keys in the datasets object
for (var set in datasets) {
  if (datasets.hasOwnProperty(set)) {
    // Pass each returned object to ./timetable.js
    timetable.job(datasets[set])
      .then((results) => {}, (error) => {
        relay.error(error);
      });
    log(`Scheduled Job: ${datasets[set].dataset}`);
  }
}
