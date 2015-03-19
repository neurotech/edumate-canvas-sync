// Canvas API Wrapper

var fs = require('fs');
var request = require('request');
var Acho = require('acho');
var moment = require('moment');
var config = require('../config');

var r = request.defaults({headers: config.canvas.auth, json: true});
var acho = new Acho({color: true});

exports.sisStatus = function(id) {
  return new Promise(function(resolve, reject) {
    id = id || '';
    r.get(config.canvas.api.sis.get + id, function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        if (!id || id === '') {
          resolve(body.sis_imports[0]);
        } else {
          resolve(body);
        }
      } else {
        reject(error);
      }
    });
  });
}

exports.sisUpload = function(csv) {
  return new Promise(function(resolve, reject) {
    if (!csv) {
      reject('No CSV specified.');
    } else {
      var attachment = fs.createReadStream(__dirname + '/../csv/' + csv + '.csv');
      var diff = csv + moment().format('_MMMM-YYYY').toLowerCase();
      r.post({
        url: config.canvas.api.sis.post,
        qs: {diffing_data_set_identifier: diff},
        formData: {attachment: attachment}
      },
      function(error, response, body) {
        if (!error && response.statusCode >= 200 && response.statusCode < 300) {
          var success = {
            status: csv + '.csv uploaded.' + ' Import ID #' + body.id + ' started on ' + moment(body.created_at).format("dddd, MMMM Do YYYY [at] hh:mm:ss A.")
          };
          resolve(success);
        } else {
          reject(error);
        }
      });
    }
  });
};
