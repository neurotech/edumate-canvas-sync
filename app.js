'use strict';

var moment = require('moment');
var datasets = require('./datasets');
var timetable = require('./lib/timetable');

// Iterate over datasets and pass each one to timetable
for (var key in datasets) {
  if (datasets.hasOwnProperty(key)) {
    console.log('Timetabled job: ' + datasets[key].dataset);

    timetable.job(datasets[key])
      .then(function (results) {
        console.log(datasets[key].dataset + '.csv uploaded to Canvas.' + ' Import ID #' + results.id + ' started on ' + moment(results.created_at).format('dddd, MMMM Do YYYY [at] hh:mm:ss A.'));
      }, function (error) {
        console.error(error);
      });
  }
}
