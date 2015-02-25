var fs = require('fs');
var request = require('request');
var prettyjson = require('prettyjson');
var config = require('./config');

function canvasUpload(dataset) {
  request.post({
    url: config.canvas.upload,
    headers: config.canvas.auth,
    formData: {attachment: fs.createReadStream(__dirname + '/csv/' + dataset + '.csv')}
  }, respond);
};

function respond(error, response, body) {
  if (!error && response.statusCode == 200) {
    var payload = JSON.parse(body);
    console.log('Success! Import running. (ID: ' + payload.id + ')');
    uploadStatus(payload.id);
  } else {
    console.log('Error: ' + error);
  }
};

function uploadStatus(id) {
  request.get({
      url: config.canvas.uploadStatus + id,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var status = JSON.parse(body);
        console.log('Status: ' + status.workflow_state + ' | Progress: ' + status.progress + '%');
      } else {
        console.log('Error: ' + error);
      }
    }
  );
};

canvasUpload('staff');