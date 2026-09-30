import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ user: await getSession() })
}
