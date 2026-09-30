import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { getSession, guard, jsonError, parseFields, readJson } from '@/lib/admin-api'
import { publicUser, userFields } from '@/lib/admin-users'
import { adminUsers, getDb } from '@/lib/db'
import { hashPassword } from '@/lib/passwords'

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  return guard(async () => {
    const { id } = await params
    if (id === 'owner') return jsonError('The owner account is managed in the server environment settings.')
    const body = await readJson(request)
    const parsed = parseFields(body, userFields, 'update')
    if (parsed.error) return jsonError(parsed.error)
    const values: Record<string, unknown> = { ...parsed.values, updatedAt: new Date() }
    if (typeof values.email === 'string') values.email = values.email.toLowerCase()
    const password = String(body.password ?? '')
    if (password) {
      if (password.length < 8) return jsonError('Password must be at least 8 characters.')
      values.passwordHash = await hashPassword(password)
    }
    const [item] = await (await getDb()).update(adminUsers).set(values).where(eq(adminUsers.id, id)).returning()
    if (!item) return jsonError('This user no longer exists.', 404)
    return NextResponse.json({ item: publicUser(item) })
  })
}

export async function DELETE(_request: Request, { params }: Context) {
  return guard(async () => {
    const { id } = await params
    if (id === 'owner') return jsonError('The owner account cannot be removed.')
    const db = await getDb()
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id))
    if (user && user.email === (await getSession())?.email) return jsonError('You cannot remove your own account while logged in.')
    await db.delete(adminUsers).where(eq(adminUsers.id, id))
    return NextResponse.json({ ok: true })
  })
}
