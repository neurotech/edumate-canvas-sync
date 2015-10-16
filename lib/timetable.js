'use strict';

require('dotenv').load();

var schedule = require('node-schedule');
var edumate = require('node-edumate');
var csv = require('./csv');
var canvas = require('canvas-api');
var status = require('./status');
var moment = require('moment');

var config = require('../config');
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

  status.add(results);

  console.log('[' + results.dataset + '.csv] ' + 'SIS Import ID #' + results.id + ' started on ' + moment(results.created_at).format('dddd, MMMM Do YYYY [at] hh:mm:ss A. ') + '[' + process.env.CANVAS_API_DOMAIN + ']');

  return results;
}

module.exports = timetable;
