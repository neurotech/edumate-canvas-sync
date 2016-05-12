'use strict';

const schedule = require('node-schedule');
const relay = require('rollbar-relay');
const task = require('./task');

var timetable = {};

/**
 * Schedule a job using node-schedule
 * @param {Object} config
 */
timetable.job = (params) => {
  return new Promise((resolve, reject) => {
    if (typeof params === 'undefined' || typeof params.dataset === 'undefined' || typeof params.sql === 'undefined' || typeof params.schedule === 'undefined') {
      var err = new Error('Incomplete params. Please supply a `params` object containing the correct dataset, sql, and schedule values.');
      reject(err);
    }

    schedule.scheduleJob(params.schedule, () => {
      task.run(params)
        .then((results) => {
          // `results` is an Object returned by canvas-api
          resolve();

          // Log `results` to Rollbar
          relay.info(`Started SIS Upload: ${results.dataset}`, {
            sis_upload_id: results.id,
            diffing_data_set_identifier: results.diffing_data_set_identifier,
            created_at: results.created_at
          });
        }, (error) => {
          reject(error);
        });
    });
  });
};

module.exports = timetable;
