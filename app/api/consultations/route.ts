import { NextResponse } from 'next/server'
import { consultationRequests, getDb } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json() as Record<string, string>
  if (!body.fullName?.trim() || !body.email?.includes('@') || !body.practiceArea?.trim()) return NextResponse.json({ error: 'Name, email and practice area are required.' }, { status: 400 })
  try {
    const db = await getDb()
    const [created] = await db.insert(consultationRequests).values({ fullName: body.fullName.trim(), email: body.email.trim().toLowerCase(), phone: body.phone?.trim() || null, practiceArea: body.practiceArea.trim(), message: body.message?.trim() || null, preferredDate: body.preferredDate ? new Date(body.preferredDate) : null }).returning()
    return NextResponse.json({ request: created }, { status: 201 })
  } catch (error) {
    console.error('[consultations]', error)
    return NextResponse.json({ error: 'We could not send your request just now. Please call or email us directly.' }, { status: 503 })
  }
}
