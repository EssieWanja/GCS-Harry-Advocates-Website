import { NextResponse } from 'next/server'
import { getDb, newsletterSubscribers } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json() as Record<string, string>
  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  try {
    await (await getDb()).insert(newsletterSubscribers).values({ email }).onConflictDoNothing()
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('[subscribe]', error)
    return NextResponse.json({ error: 'Subscriptions are temporarily unavailable. Please email us directly.' }, { status: 503 })
  }
}
