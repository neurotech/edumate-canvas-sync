'use strict';

const schedule = require('node-schedule');
var datasets = {};

const businessDays = [new schedule.Range(1, 5)];
const everyTwoHours = [new schedule.Range(7, 22, 2)];

datasets.subAccounts = {
  dataset: 'sub-accounts',
  sql: 'SELECT * FROM DB2INST1.view_canvas_subaccounts',
  schedule: {
    dayOfWeek: 1,
    hour: 18,
    minute: 0
  }
};

datasets.terms = {
  dataset: 'terms',
  sql: 'SELECT * FROM DB2INST1.view_canvas_terms',
  schedule: {
    dayOfWeek: 1,
    hour: 19,
    minute: 0
  }
};

datasets.courses = {
  dataset: 'courses',
  sql: 'SELECT * FROM DB2INST1.view_canvas_courses',
  schedule: {
    dayOfWeek: businessDays,
    hour: 10,
    minute: 0
  }
};

datasets.sections = {
  dataset: 'sections',
  sql: 'SELECT * FROM DB2INST1.view_canvas_sections',
  schedule: {
    dayOfWeek: businessDays,
    hour: 10,
    minute: 5
  }
};

datasets.staffUsers = {
  dataset: 'staff-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_staff_users',
  schedule: {
    dayOfWeek: businessDays,
    hour: 10,
    minute: 10
  }
};

datasets.studentUsers = {
  dataset: 'student-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_student_users',
  schedule: {
    dayOfWeek: businessDays,
    hour: 10,
    minute: 15
  }
};

datasets.parentUsers = {
  dataset: 'parent-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_parent_users',
  schedule: {
    hour: everyTwoHours,
    minute: 30
  }
};

datasets.enrolments = {
  dataset: 'enrolments',
  sql: 'SELECT * FROM DB2INST1.view_canvas_enrolments',
  schedule: {
    dayOfWeek: businessDays,
    hour: 10,
    minute: 20
  }
};

module.exports = datasets;
