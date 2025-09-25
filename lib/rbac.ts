import { supabase } from './supabase'
import { AppRole, AppPermission } from './supabase'

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data.role
}

export async function assignUserRole(userId: string, role: AppRole): Promise<boolean> {
  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role })

  return !error
}

export async function checkPermission(userId: string, permission: AppPermission): Promise<boolean> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('role')
    .eq('permission', permission)
    .single()

  if (error || !data) return false

  // Check if user has the required role
  const userRole = await getUserRole(userId)
  return userRole === data.role
}

// Helper function to get user role from JWT
export function getUserRoleFromJWT(): AppRole | null {
  if (typeof window === 'undefined') return null
  
  try {
    const token = localStorage.getItem('supabase.auth.token')
    if (!token) return null
    
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.user_role || null
  } catch {
    return null
  }
}
