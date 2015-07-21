'use strict';

var schedule = require('node-schedule');
var edumate = require('node-edumate');
var canvas = require('canvas-api');
var path = require('path');
var Acho = require('acho');
var moment = require('moment');

var config = require('../config');
var csv = require('./db/csv');

var acho = new Acho({
  color: true,
  outputType: function (type) {
    return '[' + moment().format('DD/MM/YY [|] HH:mm:ss') + '] [' + type + '] ';
  }
});
var csvPath = path.join(__dirname, '../csv/');
var timetable = {};

timetable.job = function (dataset, sql, task) {
  schedule.scheduleJob(task, function () {
    edumate.query(config.init, sql, {clean: false}).then(function (results) {
      csv.make(dataset, results)
        .then(function (res) {
          acho.success(res);
          console.log(csvPath + dataset + '.csv');
          console.log(dataset);
          canvas.sisUpload({
            csv: csvPath + dataset + '.csv',
            dataset: dataset
          }).then(function (res) {
              acho.success('CSV successfully uploaded.');
            }, function (err) {
              acho.error('canvas-api: ' + err);
            });
        }, function (err) {
          acho.error('csv: ' + err);
        });
    }, function (error) {
      acho.error('node-edumate: ' + error);
    });
  });
};

module.exports = timetable;
