-- @param {String} $1:email
SELECT 
  id, 
  email, 
  password, 
  name, 
  role, 
  created_at AS "createdAt"
FROM users 
WHERE email = $1 
LIMIT 1;