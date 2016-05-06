-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_CLASS_STUDENTS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_CLASS_STUDENTS (
  course_id,
  root_account,
  contact_id,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS

WITH all_students AS (
  SELECT student_id, student_status_id
  FROM TABLE(edumate.getAllStudentStatus(current date))
  WHERE
    student_status_id IN (5,2)
    AND
    YEAR(end_date) >= 2015
),

active_classes AS (
  SELECT DISTINCT
    view_student_class_enrolment.academic_year,
    view_student_class_enrolment.class_id,
    view_student_class_enrolment.course_id,
    course.code,
    view_student_class_enrolment.student_id,
    view_student_class_enrolment.end_date

  FROM view_student_class_enrolment

  INNER JOIN course ON course.course_id = view_student_class_enrolment.course_id

  WHERE
    view_student_class_enrolment.student_id IN (SELECT student_id FROM all_students)
    AND
    academic_year_id = (SELECT academic_year_id FROM academic_year WHERE academic_year = YEAR(current date))
    AND
    class_type_id IN (1, 9, 1101, 1124)
    AND
    (current date) BETWEEN start_date AND end_date
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
    course.course NOT LIKE '% Study'
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
    course.course NOT IN ('Cheer Leading','Chess','Cross Country Team','Musical','OzTag/Volleyball','Rosebank Writers'))
),

meta_courses AS (
  SELECT
    active_classes.academic_year,
    active_classes.student_id,
    active_classes.course_id,
    course.meta_course_id,
    active_classes.class_id,
    'active' AS "STATUS"

  FROM active_classes
  
  INNER JOIN course ON course.course_id = active_classes.course_id
),

combined AS (
  SELECT DISTINCT academic_year, student_id, course_id, meta_course_id, class_id, status FROM meta_courses
),

life_skills_students AS (
  SELECT DISTINCT
    view_student_class_enrolment.academic_year,
    view_student_class_enrolment.student_id,
    view_student_class_enrolment.course_id,
    (CASE
        WHEN course.code = '07MLS' THEN '07MMA'
        WHEN course.code = '08ENLS' THEN '08EEN'
        WHEN course.code = '08MALS' THEN '08MMA'
        WHEN course.code = '08MULS' THEN '08CMU'
        WHEN course.code = '08PDLS' THEN '08PPD'
        WHEN course.code = '08SCLS' THEN '08SSC'
        WHEN course.code = '08TELS' THEN '08TTE'
        WHEN course.code = '08VALS' THEN '08CVA'
        WHEN course.code = '09AHLS' THEN '09IAH'
        WHEN course.code = '09AGLS' THEN '09HGE'
        WHEN course.code = '09RELS' THEN '09RRS'
        WHEN course.code = '09ENLS' THEN '09EEN'
        WHEN course.code = '09TLS' THEN '09EEN'
        WHEN course.code = '09GELS' THEN '09HGE'
        WHEN course.code = '09HILS' THEN '09IHI'
        WHEN course.code = '09MALS' THEN '09MM1'
        WHEN course.code = '09PELS' THEN '09PPD'
        WHEN course.code = '09DMLS' THEN '09CDM'
        WHEN course.code = '09SCLS' THEN '09SSC'
        WHEN course.code = '10AGLS' THEN '10HGE'
        WHEN course.code = '10AHLS' THEN '10IAH'
        WHEN course.code = '10VALS' THEN '10CVA'
        WHEN course.code = '10ENLS' THEN '10EEN'
        WHEN course.code = '10TLS' THEN '10TFT'
        WHEN course.code = '10GELS' THEN '10HGE'
        WHEN course.code = '10HLS' THEN '10HGE'
        WHEN course.code = '10ILS' THEN '10IHI'
        WHEN course.code = '10ITLS' THEN '10LIT'
        WHEN course.code = '10MALS' THEN '10MM1'
        WHEN course.code = '10MLS.0' THEN '10MM1'
        WHEN course.code = '10PDLS' THEN '10PPD'
        WHEN course.code = '10PELS' THEN '10PPD'
        WHEN course.code = '10DMLS' THEN '10CDM'
        WHEN course.code = '10RELS' THEN '10RRS'
        WHEN course.code = '10SCLS' THEN '10SSC'
        WHEN course.code = '11CALS' THEN '11TCA'
        WHEN course.code = '11DRLS' THEN '11CDR'
        WHEN course.code = '11ENLS' THEN '11EES'
        WHEN course.code = '11ITLS' THEN '11TIT'
        WHEN course.code = '11MALS' THEN '11MG1'
        WHEN course.code = '11SCLS' THEN '11PSC'
        WHEN course.code = '11RELS' THEN '11RS1'
        WHEN course.code = '12CALS' THEN '12TCA'
        WHEN course.code = '12DRLS' THEN '12CDR'
        WHEN course.code = '12ENLS' THEN '12EES'
        WHEN course.code = '12ITLS' THEN '12TIT'
        WHEN course.code = '12MALS' THEN '12MM2'
        WHEN course.code = '12RELS' THEN '12RS1'
      ELSE null
    END) AS "CODE",
    class.identifier,
    view_student_class_enrolment.end_date
    
  FROM view_student_class_enrolment
  
  INNER JOIN course ON course.course_id = view_student_class_enrolment.course_id
  INNER JOIN class ON class.class_id = view_student_class_enrolment.class_id
  
  WHERE
    view_student_class_enrolment.student_id IN (SELECT student_id FROM all_students)
    AND
    view_student_class_enrolment.academic_year_id = (SELECT academic_year_id FROM academic_year WHERE academic_year = YEAR(current date))
    AND
    view_student_class_enrolment.class_type_id = 10
    AND
    (start_date <= (current date)
    AND
    (end_date >= (current date) OR end_date < (current date)))
),

