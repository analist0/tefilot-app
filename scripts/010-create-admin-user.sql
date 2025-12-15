-- Create admin user for existing user
-- This script upgrades the first registered user to admin

-- If you have a specific email you want to make admin, use this:
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'liatibar5@gmail.com';

-- Or upgrade the first user to admin:
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Verify admin was created
SELECT email, role, created_at 
FROM profiles 
WHERE role = 'admin';
