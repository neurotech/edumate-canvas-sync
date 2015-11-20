'use strict';

var schedule = require('node-schedule');
var edumate = require('node-edumate');
var csv = require('./csv');
var canvas = require('canvas-api');
var moment = require('moment');

var config = require('../config');
var logger = config.logger;
var timetable = {};

/**
 * Schedule a job using node-schedule
 * @param {Object} config
 */
timetable.job = function (params) {
  return new Promise(function (resolve, reject) {
    if (typeof params === 'undefined' || typeof params.dataset === 'undefined' || typeof params.sql === 'undefined' || typeof params.schedule === 'undefined') {
      reject(new Error('Incomplete params. Please supply a `params` object containing the correct dataset, sql, and schedule values.'));
    }

    schedule.scheduleJob(params.schedule, function () {
      // 1. Query Edumate
      edumate.query(config.edumate, params.sql, {clean: false})
        .then(function (results) {
          // 2. Make CSV with results
          csv.make(params.dataset, results)
            .then(function (success) {
              // 3. Send CSV to Canvas module
              canvas.sisUpload({
                csv: success.path,
                dataset: params.dataset
              })
                .then(function (results) {
                  resolve(_jobComplete(results));
                }, function (error) {
                  console.log(error);
                  reject(new Error(error));
                });
            }, function (error) {
              reject(new Error(error));
            });
        }, function (error) {
          reject(new Error(error));
        });
    });
  });
};

function _jobComplete (results) {
  results.local_date = moment(results.created_at).format('dddd, MMMM Do YYYY');
  results.local_time = moment(results.created_at).format('h:mm:ss a');

  var entry = {
    operation: 'SIS Upload',
    dataset: results.dataset,
    csv: results.dataset + '.csv',
    sis_id: results.id,
    date_started: moment(results.created_at).format('dddd, MMMM Do YYYY'),
    time_started: moment(results.created_at).format('hh:mm:ss A'),
    domain: config.canvas.domain
  };
  logger.info(entry);

  return results;
}

module.exports = timetable;
