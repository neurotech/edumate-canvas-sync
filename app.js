require('newrelic');

'use strict';

var Acho = require('acho');

var config = require('./config');
var datasets = require('./datasets');
var program = require('./lib/cli');
var timetable = require('./lib/timetable');
var server = require('./lib/hapi');

var acho = new Acho({color: true});

program.parse(process.argv);

timetable.job(datasets.terms.name, datasets.terms.sql, datasets.terms.schedule);
timetable.job(datasets.courses.name, datasets.courses.sql, datasets.courses.schedule);
timetable.job(datasets.staffUsers.name, datasets.staffUsers.sql, datasets.staffUsers.schedule);
timetable.job(datasets.studentUsers.name, datasets.studentUsers.sql, datasets.studentUsers.schedule);
timetable.job(datasets.classTeachers.name, datasets.classTeachers.sql, datasets.classTeachers.schedule);
timetable.job(datasets.classStudents.name, datasets.classStudents.sql, datasets.classStudents.schedule);

server.start(function (err) {
  if (err) { throw err; } else {
    acho.success('hapi running on: http://' + config.http.host + ':' + config.http.port);
  }
});
