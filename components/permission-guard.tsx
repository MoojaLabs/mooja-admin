"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUserRoleFromJWT } from '@/lib/rbac'

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth()
  
  if (!user) return <>{fallback}</>

  // Get user role from JWT
  const userRole = getUserRoleFromJWT()
  
  // Simple permission check based on role
  const hasPermission = (() => {
    if (userRole === 'admin') return true // Admin has all permissions
    if (userRole === 'moderator') {
      return !permission.includes('.delete') // Moderators can't delete
    }
    if (userRole === 'viewer') {
      return permission.includes('.read') // Viewers can only read
    }
    return false
  })()

  return hasPermission ? <>{children}</> : <>{fallback}</>
}
