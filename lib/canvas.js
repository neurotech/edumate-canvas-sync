// Canvas API Wrapper

var fs = require('fs');
var request = require('request');
var Acho = require('acho');
var config = require('../config');

var acho = new Acho({color: true});

exports.sisUpload = function(csv) {
  request.post({
      url: config.canvas.sisPost,
      headers: config.canvas.auth,
      formData: { attachment: fs.createReadStream(__dirname + '/../csv/' + csv + '.csv') }
    },
    function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        var upload = JSON.parse(body);
        acho.success(csv + '.csv successfully uploaded to Canvas. SIS Import #' + upload.id + ' is now running.');
      } else {
        acho.error('Error uploading CSV: ' + '\n' + error);
      }
    }
  );
};

exports.sisCheck = function(id) {
  // If no ID specified, return the latest SIS Import object.
  // Otherwise, GET sis_imports/{id}
  if (!id) {
    request.get({
      url: config.canvas.sisGet,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        exports.sisStatus(JSON.parse(body).sis_imports[0]);
      } else {
        acho.error('Error checking Canvas API: ' + error);
      }
    }
    );
  } else {
    request.get({
      url: config.canvas.sisGet + id,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        exports.sisStatus(JSON.parse(body));
      } else {
        acho.error('Error checking Canvas API: ' + error);
      }
    }
    );
  }
};

exports.sisStatus = function(data) {
  acho.success(JSON.stringify(data));
};