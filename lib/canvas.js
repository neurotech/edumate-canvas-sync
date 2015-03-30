'use strict';

// Canvas API Wrapper

var fs = require('fs');
var request = require('request');
var moment = require('moment');
var config = require('../config');

var r = request.defaults({headers: config.canvas.auth, json: true});

exports.sisStatus = function(id) {
  return new Promise(function(resolve, reject) {
    id = id || '';
    r.get(config.canvas.api.sis.get + id, function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        if (!id) {
          resolve(body.sis_imports[0]);
        } else {
          resolve(body);
        }
      } else {
        reject(error);
      }
    });
  });
};

exports.sisUpload = function(csv, dataset) {
  return new Promise(function(resolve, reject) {
    if (csv) {
      var attachment = fs.createReadStream(csv);
      var diff = dataset + moment().format('_MMMM-YYYY').toLowerCase();
      r.post({
        url: config.canvas.api.sis.post,
        qs: {diffing_data_set_identifier: diff},
        formData: {attachment: attachment}
      },
      function(error, response, body) {
        if (!error && response.statusCode >= 200 && response.statusCode < 300) {
          resolve(dataset + '.csv uploaded.' + ' Import ID #' + body.id + ' started on ' + moment(body.created_at).format('dddd, MMMM Do YYYY [at] hh:mm:ss A.'));
        } else {
          reject(error);
        }
      });
    } else {
      reject('No CSV specified.');
    }
  });
};
