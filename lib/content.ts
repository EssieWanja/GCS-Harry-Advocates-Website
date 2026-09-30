import { asc, desc, eq } from 'drizzle-orm'
import { getDb, insights, practiceAreas, siteSettings, teamMembers, testimonials } from '@/lib/db'
import { MANAGER_SLUG, insightSeed, practiceAreaSeed, teamMemberSeed, testimonialSeed } from '@/lib/seed'
import { defaultSettings, settingKeys, type SiteSettings } from '@/lib/settings'

export { MANAGER_SLUG }

// Every reader falls back to the starter content if the database is unreachable,
// so the public site never shows an error page because of a database outage.
async function withFallback<T>(read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read()
  } catch (error) {
    console.error('[content] database read failed, showing starter content', error)
    return fallback()
  }
}

const seedMeta = (index: number) => ({ id: `seed-${index}`, createdAt: new Date(), updatedAt: new Date() })

export function getPracticeAreas() {
  return withFallback(
    async () => (await getDb()).select().from(practiceAreas).where(eq(practiceAreas.status, 'published')).orderBy(asc(practiceAreas.sortOrder), asc(practiceAreas.title)),
    () => practiceAreaSeed.map((item, index) => ({ ...seedMeta(index), status: 'published', ...item })),
  )
}

export async function getPracticeArea(slug: string) {
  const all = await getPracticeAreas()
  return all.find((item) => item.slug === slug) ?? null
}

export function getTeamMembers() {
  return withFallback(
    async () => (await getDb()).select().from(teamMembers).where(eq(teamMembers.status, 'published')).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name)),
    () => teamMemberSeed.map((item, index) => ({ ...seedMeta(index), status: 'published', ...item })),
  )
}

export async function getManager() {
  const all = await getTeamMembers()
  return all.find((item) => item.slug === MANAGER_SLUG) ?? null
}

export async function getTeamMember(slug: string) {
  const all = await getTeamMembers()
  return all.find((item) => item.slug === slug) ?? null
}

export function getInsights() {
  return withFallback(
    async () => (await getDb()).select().from(insights).where(eq(insights.status, 'published')).orderBy(desc(insights.publishedAt)),
    () => insightSeed.map((item, index) => ({ ...seedMeta(index), status: 'published', publishedAt: new Date(), ...item })),
  )
}

export async function getInsight(slug: string) {
  const all = await getInsights()
  return all.find((item) => item.slug === slug) ?? null
}

export function getTestimonials() {
  return withFallback(
    async () => (await getDb()).select().from(testimonials).where(eq(testimonials.status, 'approved')).orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt)),
    () => testimonialSeed.map((item, index) => ({ ...seedMeta(index), status: 'approved', ...item })),
  )
}

export function getSiteSettings(): Promise<SiteSettings> {
  return withFallback(
    async () => {
      const rows = await (await getDb()).select().from(siteSettings)
      const saved = Object.fromEntries(rows.filter((row) => (settingKeys as string[]).includes(row.key)).map((row) => [row.key, row.value]))
      return { ...defaultSettings, ...saved }
    },
    () => ({ ...defaultSettings }),
  )
}
