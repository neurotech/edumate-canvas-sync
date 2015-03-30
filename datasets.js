'use strict';

var schedule = require('node-schedule');
var datasets = {};

datasets.terms = {
  name: 'terms',
  sql: 'SELECT * FROM DB2INST1.view_canvas_terms',
  //schedule: { hour: 18, minute: 0, dayOfWeek: 1 }
  schedule: { minute: [new schedule.Range(0,59)] }
};

datasets.courses = {
  name: 'courses',
  sql: 'SELECT * FROM DB2INST1.view_canvas_courses',
  schedule: { hour: 10, minute: 0, dayOfWeek: [new schedule.Range(1,5)] }
};

datasets.staffUsers = {
  name: 'staff-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_staff_users',
  schedule: { hour: 10, minute: 15, dayOfWeek: [new schedule.Range(1,5)] }
};

datasets.studentUsers = {
  name: 'student-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_student_users',
  schedule: { hour: 10, minute: 30, dayOfWeek: [new schedule.Range(1,5)] }
};

datasets.classTeachers = {
  name: 'class-teachers',
  sql: 'SELECT * FROM DB2INST1.view_canvas_class_teachers',
  schedule: { hour: 10, minute: 45, dayOfWeek: [new schedule.Range(1,5)] }
};

datasets.classStudents = {
  name: 'class-students',
  sql: 'SELECT * FROM DB2INST1.view_canvas_class_students',
  schedule: { hour: 11, minute: 0, dayOfWeek: [new schedule.Range(1,5)] }
};

module.exports = datasets;
