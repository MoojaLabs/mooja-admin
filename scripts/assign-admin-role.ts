// Script to assign admin role to a user
// Run this in your Supabase SQL Editor after creating a user

// Replace 'USER_EMAIL_HERE' with the actual email of the user you want to make admin
INSERT INTO public.user_roles (user_id, role)
SELECT 
  au.id as user_id,
  'admin' as role
FROM auth.users au
WHERE au.email = 'admin@mooja.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the assignment
SELECT 
  au.email,
  ur.role,
  ur.created_at
FROM auth.users au
JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'admin@mooja.com';