life_skills_memberships AS (
  SELECT
    life_skills_students.student_id,
    TO_CHAR(life_skills_students.academic_year) || '-' || (CASE WHEN meta_course.code IS null THEN life_skills_students.code ELSE meta_course.code END) AS "COURSE_ID",
    null AS "ROOT_ACCOUNT",
    student.contact_id,
    student.student_number,
    'student' AS "ROLE",
    TO_CHAR(life_skills_students.academic_year) || '-' || (CASE WHEN meta_course.course IS null THEN course.code ELSE course.code END) || life_skills_students.identifier AS "SECTION_ID",
    (CASE WHEN life_skills_students.end_date < (current date) THEN 'completed' ELSE 'active' END) AS "STATUS",
    null AS "ASSOCIATED_USER_ID"
    
  FROM life_skills_students
  
  INNER JOIN student ON student.student_id = life_skills_students.student_id
  INNER JOIN course ON course.code = life_skills_students.code
  LEFT JOIN course meta_course ON meta_course.course_id = course.meta_course_id

  WHERE life_skills_students.code IS NOT null
),

non_life_skills AS (
  SELECT
    combined.student_id,
    TO_CHAR(combined.academic_year) || '-' || (CASE WHEN meta_course.code IS null THEN course.code ELSE meta_course.code END) AS "course_id",
    null as "root_account",
    student.contact_id AS "contact_id",
    student.student_number,
    'student' AS "role",
    TO_CHAR(combined.academic_year) || '-' || (CASE WHEN meta_course.course IS null THEN course.code ELSE course.code END) || class.identifier AS "section_id",
    combined.status,
    null AS "associated_user_id"

  FROM combined
  
  INNER JOIN course ON course.course_id = combined.course_id
  LEFT JOIN course meta_course ON meta_course.course_id = combined.meta_course_id
  INNER JOIN class ON class.class_id = combined.class_id
  
  INNER JOIN student ON student.student_id = combined.student_id
),

final_combined AS (
  SELECT * FROM life_skills_memberships
  UNION ALL
  SELECT * FROM non_life_skills  
)

SELECT * FROM (
  SELECT
    course_id,
    root_account,
    final_combined.contact_id,
    final_combined.contact_id || '.' || final_combined.student_number || '.' || final_combined.student_id  AS "USER_ID",
    role,
    section_id,
    status,
    associated_user_id

  FROM final_combined

  INNER JOIN contact ON contact.contact_id = final_combined.contact_id

  ORDER BY contact.surname, UPPER(COALESCE(contact.preferred_name, contact.firstname)), course_id
)