-- Create admin user account in the profiles table
INSERT INTO profiles (id, email, full_name, role, points, level, streak_days, created_at, updated_at)
VALUES (
  'admin-123-456-789-000',
  'admin123@greenovate.com',
  'System Administrator',
  'admin',
  0,
  1,
  0,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;