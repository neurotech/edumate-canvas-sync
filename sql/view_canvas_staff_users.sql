-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_STAFF_USERS" TO USER DASHBOARD

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_STAFF_USERS (
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

SELECT * FROM (
  SELECT
    gm.contact_id || '.' || staff.staff_number || '.' || staff.staff_id AS "user_id",
    sys_user.username AS "login_id",
    null AS "password",
    (CASE WHEN contact.preferred_name IS null THEN contact.firstname ELSE contact.preferred_name END) AS "first_name",
    REPLACE(contact.surname, '&#039;', '''') AS "last_name",
    REPLACE(contact.surname, '&#039;', '''') || ', ' || (CASE WHEN contact.preferred_name IS null THEN contact.firstname ELSE contact.preferred_name END) AS "sortable_name",
    (CASE WHEN contact.preferred_name IS null THEN contact.firstname ELSE contact.preferred_name END) || ' ' || REPLACE(contact.surname, '&#039;', '''') AS "short_name",
    contact.email_address AS "email",
    'active' AS "status"
  
  FROM group_membership gm
  
  INNER JOIN staff ON staff.contact_id = gm.contact_id
  INNER JOIN contact ON contact.contact_id = gm.contact_id
  LEFT JOIN sys_user ON sys_user.contact_id = gm.contact_id
  INNER JOIN gender ON gender.gender_id = contact.gender_id
  LEFT JOIN salutation ON salutation.salutation_id = contact.salutation_id
  LEFT JOIN house ON house.house_id = staff.house_id
  
  -- The group with the 'groups_id' of 386 is 'Current Staff'
  WHERE
    gm.groups_id = 386
    AND
    (gm.effective_end IS null
    OR    
    YEAR(gm.effective_end) >= 2015)
  
  ORDER BY UPPER(contact.surname), contact.preferred_name, contact.firstname
)