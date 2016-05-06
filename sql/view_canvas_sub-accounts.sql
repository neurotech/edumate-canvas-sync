-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_SUBACCOUNTS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_SUBACCOUNTS (
  account_id,
  parent_account_id,
  name,
  status
) AS

SELECT
  -- The '+ 1' is to avoid conflicts with the pre-existing 'Rosebank College' account in Canvas with the ID of 1.
  (department_id + 1) AS "account_id",
  null AS "parent_account_id",
  department.department AS "name",
  'active' AS "status"

FROM department

WHERE department NOT IN ('Co-curricular', 'External', 'Meetings')
