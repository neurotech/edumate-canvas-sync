'use strict';

var schedule = require('node-schedule');
var path = require('path');
var Acho = require('acho');
var moment = require('moment');

var canvas = require('./canvas');
var edumate = require('./db/edumate');

var acho = new Acho({
  color: true,
  outputType: function(type) {
    return '[' + moment().format('DD/MM/YY [|] HH:MM:SS') + '] [' + type + '] ';
  }
});
var csvPath = path.join(__dirname, '../csv/');
var timetable = {};

timetable.job = function(dataset, sql, task) {
  schedule.scheduleJob(task, function() {
    edumate.query(dataset, sql)
      .then(function() {
        canvas.sisUpload(csvPath + dataset + '.csv', dataset)
          .then(function(res) {
            acho.success(res);
          }, function(err) {
            acho.error(err);
          });
      }, function(err) {
        acho.error(err);
      });
  });
};

module.exports = timetable;
