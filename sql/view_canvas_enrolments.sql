-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_ENROLMENTS" TO USER DASHBOARD

/* CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_ENROLMENTS (
  course_id,
  root_account,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS */

WITH active AS (
  SELECT * FROM DB2INST1.view_canvas_class_teachers
  UNION ALL
  SELECT * FROM DB2INST1.view_canvas_class_students
  UNION ALL
  SELECT * FROM DB2INST1.view_canvas_class_parents
)

SELECT * FROM (
  SELECT
    course_id,
    root_account,
    user_id,
    role,
    section_id,
    status,
    associated_user_id
  
  FROM active
  
  UNION
  
  SELECT * FROM DB2INST1.view_canvas_evergreen_enrolments
  
  ORDER BY user_id, role DESC, course_id
)