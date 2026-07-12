-- @param {BigInt} $1:id
SELECT
  a.id,
  a.job_id AS "jobId",
  a.user_id AS "userId",
  a.status,
  a.resume_url AS "resumeUrl",
  a.created_at AS "createdAt",
  a.updated_at AS "updatedAt",
  c.user_id AS "companyOwnerUserId"
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN companies c ON c.id = j.company_id
WHERE a.id = $1
LIMIT 1;
