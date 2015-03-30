'use strict';

var schedule = require('node-schedule');
var moment = require('moment');
var Acho = require('acho');

var config = require('../config');
var canvas = require('./canvas');
var edumate = require('./db/edumate');

var acho = new Acho({color: true});
var timetable = {};

timetable.job = function(dataset, sql, task) {
  schedule.scheduleJob(task, function() {
    edumate.query(dataset, sql)
      .then(function(res) {
        canvas.sisUpload(config.csv.path + dataset + '.csv', dataset)
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
