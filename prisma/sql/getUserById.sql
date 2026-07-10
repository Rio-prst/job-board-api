-- @param {BigInt} $1:id
SELECT 
  id, 
  email, 
  name, 
  role,
  created_at AS "createdAt"
FROM users 
WHERE id = $1 
LIMIT 1;