// Canvas API Wrapper

var fs = require('fs');
var request = require('request');
var Acho = require('acho');
var moment = require('moment');
var config = require('../config');

var r = request.defaults({headers: config.canvas.auth, json: true});
var acho = new Acho({color: true});

exports.sisStatus = function(id) {
  id = id || '';
  r.get(config.canvas.api.sis.get + id, function(error, response, body) {
    if (!error && response.statusCode >= 200 && response.statusCode < 300) {
      if (!id || id === '') {
        console.log(body.sis_imports[0]);
      } else {
        console.log(body);
      }
    } else {
       acho.error('Error checking Canvas API: ' + error);
    }
  }
  );
};

exports.sisUpload = function(csv) {
  var attachment = fs.createReadStream(__dirname + '/../csv/' + csv + '.csv');
  var diff = csv + moment().format('_MMMM-YYYY').toLowerCase();
  r.post({
      url: config.canvas.api.sis.post,
      qs: {diffing_data_set_identifier: diff},
      formData: {attachment: attachment}
    },
    function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        acho.success(csv + '.csv successfully uploaded to Canvas. SIS Import #' + body.id + ' is now running.');
      } else {
        acho.error('Error uploading CSV: ' + error);
      }
    }
  );
};
