import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8

// 'admin' can do everything; 'editor' manages content and enquiries but not
// admin accounts or site settings.
export type AdminRole = 'admin' | 'editor'
export type AdminSession = { email: string; name: string; role: AdminRole }

export const ADMIN_ONLY_PATHS = ['/admin/users', '/admin/settings', '/api/admin/users', '/api/admin/settings']

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT({ name: session.name, role: session.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    if (!payload.sub) return null
    return { email: payload.sub, name: String(payload.name ?? payload.sub), role: payload.role === 'editor' ? 'editor' : 'admin' }
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
}
