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
  SELECT 'STAFFPD' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'COMMUNITYRESOURCES' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'STAFFLEARNINGSUPPORT' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'SURFACE-TRAINING' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'LEARN-ED' AS "COURSE_ID", null AS "SECTION_ID", 'STAFF' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
),

student_evergreen_courses AS (
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", null AS "SECTION_ID", 'STUDENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
),

parent_evergreen_courses AS (
  SELECT 'LEARNINGRESOURCES' AS "COURSE_ID", null AS "SECTION_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'COMMUNITYRESOURCES' AS "COURSE_ID", null AS "SECTION_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
  UNION
  SELECT 'PASTORALCARE-PARENTS' AS "COURSE_ID", null AS "SECTION_ID", 'PARENTS' AS "USER_TYPE" FROM SYSIBM.SYSDUMMY1
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
    staff_evergreen_courses.section_id,
    staff_evergreen_courses.user_type

  FROM current_staff

  INNER JOIN staff ON staff.contact_id = current_staff.contact_id
  CROSS JOIN staff_evergreen_courses
),

staff_stem_enrolments AS (
  SELECT
    staff.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "USER_ID",
    TO_CHAR((current date), 'YYYY') || '-STEM' AS "COURSE_ID",
    null AS "SECTION_ID",
    'STAFF' AS "USER_TYPE"

  FROM DB2INST1.view_canvas_class_teachers vcct
  
  INNER JOIN staff ON staff.contact_id = vcct.contact_id
  
  WHERE (
    course_id LIKE TO_CHAR((current date), 'YYYY') || '-08S%'
    OR
    course_id LIKE TO_CHAR((current date), 'YYYY') || '-08T%'
    OR
    course_id LIKE TO_CHAR((current date), 'YYYY') || '-08M%'
  )
),

student_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    student_evergreen_courses.course_id,
    student_evergreen_courses.section_id,
    student_evergreen_courses.user_type

  FROM current_students

  INNER JOIN student ON student.student_id = current_students.student_id
  CROSS JOIN student_evergreen_courses
),

parent_enrolments AS (
  SELECT
    current_parents.contact_id || '.' || current_parents.carer_number || '.' || current_parents.carer_id AS USER_ID,
    parent_evergreen_courses.course_id,
    parent_evergreen_courses.section_id,
    parent_evergreen_courses.user_type

  FROM current_parents

  CROSS JOIN parent_evergreen_courses
),

student_careers_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    YEAR(current date) || '-CAREERS' AS "COURSE_ID",
    YEAR(current date) || '-YEAR-' || form AS "SECTION_ID",
    'STUDENTS' AS "USER_TYPE"

  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
  
  WHERE form IN (10,11,12)
),

student_learn_ed_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    'LEARN-ED' AS "COURSE_ID",
    null AS "SECTION_ID",
    'STUDENTS' AS "USER_TYPE"

  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
  
  WHERE form = 10
),

student_stem_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    TO_CHAR((current date), 'YYYY') || '-STEM' AS "COURSE_ID",
    null AS "SECTION_ID",
    'STUDENTS' AS "USER_TYPE"

  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
  
  WHERE form = 8
),

student_pastoral_care_enrolments AS (
  SELECT
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "USER_ID",
    (CASE
      WHEN form = 7 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR07'
      WHEN form = 8 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR08'
      WHEN form = 9 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR09'
      WHEN form = 10 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR10'
      WHEN form = 11 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR11'
      WHEN form = 12 THEN TO_CHAR((current date), 'YYYY') || '-PC-YR12'
    END) AS "COURSE_ID",
    null AS "SECTION_ID",
    'STUDENTS' AS "USER_TYPE"
  
  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
),

pastoral_care_codes AS (
  SELECT
    TO_CHAR((current date), 'YYYY') || '-PC-YR' || (CASE WHEN form.short_name IN ('7','8','9') THEN '0' || form.short_name ELSE form.short_name END) AS COURSE_ID

  FROM form
),

