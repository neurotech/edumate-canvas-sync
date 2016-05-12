'use strict';

const relay = require('rollbar-relay');
const config = require('./config');
const datasets = require('./datasets');
const timetable = require('./lib/timetable');
const server = require('./lib/hapi');

relay.info(`Starting edumate-canvas-sync | Canvas Domain: ${config.canvas.domain} | Edumate Connection: ${config.edumate.username}@${config.edumate.host}:${config.edumate.port}/${config.edumate.suffix}`);

server.start(() => {
  var announce = `hapi server up - version: ${server.version}`;
  relay.info(announce);
});

// Iterate over datasets and pass each one to timetable
for (var set in datasets) {
  if (datasets.hasOwnProperty(set)) {
    timetable.job(datasets[set])
      .then((results) => {}, (error) => {
        relay.error(error);
      });
    relay.info(`Scheduled Job: ${datasets[set].dataset}`);
  }
}
