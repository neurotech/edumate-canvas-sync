const edumate = require('node-edumate');
const canvas = require('canvas-api');

const csv = require('./csv');
const config = require('../config');

var task = {};

task.run = (params, cb) => {
  // 1. Query Edumate
  edumate.query(config.edumate, params.sql, { clean: false }, (err, results) => {
    if (err) { return cb(err); }
    // 2. Make CSV with results
    csv.make(params.dataset, results, (err, results) => {
      if (err) { return cb(err); }
      // 3. Send CSV to Canvas module
      canvas.sis.upload({
        csv: results.path,
        dataset: params.dataset
      }, (err, results) => {
        if (err) { return cb(err); }
        cb(null, results);
      });
    });
  });
};

module.exports = task;
