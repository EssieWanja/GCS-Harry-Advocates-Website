import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { guard } from '@/lib/admin-api'
import { getDb, newsletterSubscribers } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return guard(async () => {
    const db = await getDb()
    const items = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt))
    if (new URL(request.url).searchParams.get('format') === 'csv') {
      const csv = ['email,subscribed_at', ...items.map((item) => `${item.email},${item.createdAt.toISOString()}`)].join('\n')
      return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"' } })
    }
    return NextResponse.json({ items })
  })
}
