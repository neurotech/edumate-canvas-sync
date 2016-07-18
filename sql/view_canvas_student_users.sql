-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_STUDENT_USERS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_STUDENT_USERS (
  user_id,
  login_id,
  password,
  first_name,
  last_name,
  sortable_name,  
  short_name,
  email,
  status
) AS
 
WITH active_students AS (
  SELECT student_id, student_status_id
  FROM TABLE(edumate.getAllStudentStatus(current date))
  WHERE
    student_status_id IN (5,2)
    AND
    end_date >= DATE('2015-05-01')
)

SELECT * FROM (
  SELECT
    contact.contact_id || '.' || student.student_number || '.' || student.student_id AS "user_id",
    (CASE WHEN sys_user.username IS null THEN LEFT(contact.email_address, LENGTH(contact.email_address) - 25) ELSE sys_user.username END) AS "login_id",
    null AS "password",
    REPLACE(COALESCE(contact.preferred_name, contact.firstname), '&#039;', '''') AS "first_name",
    REPLACE(contact.surname, '&#039;', '''') AS "last_name",
    REPLACE(contact.surname, '&#039;', '''') || ', ' || REPLACE(COALESCE(contact.preferred_name, contact.firstname), '&#039;', '''') AS "sortable_name",
    REPLACE(COALESCE(contact.preferred_name, contact.firstname), '&#039;', '''') || ' ' || REPLACE(contact.surname, '&#039;', '''') AS "short_name",
    contact.email_address AS "email",
    'active' AS "status"
  
  FROM active_students
  
  INNER JOIN student ON student.student_id = active_students.student_id
  INNER JOIN contact ON contact.contact_id = student.contact_id
  LEFT JOIN sys_user ON sys_user.contact_id = student.contact_id
  
  ORDER BY active_students.student_status_id DESC, UPPER(contact.surname), UPPER(contact.preferred_name), UPPER(contact.firstname)
)