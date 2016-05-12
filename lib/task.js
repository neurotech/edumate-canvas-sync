'use strict';

const edumate = require('node-edumate');
const canvas = require('canvas-api');

const csv = require('./csv');
const config = require('../config');

var task = {};

task.run = (params) => {
  return new Promise((resolve, reject) => {
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
                resolve(results);
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
};

module.exports = task;
