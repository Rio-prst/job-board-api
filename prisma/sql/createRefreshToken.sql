-- @param {String} $1:tokenHash
-- @param {BigInt} $2:userId
-- @param {DateTime} $3:expiresAt
INSERT INTO refresh_tokens (token_hash, user_id, expires_at) 
VALUES ($1, $2, $3) 
RETURNING id;