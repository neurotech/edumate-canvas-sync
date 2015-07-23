'use strict';

var schedule = require('node-schedule');
var datasets = {};

datasets.subAccounts = {
  dataset: 'sub-accounts',
  sql: 'SELECT * FROM DB2INST1.view_canvas_subaccounts',
  schedule: { hour: 18, minute: 0, dayOfWeek: 1 }
};

datasets.terms = {
  dataset: 'terms',
  sql: 'SELECT * FROM DB2INST1.view_canvas_terms',
  schedule: { hour: 19, minute: 0, dayOfWeek: 1 }
};

datasets.courses = {
  dataset: 'courses',
  sql: 'SELECT * FROM DB2INST1.view_canvas_courses',
  schedule: { hour: 10, minute: 0, dayOfWeek: [new schedule.Range(1, 5)] }
};

datasets.sections = {
  dataset: 'sections',
  sql: 'SELECT * FROM DB2INST1.view_canvas_sections',
  schedule: { hour: 10, minute: 15, dayOfWeek: [new schedule.Range(1, 5)] }
};

datasets.staffUsers = {
  dataset: 'staff-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_staff_users',
  schedule: { hour: 10, minute: 30, dayOfWeek: [new schedule.Range(1, 5)] }
};

datasets.studentUsers = {
  dataset: 'student-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_student_users',
  schedule: { hour: 10, minute: 45, dayOfWeek: [new schedule.Range(1, 5)] }
};

datasets.enrolments = {
  dataset: 'enrolments',
  sql: 'SELECT * FROM DB2INST1.view_canvas_enrolments',
  schedule: { hour: 11, minute: 0, dayOfWeek: [new schedule.Range(1, 5)] }
};

module.exports = datasets;
