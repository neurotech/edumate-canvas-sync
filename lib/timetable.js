'use strict';

var schedule = require('node-schedule');
var edumate = require('node-edumate');
var path = require('path');
var Acho = require('acho');
var moment = require('moment');

var config = require('../config');
var csv = require('./db/csv');
var canvas = require('./canvas');

var acho = new Acho({
  color: true,
  outputType: function(type) {
    return '[' + moment().format('DD/MM/YY [|] HH:mm:ss') + '] [' + type + '] ';
  }
});
var csvPath = path.join(__dirname, '../csv/');
var timetable = {};

timetable.job = function(dataset, sql, task) {
  schedule.scheduleJob(task, function() {
    edumate.query(sql, config.init).then(function(results) {
        csv.make(dataset, results)
          .then(function(res) {
            acho.success(res);
            canvas.sisUpload(csvPath + dataset + '.csv', dataset)
              .then(function(res) {
                acho.success(res);
              }, function(err) {
                acho.error(err);
            });
          }, function(err) {
            acho.error(err);
          });
    }, function(error) {
      acho.error(error);
    });
  });
};

module.exports = timetable;
