import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { guard } from '@/lib/admin-api'
import { getDb, newsletterSubscribers } from '@/lib/db'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return guard(async () => {
    const { id } = await params
    await (await getDb()).delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id))
    return NextResponse.json({ ok: true })
  })
}
