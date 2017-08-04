const test = require('tape');
const schedule = require('node-schedule');
const timetable = require('../lib/timetable');

var exampleJob = {
  dataset: 'sub-accounts',
  sql: 'SELECT * FROM DB2INST1.view_canvas_subaccounts',
  schedule: { minute: [new schedule.Range(0, 59)] }
};

test('it should error if config not supplied', (t) => {
  t.plan(1);
  timetable.job(null, (err, results) => {
    if (err) { t.ok(err, 'error because !config'); }
  });
});

test('it should return `sis import status` object from canvas', (t) => {
  t.plan(1);
  timetable.job(exampleJob, (err, results) => {
    if (err) { t.equal(err, null); }
    t.equal(typeof results.id, 'number');
  });
});
