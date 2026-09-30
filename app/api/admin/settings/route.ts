import { NextResponse } from 'next/server'
import { guard, readJson, refreshSite } from '@/lib/admin-api'
import { getSiteSettings } from '@/lib/content'
import { getDb, siteSettings } from '@/lib/db'
import { settingKeys } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  return guard(async () => NextResponse.json({ settings: await getSiteSettings() }))
}

export async function PUT(request: Request) {
  return guard(async () => {
    const body = await readJson(request)
    const db = await getDb()
    for (const key of settingKeys) {
      if (!(key in body)) continue
      const value = String(body[key] ?? '').trim()
      await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } })
    }
    refreshSite()
    return NextResponse.json({ settings: await getSiteSettings() })
  })
}
