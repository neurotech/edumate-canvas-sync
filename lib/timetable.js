'use strict';

var schedule = require('node-schedule');
var edumate = require('node-edumate');
var csv = require('./csv');
var canvas = require('canvas-api');

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

    schedule.scheduleJob(params.schedule, function job () {
      // 1. Query Edumate
      edumate.query(config.init, params.sql, {clean: false})
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
                  resolve(results);
                }, function (error) {
                  console.log(error);
                  reject(error);
                });
            }, function (error) {
              reject(error);
            });
        }, function (error) {
          reject(error);
        });
    });
  });
};

module.exports = timetable;
