-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_EVERGREEN_ENROLMENTS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_EVERGREEN_ENROLMENTS (
  course_id,
  root_account,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS

WITH staff_evergreen_courses AS (
  SELECT 'STAFFPD' AS "COURSE_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'STAFFLEARNINGSUPPORT' AS "COURSE_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'PASTORALCARE' AS "COURSE_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'SURFACE-TRAINING' AS "COURSE_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
),

student_evergreen_courses AS (
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", 'STUDENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'PASTORALCARE' AS "COURSE_ID", 'STUDENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
),

parent_evergreen_courses AS (
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'COMMUNITYRESOURCES' AS "COURSE_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  --UNION
  --SELECT 'PASTORALCARE' AS "COURSE_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
),

combined_evergreen_courses AS (
  SELECT * FROM parent_evergreen_courses
  UNION
  SELECT * FROM student_evergreen_courses
  UNION
  SELECT * FROM staff_evergreen_courses
),

current_staff AS (
  SELECT contact_id
  FROM group_membership gm
  -- groups_id 386 = Current Staff
  WHERE
    gm.groups_id = 386
    AND
    gm.effective_start <= (current date)
    AND
    (gm.effective_end > (current date) OR gm.effective_end IS null)
),

current_students AS (
  SELECT gces.student_id, REPLACE(vsfr.form, 'Year ', '') AS "FORM", vsfr.form_run
  FROM TABLE(EDUMATE.get_currently_enroled_students(current date)) gces
  INNER JOIN student ON student.student_id = gces.student_id
  INNER JOIN view_student_form_run vsfr ON vsfr.student_id = gces.student_id AND academic_year = YEAR(current date)
),

current_parents AS (
  SELECT *
  FROM DB2INST1.view_parent_user_accounts
  WHERE status = 'active'
),

staff_enrolments AS (
  SELECT
    current_staff.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "USER_ID",
    staff_evergreen_courses.course_id,
    staff_evergreen_courses.user_type

  FROM current_staff

  INNER JOIN staff ON staff.contact_id = current_staff.contact_id
  CROSS JOIN staff_evergreen_courses
),

student_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    student_evergreen_courses.course_id,
    student_evergreen_courses.user_type

  FROM current_students

  INNER JOIN student ON student.student_id = current_students.student_id
  CROSS JOIN student_evergreen_courses
),

parent_enrolments AS (
  SELECT
    current_parents.contact_id || '.' || current_parents.carer_number || '.' || current_parents.carer_id AS USER_ID,
    parent_evergreen_courses.course_id,
    parent_evergreen_courses.user_type

  FROM current_parents

  CROSS JOIN parent_evergreen_courses
),

student_careers_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    YEAR(current date) || '-CAREERS' AS "COURSE_ID",
    'STUDENTS' AS "USER_TYPE"

  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
  
  WHERE form IN (10,11,12)
),

combined_enrolments AS (
  SELECT * FROM parent_enrolments
  UNION
  SELECT * FROM student_careers_enrolments
  UNION
  SELECT * FROM student_enrolments
  UNION
  SELECT * FROM staff_enrolments
)

SELECT * FROM (
  SELECT
    course_id,
    null AS "ROOT_ACCOUNT",
    user_id,
    (CASE
      WHEN combined_enrolments.course_id = 'PASTORALCARE' AND combined_enrolments.user_type = 'STAFF'
      THEN 'DesignerEnrollment'
      ELSE 'student'
    END) AS "ROLE",
    null AS "SECTION_ID",
    'active' AS "STATUS",
    null AS "ASSOCIATED_USER_ID"

  FROM combined_enrolments

  ORDER BY course_id
)