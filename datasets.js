'use strict';

var datasets = {};

datasets.terms = {
  name: 'terms',
  sql: 'SELECT * FROM DB2INST1.view_canvas_terms'
};

datasets.courses = {
  name: 'courses',
  sql: 'SELECT * FROM DB2INST1.view_canvas_courses'
};

datasets.staffUsers = {
  name: 'staff-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_staff_users'
};

datasets.studentUsers = {
  name: 'student-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_student_users'
};

datasets.classTeachers = {
  name: 'class-teachers',
  sql: 'SELECT * FROM DB2INST1.view_canvas_class_teachers'
};

datasets.classStudents = {
  name: 'class-students',
  sql: 'SELECT * FROM DB2INST1.view_canvas_class_students'
};

module.exports = datasets;