staff_ms3_pastoral_care_enrolments AS (
  SELECT
    current_staff.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "USER_ID",
    pastoral_care_codes.course_id,
    null AS "SECTION_ID",
    'STAFF' AS "USER_TYPE"

  FROM current_staff
  
  INNER JOIN staff ON staff.contact_id = current_staff.contact_id
  LEFT JOIN teacher ON teacher.contact_id = current_staff.contact_id
  LEFT JOIN class_teacher ON class_teacher.teacher_id = teacher.teacher_id
  LEFT JOIN class ON class.class_id = class_teacher.class_id

  CROSS JOIN pastoral_care_codes

  WHERE
    class_teacher.class_id IN (SELECT DISTINCT class_id FROM view_student_class_enrolment WHERE class_type_id = 2 AND academic_year = YEAR(current date))
    AND
    class.class LIKE '%MS3'
),

staff_non_ms3_pastoral_care_enrolments AS (
  SELECT
    current_staff.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "USER_ID",
    (CASE
      WHEN class.class LIKE '%MS1' THEN YEAR(current date) || '-PC-YR08'
      WHEN class.class LIKE '%MS2' THEN YEAR(current date) || '-PC-YR09'
      WHEN class.class LIKE '%MS4' THEN YEAR(current date) || '-PC-YR07'
      WHEN class.class LIKE '%SS1' THEN YEAR(current date) || '-PC-YR11'
      WHEN class.class LIKE '%SS2' THEN YEAR(current date) || '-PC-YR12'
      WHEN class.class LIKE '%SS3' THEN YEAR(current date) || '-PC-YR10'
    END) AS "course_id",
    null AS "SECTION_ID",
    'STAFF' AS "USER_TYPE"

  FROM current_staff
  
  INNER JOIN staff ON staff.contact_id = current_staff.contact_id
  LEFT JOIN teacher ON teacher.contact_id = current_staff.contact_id
  LEFT JOIN class_teacher ON class_teacher.teacher_id = teacher.teacher_id
  LEFT JOIN class ON class.class_id = class_teacher.class_id

  WHERE
    class_teacher.class_id IN (SELECT DISTINCT class_id FROM view_student_class_enrolment WHERE class_type_id = 2 AND academic_year = YEAR(current date))
    AND
    class.class NOT LIKE '%MS3'
),

staff_pastoral_care_designer_enrolments AS (
  SELECT
    group_membership.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "USER_ID",
    pastoral_care_codes.course_id,
    null AS "SECTION_ID",
    'STAFF' AS "USER_TYPE"

  FROM group_membership

  INNER JOIN staff ON staff.contact_id = group_membership.contact_id
  CROSS JOIN pastoral_care_codes

  WHERE
    group_membership.groups_id IN (603,674)
    AND
    effective_start <= (current date)
    AND
    (effective_end IS null
    OR
    effective_end >= (current date))
),

staff_pastoral_care_enrolments AS (
  SELECT * FROM staff_pastoral_care_designer_enrolments
  UNION
  SELECT * FROM staff_non_ms3_pastoral_care_enrolments
  UNION
  SELECT * FROM staff_ms3_pastoral_care_enrolments
),

combined_enrolments AS (
  SELECT * FROM parent_enrolments
  UNION
  SELECT * FROM student_careers_enrolments
  UNION
  SELECT * FROM student_learn_ed_enrolments
  UNION
  SELECT * FROM student_pastoral_care_enrolments
  UNION
  SELECT * FROM student_stem_enrolments
  UNION
  SELECT * FROM staff_stem_enrolments
  UNION
  SELECT * FROM staff_pastoral_care_enrolments 
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
      WHEN combined_enrolments.course_id = 'LEARN-ED' AND combined_enrolments.user_type = 'STAFF' THEN 'TA'
      WHEN combined_enrolments.course_id LIKE '%-PC-%' AND combined_enrolments.user_id IN (SELECT DISTINCT user_id FROM staff_pastoral_care_designer_enrolments) THEN 'DesignerEnrollment'
      WHEN combined_enrolments.course_id LIKE '%-PC-%' AND combined_enrolments.user_id NOT IN (SELECT DISTINCT user_id FROM staff_pastoral_care_designer_enrolments) AND combined_enrolments.user_type = 'STAFF' THEN 'teacher'
      WHEN combined_enrolments.course_id LIKE '%-STEM' AND combined_enrolments.user_type = 'STAFF' THEN 'teacher'
      ELSE 'student'
    END) AS "ROLE",
    section_id,
    'active' AS "STATUS",
    null AS "ASSOCIATED_USER_ID"

  FROM combined_enrolments

  ORDER BY course_id
)