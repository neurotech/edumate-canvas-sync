const relay = require('rollbar-relay');
const config = require('./config');
const log = require('./lib/log');
const datasets = require('./datasets');
const timetable = require('./lib/timetable');
const server = require('./lib/hapi');

// Send a info event to Rollbar with environment-specific information
relay.info(`Started edumate-canvas-sync.`, {
  canvas: config.canvas.domain,
  edumate: {
    host: config.edumate.host,
    port: config.edumate.port,
    suffix: config.edumate.suffix,
    username: config.edumate.username
  }
});

// Log environment-specific information locally
log(`Canvas Domain: ${config.canvas.domain}`);
log(`Edumate Host: ${config.edumate.host}`);
log(`Edumate Port: ${config.edumate.port}`);
log(`Edumate Suffix: ${config.edumate.suffix}`);
log(`Edumate Username: ${config.edumate.username}`);

// Start the hapi server and log to console
server.start(() => { log(`hapi server up - version: ${server.version}`); });

// Iterate over the keys in the datasets object
for (var set in datasets) {
  if (datasets.hasOwnProperty(set)) {
    timetable.job(datasets[set], (err) => {
      if (err) {
        log(`Error: ${err}`);
        relay.error(err);
      }
      log(`Scheduled Job: ${datasets[set].dataset}`);
    });
  }
}
