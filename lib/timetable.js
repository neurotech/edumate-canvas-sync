const schedule = require('node-schedule');
const relay = require('rollbar-relay');
const task = require('./task');

var timetable = {};

/**
 * Schedule a job using node-schedule
 * @param {Object} config
 */
timetable.job = (params, cb) => {
  if (params === null || typeof params === 'undefined' || typeof params.dataset === 'undefined' || typeof params.sql === 'undefined' || typeof params.schedule === 'undefined') {
    var err = new Error('Incomplete params. Please supply a `params` object containing the correct dataset, sql, and schedule values.');
    return cb(err);
  }
  schedule.scheduleJob(params.schedule, () => {
    task.run(params, (err, results) => {
      if (err) { return cb(err); }
      relay.info(`Started SIS Upload: ${params.dataset}`, {
        sis_upload_id: results.id,
        created_at: results.created_at
      });
    });
  });
  cb(null, params.dataset);
};

module.exports = timetable;
