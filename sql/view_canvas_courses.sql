-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_COURSES" TO USER DASHBOARD
 
CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_COURSES (
  course_id,
  short_name,
  long_name,
  account_id,
  term_id,
  status
) AS

WITH active_courses AS (
  SELECT DISTINCT course_id
  
  FROM view_student_class_enrolment
  
  WHERE
    academic_year_id = (SELECT academic_year_id FROM academic_year WHERE academic_year = YEAR(current date))
    AND
    class_type_id IN (1, 9, 1101, 1124)
    AND
    (start_date <= (current date)
    AND
    end_date >= (current date))
    AND
    (course NOT LIKE '%Pastoral Care%'
    AND
    course NOT LIKE '%TVET%'
    AND
    course NOT LIKE '%Early Leave%'
    AND
    course NOT LIKE '%Open High School%'
    AND
    course NOT LIKE '%Saturday School%'
    AND
    course NOT LIKE '%Careers%'
    AND
    course NOT LIKE '%Distance Education%'
    AND
    course NOT LIKE '%Life Skills%'
    AND
    course NOT LIKE '%LearningSupport%'
    AND
    course NOT LIKE '%Late Start%'
    AND
    course NOT LIKE '%Study Line%'
    AND
    course NOT LIKE '% Study'
    AND
    course NOT LIKE '%raineeship%'
    AND
    course NOT LIKE '%pprenticeship%'
    AND
    course NOT LIKE '%CASPER%'
    AND
    course NOT LIKE '%AFL%'
    AND
    course NOT LIKE 'CS%'
    AND
    course NOT LIKE 'CC %'
    AND
    course NOT LIKE '%CBSA%'
    AND
    course NOT LIKE '%SCC%'
    AND
    course NOT LIKE '%Touch Football%'
    AND
    course NOT LIKE '%Soccer%'
    AND
    course NOT IN ('Cheer Leading','Chess','Cross Country Team','Musical','OzTag/Volleyball','Rosebank Writers')
    )
),

meta_courses AS (
  SELECT
    (CASE WHEN course.meta_course_id IS null THEN active_courses.course_id ELSE course.meta_course_id END) AS COURSE_ID

  FROM active_courses
  
  INNER JOIN course ON course.course_id = active_courses.course_id
),

combined AS (
  SELECT DISTINCT course_id FROM meta_courses
)

SELECT * FROM (
  SELECT
    TO_CHAR((current date), 'YYYY') || '-' || course.code AS "course_id",
    REPLACE(course.course, '&amp;', ' & ') AS "short_name",
    REPLACE(course.course, '&amp;', ' & ') AS "long_name",
    (department.department_id + 1) AS "account_id",
    (CASE
      WHEN LEFT(TO_CHAR(course.code), 2) IN ('07','08','09','10','11','S5') THEN (SELECT term_id FROM DB2INST1.view_canvas_terms WHERE name LIKE '%Year 7%')
      WHEN LEFT(TO_CHAR(course.code), 2) = '12' THEN (SELECT term_id FROM DB2INST1.view_canvas_terms WHERE name LIKE '%Year 12%')
      ELSE null
    END) AS "term_id",
    'active' AS "status"
  
  FROM combined
  
  INNER JOIN course ON course.course_id = combined.course_id
  INNER JOIN subject ON subject.subject_id = course.subject_id
  INNER JOIN department ON department.department_id = subject.department_id
  
  ORDER BY course.sort_order, department.department, course.course
)