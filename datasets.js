const schedule = require('node-schedule');
var datasets = {};
const everyTwoHours = [new schedule.Range(7, 22, 2)];

// Cron syntax for "4AM, 11AM, 4PM - Monday to Friday"
// Note: This variable is missing the minute value as that is defined in each dataset.
const cronAmPm = `4,11,16 * * 1-5`;

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

datasets.parentUsers = {
  dataset: 'parent-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_parent_users',
  schedule: {
    hour: everyTwoHours,
    minute: 30
  }
};

datasets.courses = {
  dataset: 'courses',
  sql: 'SELECT * FROM DB2INST1.view_canvas_courses',
  schedule: `0 ${cronAmPm}`
};

datasets.sections = {
  dataset: 'sections',
  sql: 'SELECT * FROM DB2INST1.view_canvas_sections',
  schedule: `5 ${cronAmPm}`
};

datasets.staffUsers = {
  dataset: 'staff-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_staff_users',
  schedule: `10 ${cronAmPm}`
};

datasets.studentUsers = {
  dataset: 'student-users',
  sql: 'SELECT * FROM DB2INST1.view_canvas_student_users',
  schedule: `15 ${cronAmPm}`
};

datasets.enrolments = {
  dataset: 'enrolments',
  sql: 'SELECT * FROM DB2INST1.view_canvas_enrolments',
  schedule: `20 ${cronAmPm}`
};

module.exports = datasets;
