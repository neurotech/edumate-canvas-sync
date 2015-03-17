// Canvas API Wrapper

var fs = require('fs');
var request = require('request');
var Acho = require('acho');
var config = require('../config');

var r = request.defaults({headers: config.canvas.auth});
var acho = new Acho({color: true});

exports.sisStatus = function(id) {
  id = id || '';
  r.get(config.canvas.sisGet + id,
  function(error, response, body) {
    if (!error && response.statusCode >= 200 && response.statusCode < 300) {
      if (!id || id === '') {
        console.log(JSON.parse(body).sis_imports[0]);
      } else {
        console.log(JSON.parse(body));
      }
    } else {
       acho.error('Error checking Canvas API: ' + error);
    }
  }
  );
};

exports.sisUpload = function(csv) {
  r.post({
      url: config.canvas.sisPost,
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
