-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_PARENT_USERS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_PARENT_USERS (
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
 
WITH current_parents AS (
  SELECT *
  FROM DB2INST1.view_parent_user_accounts
  WHERE status IN ('active', 'deleted')
)

SELECT * FROM (
  SELECT
    current_parents.contact_id || '.' || current_parents.carer_number || '.' || current_parents.carer_id AS "user_id",
    current_parents.username AS "login_id",
    null AS "password",
    current_parents.firstname AS "first_name",
    REPLACE(current_parents.surname, '&#039;', '''') AS "last_name",
    REPLACE(current_parents.surname, '&#039;', '''') || ', ' || current_parents.firstname || ' (Parent)' AS "sortable_name",
    REPLACE(current_parents.fullname, '&#039;', '''') AS "short_name",
    current_parents.email_address AS "email",
    current_parents.status
  
  FROM current_parents
  
  ORDER BY status ASC
)