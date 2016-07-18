/*
  course_id
  root_account
  user_id
  role
  section_id
  status
  associated_user_id
*/

WITH current_students AS (
  SELECT *
  FROM TABLE(EDUMATE.get_currently_enroled_students(current date))
),

student_enrolments AS (
  SELECT
    vcec.course_id,
    null AS "ROOT_ACCOUNT",
    contact.contact_id || '.' || student.student_number || '.' || current_students.student_id AS "USER_ID",
    'DesignerEnrollment' AS "ROLE",
    null AS "SECTION_ID",
    'active' AS "STATUS",
    null AS "ASSOCIATED_USER_ID"
  
  FROM current_students
  
  INNER JOIN DB2INST1.view_canvas_eportfolio_courses vcec ON vcec.student_id = current_students.student_id
  
  INNER JOIN student ON student.student_id = current_students.student_id
  INNER JOIN contact ON contact.contact_id = student.contact_id
),

parent_enrolments AS (
  SELECT
    vcec.course_id,
    null AS "ROOT_ACCOUNT",
    carer.contact_id || '.' || carer.carer_number || '.' || carer.carer_id AS "USER_ID",
    'Observer' AS "ROLE",
    null AS "SECTION_ID",
    'active' AS "STATUS",
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "ASSOCIATED_USER_ID"
  
  FROM DB2INST1.view_current_carers_with_student_id vccwsi
  
  INNER JOIN DB2INST1.view_canvas_eportfolio_courses vcec ON vcec.student_id = vccwsi.student_id
  
  INNER JOIN student ON student.student_id = vccwsi.student_id
  INNER JOIN carer ON carer.contact_id = vccwsi.carer_contact_id
)

SELECT * FROM parent_enrolments
UNION ALL
SELECT * FROM student_enrolments