export type UserRole = "admin" | "editor" | "user"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

// הרשאות לפי תפקיד
export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageArticles: true,
    canManageComments: true,
    canManageSettings: true,
    canAccessAdmin: true,
  },
  editor: {
    canManageUsers: false,
    canManageArticles: true,
    canManageComments: true,
    canManageSettings: false,
    canAccessAdmin: true,
  },
  user: {
    canManageUsers: false,
    canManageArticles: false,
    canManageComments: false,
    canManageSettings: false,
    canAccessAdmin: false,
  },
} as const

export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS.admin): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false
}
