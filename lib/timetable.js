'use strict';

const schedule = require('node-schedule');
const edumate = require('node-edumate');
const canvas = require('canvas-api');
const relay = require('rollbar-relay');

const csv = require('./csv');
const config = require('../config');

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
      // 1. Query Edumate
      edumate.query(config.edumate, params.sql, {clean: false})
        .then((results) => {
          // 2. Make CSV with results
          csv.make(params.dataset, results)
            .then((success) => {
              // 3. Send CSV to Canvas module
              canvas.sis.upload({
                csv: success.path,
                dataset: params.dataset
              })
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
            }, (error) => {
              reject(error);
            });
        }, (error) => {
          reject(error);
        });
    });
  });
};

module.exports = timetable;
