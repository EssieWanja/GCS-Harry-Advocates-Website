import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE, type AdminSession } from '@/lib/auth'
import { adminUsers, getDb } from '@/lib/db'
import { timingSafeStringEqual, verifyPassword } from '@/lib/passwords'

async function authenticate(email: string, password: string): Promise<AdminSession | null> {
  // The owner account configured in the environment always works, even before a database exists.
  const ownerEmail = process.env.ADMIN_EMAIL
  const ownerPassword = process.env.ADMIN_PASSWORD
  if (ownerEmail && ownerPassword && timingSafeStringEqual(email, ownerEmail.toLowerCase())) {
    return timingSafeStringEqual(password, ownerPassword) ? { email: ownerEmail, name: process.env.ADMIN_NAME || 'Administrator', role: 'admin' } : null
  }
  const db = await getDb()
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email))
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null
  return { email: user.email, name: user.name, role: user.role === 'editor' ? 'editor' : 'admin' }
}

export async function POST(request: Request) {
  const { email, password } = await request.json() as { email?: string; password?: string }
  if (typeof email !== 'string' || typeof password !== 'string') return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  if (!process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 500 })

  const session = await authenticate(email.trim().toLowerCase(), password)
  if (!session) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, await createSessionToken(session), sessionCookieOptions)
  return response
}
