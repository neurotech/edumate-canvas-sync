'use strict';

var moment = require('moment');

var datasets = require('./datasets');
var timetable = require('./lib/timetable');

var today = moment().format('dddd Do MMMM YYYY');
var now = moment().format('h:mm:ss a');

/* Schedule each dataset job based on it's `schedule` value in datasets.js */
timetable.job(datasets.subAccounts.name, datasets.subAccounts.sql, datasets.subAccounts.schedule);
timetable.job(datasets.terms.name, datasets.terms.sql, datasets.terms.schedule);
timetable.job(datasets.courses.name, datasets.courses.sql, datasets.courses.schedule);
timetable.job(datasets.sections.name, datasets.sections.sql, datasets.sections.schedule);
timetable.job(datasets.staffUsers.name, datasets.staffUsers.sql, datasets.staffUsers.schedule);
timetable.job(datasets.studentUsers.name, datasets.studentUsers.sql, datasets.studentUsers.schedule);
timetable.job(datasets.enrolments.name, datasets.enrolments.sql, datasets.enrolments.schedule);

console.log('Starting edumate-canvas-sync on ' + today + ' at ' + now + '.');
