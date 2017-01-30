CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_LIFE_SKILLS_ENROLMENTS (
  course_id,
  root_account,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS

WITH current_students AS (
  SELECT student_id
  FROM TABLE(EDUMATE.get_currently_enroled_students(current date))
),

life_skills_enrolments AS (
  SELECT DISTINCT student_id
  
  FROM view_student_class_enrolment vsce
  
  WHERE
    academic_year = YEAR(current date)
    AND
    class_type_id = 10
    AND
    (current date) BETWEEN start_date AND end_date
    
  ORDER BY student_id
)


SELECT
  'LIFE-SKILLS' AS "COURSE_ID",
  null AS "ROOT_ACCOUNT",
  student.contact_id || '.' || student.student_number || '.' || life_skills_enrolments.student_id AS "USER_ID",
  'student' AS "ROLE",
  null AS "SECTION_ID",
  'active' AS "STATUS",
  null AS "ASSOCIATED_USER_ID"

FROM life_skills_enrolments

INNER JOIN student ON student.student_id = life_skills_enrolments.student_id

ORDER BY course_id