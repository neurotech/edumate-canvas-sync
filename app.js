'use strict';

var async = require('async');

var config = require('./config');
var datasets = require('./datasets');
var timetable = require('./lib/timetable');

var logger = config.logger;

async.series([
  function (callback) {
    logger.info({
      operation: 'Startup',
      detail: {
        message: 'Starting edumate-canvas-sync'
      }
    });
    setTimeout(function () { callback(null, 'starting'); }, 100);
  },
  function (callback) {
    logger.info({
      operation: 'Startup',
      detail: {
        message: 'Canvas Domain: ' + config.canvas.domain
      }
    });
    setTimeout(function () { callback(null, 'canvas domain'); }, 100);
  },
  function (callback) {
    logger.info({
      operation: 'Startup',
      detail: {
        message: 'Edumate Connection: ' + config.edumate.username + '@' + config.edumate.host + ':' + config.edumate.port + '/' + config.edumate.suffix
      }
    });
    setTimeout(function () { callback(null, 'edumate info'); }, 100);
  }
],
function (err, results) {
  if (err) {
    logger.error({
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
  }
  // Iterate over datasets and pass each one to timetable
  for (var key in datasets) {
    if (datasets.hasOwnProperty(key)) {
      logger.info('Scheduled job: ' + datasets[key].dataset);

      timetable.job(datasets[key])
        .then(function (results) {}, function (error) {
          logger.error({
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          });
        });
    }
  }
});
