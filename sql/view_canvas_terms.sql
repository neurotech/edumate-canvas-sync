-- To assign SELECT only access, use this example:
-- GRANT SELECT ON "DB2INST1"."VIEW_CANVAS_TERMS" TO USER DEVELOPMENT

CREATE OR REPLACE VIEW DB2INST1.VIEW_CANVAS_TERMS (
  term_id,
  name,
  status,
  start_date,
  end_date
) AS


WITH all_terms AS (
  SELECT
    timetable.default_flag,
    timetable.timetable AS "TERM_ID",
    term AS "NAME",
    'active' AS "STATUS",
    TO_CHAR(start_date, 'YYYY-MM-DD') || ' 00:00:00' AS "START_DATE",
    TO_CHAR(end_date, 'YYYY-MM-DD') || ' 23:59:00' AS "END_DATE"
  
  FROM term 
  
  INNER JOIN timetable ON timetable.timetable_id = term.timetable_id
  
  WHERE term.timetable_id IN (
    SELECT timetable_id FROM timetable WHERE academic_year_id = (
      SELECT academic_year_id FROM academic_year WHERE academic_year = YEAR(current date)
    ) AND timetable NOT LIKE '%Detentions%'
  )
),

junior_term AS (
  SELECT
    term_id,
    name,
    status,
    start_date,
    (SELECT end_date FROM all_terms WHERE default_flag = 1 AND name = 'Term 4') AS "END_DATE"
  
  FROM all_terms
  
  WHERE default_flag = 1 AND name = 'Term 1'
),

senior_term AS (
  SELECT
    term_id,
    'Term 1' AS "NAME",
    status,
    start_date,
    (SELECT end_date FROM all_terms WHERE default_flag = 0 AND name = 'Term 4') AS "END_DATE"
  
  FROM all_terms
  
  WHERE default_flag = 0 AND name = 'Term 0'
),

final_terms AS (
  SELECT * FROM senior_term
  UNION ALL
  SELECT * FROM junior_term
)

SELECT
  LOWER(REPLACE(term_id, ' ', '_')) AS "TERM_ID",
  final_terms.term_id AS "NAME",
  status,
  start_date,
  end_date
  
FROM final_terms