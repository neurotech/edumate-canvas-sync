CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_EPORTFOLIO_COURSES (
  course_id,
  short_name,
  long_name,
  account_id,
  term_id,
  status,
  start_date,
  end_date,
  student_id
) AS

WITH current_students AS (
  SELECT *
  FROM TABLE(EDUMATE.get_currently_enroled_students(current date))
)

SELECT * FROM (
  SELECT
    YEAR(current date) || '-EP-' || student.student_number AS "COURSE_ID",
    COALESCE(contact.preferred_name, contact.firstname) || ' ' || contact.surname || ' - ePortfolio (' || student.student_number || ')' AS "SHORT_NAME",
    COALESCE(contact.preferred_name, contact.firstname) || ' ' || contact.surname || ' - ePortfolio (' || student.student_number || ')' AS "LONG_NAME",
    'EPORTFOLIOS' AS "ACCOUNT_ID",
    null AS "TERM_ID",
    'active' AS "STATUS",
    TO_CHAR(gass.start_date, 'YYYY-MM-DD') AS "START_DATE",
    TO_CHAR(student_form_run.end_date, 'YYYY-MM-DD') AS "END_DATE",
    current_students.student_id AS "STUDENT_ID"
  
  FROM current_students
  
  INNER JOIN student ON student.student_id = current_students.student_id
  INNER JOIN contact ON contact.contact_id = student.contact_id
  
  INNER JOIN view_student_form_run vsfr ON vsfr.student_id = current_students.student_id AND academic_year = YEAR(current date)
  INNER JOIN form ON form.form_id = vsfr.form_id
  
  INNER JOIN TABLE(EDUMATE.getallstudentstatus(current date)) gass ON gass.student_id = current_students.student_id
  INNER JOIN student_form_run ON student_form_run.form_run_id = gass.last_form_run_id AND student_form_run.student_id = gass.student_id
  
  WHERE form.short_name != '12'
  
  ORDER BY contact.surname, contact.preferred_name, contact.firstname
)