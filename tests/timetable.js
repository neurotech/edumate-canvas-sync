'use strict';

var test = require('tape');
var schedule = require('node-schedule');
var timetable = require('../lib/timetable');

var exampleJob = {
  dataset: 'sub-accounts',
  sql: 'SELECT * FROM DB2INST1.view_canvas_subaccounts',
  schedule: { minute: [new schedule.Range(0, 59)] }
};

test('it should error if config not supplied', function (t) {
  t.plan(1);
  timetable.job()
    .then(function (results) {
      t.equal(results, null, 'no response');
    }, function (error) {
      t.ok(error, 'error because !config');
    });
});

test('it should return `sis import status` object from canvas', function (t) {
  t.plan(1);
  timetable.job(exampleJob)
    .then(function (results) {
      t.equal(typeof results.id, 'number');
    }, function (error) {
      t.equal(error, null);
    });
});
