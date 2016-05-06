-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_SUBACCOUNT_ADMINS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_SUBACCOUNT_ADMINS (
  account_id,
  user_id,
  role_id,
  send_confirmation
) AS

WITH departments AS (
  SELECT department_id, department FROM department
  WHERE department NOT IN ('Co-curricular', 'External', 'Meetings')
),

department_heads AS (
  SELECT
    departments.department_id,
    departments.department,
    department_head.staff_id
  
  FROM departments
  
  INNER JOIN department_head ON department_head.department_id = departments.department_id AND (
    effective_start <= (current date) AND (effective_end > (current date) OR effective_end IS null)
  )
)

SELECT
  -- The '+ 1' is to avoid conflicts with the pre-existing 'Rosebank College' account in Canvas with the ID of 1.
  (department_id + 1) AS "account_id",
  staff.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "user_id",
  'FacultyCoordinator' AS "role_id",
  'false' AS "send_confirmation"

FROM department_heads

INNER JOIN staff ON staff.staff_id = department_heads.staff_id