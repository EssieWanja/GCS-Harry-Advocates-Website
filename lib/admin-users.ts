import type { AdminUser } from '@/lib/db'

export const userFields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'role', label: 'Role', type: 'enum' as const, values: ['admin', 'editor'] },
]

/** Strips the password hash before a user record leaves the server. */
export function publicUser({ passwordHash: _passwordHash, ...user }: AdminUser) {
  return { ...user, owner: false }
}
