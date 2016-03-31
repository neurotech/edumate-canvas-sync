'use strict';

const schedule = require('node-schedule');
const edumate = require('node-edumate');
const canvas = require('canvas-api');
const moment = require('moment');

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
                  resolve(_jobComplete(results));
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

const _jobComplete = (results) => {
  results.local_date = moment(results.created_at).format('dddd, MMMM Do YYYY');
  results.local_time = moment(results.created_at).format('h:mm:ss a');

  var entry = {
    operation: 'SIS Upload',
    detail: {
      dataset: results.dataset,
      csv: results.dataset + '.csv',
      sis_id: results.id,
      date_started: moment(results.created_at).format('dddd, MMMM Do YYYY'),
      time_started: moment(results.created_at).format('hh:mm:ss A'),
      domain: config.canvas.domain
    }
  };
  console.log(entry);

  return results;
};

module.exports = timetable;
