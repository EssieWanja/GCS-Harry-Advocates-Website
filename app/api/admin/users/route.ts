import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { guard, jsonError, parseFields, readJson } from '@/lib/admin-api'
import { publicUser, userFields } from '@/lib/admin-users'
import { adminUsers, getDb } from '@/lib/db'
import { hashPassword } from '@/lib/passwords'

export const dynamic = 'force-dynamic'

export async function GET() {
  return guard(async () => {
    const items = await (await getDb()).select().from(adminUsers).orderBy(asc(adminUsers.name))
    const ownerEmail = process.env.ADMIN_EMAIL
    // The owner account lives in the environment, so it is listed but cannot be edited here.
    const owner = ownerEmail ? [{ id: 'owner', name: process.env.ADMIN_NAME || 'Administrator', email: ownerEmail, role: 'admin', owner: true, createdAt: null, updatedAt: null }] : []
    return NextResponse.json({ items: [...owner, ...items.map(publicUser)] })
  })
}

export async function POST(request: Request) {
  return guard(async () => {
    const body = await readJson(request)
    const parsed = parseFields(body, userFields, 'create')
    if (parsed.error) return jsonError(parsed.error)
    const password = String(body.password ?? '')
    if (password.length < 8) return jsonError('Password must be at least 8 characters.')
    const email = String(parsed.values.email).toLowerCase()
    if (email === process.env.ADMIN_EMAIL?.toLowerCase()) return jsonError('That email belongs to the owner account.', 409)
    const [item] = await (await getDb()).insert(adminUsers).values({
      name: String(parsed.values.name),
      email,
      role: String(parsed.values.role ?? 'editor'),
      passwordHash: await hashPassword(password),
    }).returning()
    return NextResponse.json({ item: publicUser(item) }, { status: 201 })
  })
}
