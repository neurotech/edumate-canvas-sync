var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('./config');

schedule.scheduleJob(config.uploadSchedules.test, function(){
  console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
});

// Add a way to check the status of the most recent upload before POSTing a CSV.
// i.e.:
//   1. GET zeroth object from /api/v1/accounts/self/sis_imports/
//   2. Check 'workflow_state' for the presence of 'created' / 'importing'
//   3. If present, wait x seconds, goto step 1.
//   4. If 'imported' then begin POSTing

function canvasUpload(dataset) {
  request.post({
    url: config.canvas.upload,
    headers: config.canvas.auth,
    formData: {attachment: fs.createReadStream(__dirname + '/csv/' + dataset + '.csv')}
  }, respond);
}

function respond(error, response, body) {
  if (!error && response.statusCode === 200) {
    var payload = JSON.parse(body);
    console.log('Success! Import running. (ID: ' + payload.id + ')');
    uploadStatus(payload.id);
  } else {
    console.log('Error: ' + error);
  }
}

function uploadStatus(id) {
  request.get({
      url: config.canvas.uploadStatus + id,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var status = JSON.parse(body);
        console.log('Status: ' + status.workflow_state + ' | Progress: ' + status.progress + '%');
      } else {
        console.log('Error: ' + error);
      }
    }
  );
}

/*
canvasUpload('staff');
*/