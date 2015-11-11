'use strict';

var moment = require('moment');
var async = require('async');

var config = require('./config');
var datasets = require('./datasets');
var timetable = require('./lib/timetable');

var today = moment().format('DD/MM/YY');
var now = moment().format('HH:mm:ss');
var logger = config.logger;

async.series([
  function (callback) {
    logger.info('Starting edumate-canvas-sync on ' + today + ' at ' + now);
    setTimeout(function () { callback(null, 'starting'); }, 100);
  },
  function (callback) {
    logger.info('Canvas Domain: ' + config.canvas.domain);
    setTimeout(function () { callback(null, 'canvas domain'); }, 100);
  },
  function (callback) {
    logger.info('Edumate Connection: ' + config.edumate.username + '@' + config.edumate.host + ':' + config.edumate.port + '/' + config.edumate.suffix);
    setTimeout(function () { callback(null, 'edumate info'); }, 100);
  },
],
function(err, results) {
  // Iterate over datasets and pass each one to timetable
  for (var key in datasets) {
    if (datasets.hasOwnProperty(key)) {
      logger.info('Scheduled job: ' + datasets[key].dataset);

      timetable.job(datasets[key])
        .then(function (results) {}, function (error) {
          console.error(error);
        });
    }
  }
});