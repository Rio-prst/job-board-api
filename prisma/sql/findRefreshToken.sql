-- @param {String} $1:tokenHash
SELECT id, user_id, expires_at 
FROM refresh_tokens 
WHERE token_hash = $1 AND revoked = false
LIMIT 1;