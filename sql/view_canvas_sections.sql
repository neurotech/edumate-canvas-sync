-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_SECTIONS" TO USER DASHBOARD
 
CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_SECTIONS (
  section_id,
  course_id,
  name,
  status,
  start_date,
  end_date
) AS

WITH active_classes AS (
  SELECT DISTINCT course_id, class_id
  
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
    active_classes.course_id,
    course.meta_course_id,
    active_classes.class_id

  FROM active_classes
  
  INNER JOIN course ON course.course_id = active_classes.course_id
),

combined AS (
  SELECT DISTINCT course_id, meta_course_id, class_id FROM meta_courses
)

SELECT * FROM (
  SELECT
    TO_CHAR((current date), 'YYYY') || '-' || (CASE WHEN meta_course.course IS null THEN course.code ELSE course.code END) || class.identifier AS "section_id",
    TO_CHAR((current date), 'YYYY') || '-' || (CASE WHEN meta_course.code IS null THEN course.code ELSE meta_course.code END) AS "course_id",
    REPLACE(class.class, '&amp;', ' & ') AS "name",
    'active' AS "status",
    null AS "start_date",
    null AS "end_date"
  
  FROM combined
  
  INNER JOIN course ON course.course_id = combined.course_id
  LEFT JOIN course meta_course ON meta_course.course_id = combined.meta_course_id
  INNER JOIN class ON class.class_id = combined.class_id
  
  ORDER BY class.class
)