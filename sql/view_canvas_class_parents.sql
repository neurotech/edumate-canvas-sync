CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_CLASS_PARENTS (
  course_id,
  root_account,
  contact_id,
  user_id,
  role,
  section_id,
  status,
  associated_user_id
) AS

WITH raw_data AS (
  SELECT
    current.carer_contact_id,
    carer.contact_id || '.' || carer.carer_number || '.' || carer.carer_id AS "CARER_USER_ID",
    student.contact_id || '.' || student.student_number || '.' || student.student_id AS "STUDENT_USER_ID"
  
  FROM DB2INST1.view_current_carers_with_student_id current
  
  INNER JOIN student ON student.student_id = current.student_id
  INNER JOIN carer ON carer.contact_id = current.carer_contact_id
)

SELECT * FROM (
  SELECT
    vccs.course_id,
    vccs.root_account,
    raw_data.carer_contact_id AS "CONTACT_ID",
    raw_data.carer_user_id AS "USER_ID",
    'Observer' AS "ROLE",
    vccs.section_id,
    vccs.status,
    raw_data.student_user_id AS "ASSOCIATED_USER_ID"
  
  FROM raw_data
  
  INNER JOIN DB2INST1.view_canvas_class_students vccs ON vccs.user_id = raw_data.student_user_id
  
  ORDER BY raw_data.carer_user_id, vccs.course_id
)