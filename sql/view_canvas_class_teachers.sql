-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_CLASS_TEACHERS" TO USER DASHBOARD

-- Additional courses:
-- -------------------
-- 'Learning Resources' SIS ID: LEARNINGRESOURCES
-- 'Learning Support' SIS ID: STAFFLEARNINGSUPPORT
-- 'Staff Professional Development' SIS ID: STAFFPD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_CLASS_TEACHERS (
  course_id,
  root_account,
  contact_id,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS

WITH inactive_teachers AS (
  SELECT teacher.teacher_id
  FROM group_membership gm
  INNER JOIN teacher ON teacher.contact_id = gm.contact_id
  WHERE
    gm.groups_id = 386
    AND
    effective_end <= (current date)
),

active_classes AS (
  SELECT DISTINCT department.department_id, view_student_class_enrolment.course_id, course.meta_course_id, view_student_class_enrolment.class_id, class_teacher.teacher_id, 'active' AS status
  
  FROM view_student_class_enrolment
  
  INNER JOIN class_teacher ON class_teacher.class_id = view_student_class_enrolment.class_id

  INNER JOIN course ON course.course_id = view_student_class_enrolment.course_id
  INNER JOIN subject ON subject.subject_id = course.subject_id
  INNER JOIN department ON department.department_id = subject.department_id
  
  WHERE
    class_teacher.teacher_id NOT IN (SELECT teacher_id FROM inactive_teachers)
    AND
    academic_year_id = (SELECT academic_year_id FROM academic_year WHERE academic_year = YEAR(current date))
    AND
    class_type_id IN (1, 9, 1101, 1124)
    AND
    (start_date <= (current date)
    AND
    end_date >= DATE('2015-12-09'))
    AND
    (course.course NOT LIKE '%Pastoral Care%'
    AND
    course.course NOT LIKE '%TVET%'
    AND
    course.course NOT LIKE '%Early Leave%'
    AND
    course.course NOT LIKE '%Open High School%'
    AND
    course.course NOT LIKE '%Saturday School%'
    AND
    course.course NOT LIKE '%Careers%'
    AND
    course.course NOT LIKE '%Distance Education%'
    AND
    course.course NOT LIKE '%Life Skills%'
    AND
    course.course NOT LIKE '%LearningSupport%'
    AND
    course.course NOT LIKE '%Late Start%'
    AND
    course.course NOT LIKE '%Study Line%'
    AND
    course.course NOT LIKE '%11 Study%'
    AND
    course.course NOT LIKE '%12 Study%'
    AND
    course.course NOT LIKE '%CASPER%'
    AND
    course.course NOT LIKE '%AFL%'
    AND
    course.course NOT LIKE 'CS%'
    AND
    course.course NOT LIKE 'CC %'
    AND
    course.course NOT LIKE '%CBSA%'
    AND
    course.course NOT LIKE '%SCC%'
    AND
    course.course NOT LIKE '%Touch Football%'
    AND
    course.course NOT LIKE '%Soccer%'
    AND
    course.course NOT LIKE '%pprenticeship%'
    AND
    course.course NOT LIKE '%raineeship%'
    AND
    course.course NOT IN ('Cheer Leading','Chess','Cross Country Team','Musical','OzTag/Volleyball','Rosebank Writers')
    )
),

inactive_classes AS (
  SELECT DISTINCT
    department.department_id,
    course.course_id,
    course.meta_course_id,
    period_class.class_id,
    teacher.teacher_id,
    'completed' AS status
  
  FROM period_class

  -- Classes / Courses
  INNER JOIN class ON class.class_id = period_class.class_id
  INNER JOIN course ON course.course_id = class.course_id
  INNER JOIN subject ON subject.subject_id = course.subject_id
  INNER JOIN department ON department.department_id = subject.department_id

  -- Teachers
  INNER JOIN perd_cls_teacher ON period_class.period_class_id = perd_cls_teacher.period_class_id
  INNER JOIN teacher ON perd_cls_teacher.teacher_id = teacher.teacher_id
  INNER JOIN staff ON staff.contact_id = teacher.contact_id

  WHERE
    perd_cls_teacher.teacher_id IN (SELECT teacher_id FROM inactive_teachers)
    AND
    class.academic_year_id IN (SELECT academic_year_id FROM academic_year WHERE academic_year >= 2014)
    AND
    (period_class.effective_start BETWEEN DATE(YEAR(current date - 1 YEAR) || '-01-10') AND (current date - 1 DAYS)
    AND
    period_class.effective_end < (current date))
    AND
    class.class_type_id IN (1, 9, 1101, 1124)
    AND
    (
      course.course NOT IN ('AP and CofCC','AP and DofAdmin','AP and DofPCare','AP+Dcurric','Assistant Principal and Co-Curricular Coordinator','Assistant Principal and CompliSpace','Brady','Brass Ensemble','CAPA','Cassidy','Caulfield','Concert Band','Delaney','DofCurric and CofLSupport','DofCurric and CofT/L','DofCurriculum+English+LSupport','DPCare and PC','Drama Ensemble','Dwyer','EnrichED','EnrichED Withdrawal Lesson','EnvironGp','FundGp','Homework Club','Homework Club','Homework Club','Homework Club','Hospitality','Jazz Ensemble','Learning Support Ancient History','Learning Support Group','McLaughlin','O&#039;Connor','Percussion Ensemble','Principal and DofAdmin','Principal and DofCurric','Principal and DofPCare','SClub','SRSC Support','String Ensemble','Stringettes','Student Forum','Vaughan','Woodwind Ensemble')
      AND
      course.course NOT LIKE 'Rosebank%'
      AND
      course.course NOT LIKE '%usic Instrumenta%'
      AND
      course.course NOT LIKE '%eeting%'
      AND
      course.course NOT LIKE '%Pastoral Care%'
      AND
      course.course NOT LIKE '%TVET%'
      AND
      course.course NOT LIKE '%Early Leave%'
      AND
      course.course NOT LIKE '%Open High School%'
      AND
      course.course NOT LIKE '%Saturday School%'
      AND
      course.course NOT LIKE '%Careers%'
      AND
      course.course NOT LIKE '%Distance Education%'
      AND
      course.course NOT LIKE '%Life Skills%'
      AND
      course.course NOT LIKE '%LearningSupport%'
      AND
      course.course NOT LIKE '%Late Start%'
      AND
      course.course NOT LIKE '%Study Line%'
      AND
      course.course NOT LIKE '% Study'
      AND
      course.course NOT LIKE '%CASPER%'
      AND
      course.course NOT LIKE '%SPOOKY%'
      AND
      course.course NOT LIKE '%AFL%'
      AND
      course.course NOT LIKE 'CS%'
      AND
      course.course NOT LIKE 'CR%'
      AND
      course.course NOT LIKE 'CC %'
      AND
      course.course NOT LIKE '%CBSA%'
      AND
      course.course NOT LIKE '%SCC%'
      AND
      course.course NOT LIKE '%Touch Football%'
      AND
      course.course NOT LIKE '%Soccer%'
      AND
      course.course NOT LIKE '%pprenticeship%'
      AND
      course.course NOT LIKE '%raineeship%'
      AND
      course.course NOT IN ('Cheer Leading','Chess','Cross Country Team','Musical','OzTag/Volleyball','Rosebank Writers')
    )
),

combined AS (
  SELECT * FROM active_classes
  UNION
  SELECT * FROM inactive_classes
)

SELECT * FROM (
  SELECT DISTINCT
    TO_CHAR((current date), 'YYYY') || '-' || (CASE WHEN meta_course.code IS null THEN course.code ELSE meta_course.code END) AS "course_id",
    null as "root_account",
    contact.contact_id AS "contact_id",
    contact.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "user_id",
    'teacher' AS "role",
    TO_CHAR((current date), 'YYYY') || '-' || (CASE WHEN meta_course.course IS null THEN course.code ELSE course.code END) || class.identifier AS "section_id",
    status AS "status",
    null AS "associated_user_id"
  
  FROM combined
  
  INNER JOIN course ON course.course_id = combined.course_id
  LEFT JOIN course meta_course ON meta_course.course_id = combined.meta_course_id
  INNER JOIN class ON class.class_id = combined.class_id
  
  INNER JOIN teacher ON teacher.teacher_id = combined.teacher_id
  INNER JOIN contact ON contact.contact_id = teacher.contact_id
  INNER JOIN staff ON staff.contact_id = teacher.contact_id
  
  -- Ignore 'No Teacher' staff member
  WHERE staff.staff_id != 827
)