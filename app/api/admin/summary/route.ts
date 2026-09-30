import { NextResponse } from 'next/server'
import { count, desc, eq, gte, type SQL } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import { guard } from '@/lib/admin-api'
import { consultationRequests, getDb, insights, matters, newsletterSubscribers, practiceAreas, teamMembers, testimonials } from '@/lib/db'

export const dynamic = 'force-dynamic'

export type ActivityKind = 'request' | 'insight' | 'team' | 'testimonial' | 'practice' | 'matter' | 'subscriber'
type ActivityItem = { kind: ActivityKind; title: string; detail: string; at: Date; href: string }

const changed = (item: { createdAt: Date; updatedAt: Date }) => item.updatedAt.getTime() - item.createdAt.getTime() > 2000

// Counts, upcoming consultations and a recent-activity feed for the dashboard and sidebar badges.
export async function GET(request: Request) {
  return guard(async () => {
    const db = await getDb()
    const limit = Math.min(Number(new URL(request.url).searchParams.get('activity')) || 8, 100)
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const tally = async (table: PgTable, where?: SQL) => {
      const [row] = await db.select({ total: count() }).from(table).where(where)
      return Number(row?.total ?? 0)
    }

    const [newRequests, confirmed, openMatters, subscribers, requestsThisMonth, livePractice, liveInsights, liveTeam, draftInsights, pendingTestimonials] = await Promise.all([
      tally(consultationRequests, eq(consultationRequests.status, 'new')),
      tally(consultationRequests, eq(consultationRequests.status, 'confirmed')),
      tally(matters, eq(matters.status, 'open')),
      tally(newsletterSubscribers),
      tally(consultationRequests, gte(consultationRequests.createdAt, monthStart)),
      tally(practiceAreas, eq(practiceAreas.status, 'published')),
      tally(insights, eq(insights.status, 'published')),
      tally(teamMembers, eq(teamMembers.status, 'published')),
      tally(insights, eq(insights.status, 'draft')),
      tally(testimonials, eq(testimonials.status, 'pending')),
    ])

    const [requests, recentInsights, recentTeam, recentTestimonials, recentPractice, recentMatters, recentSubscribers] = await Promise.all([
      db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt)).limit(Math.max(limit, 50)),
      db.select().from(insights).orderBy(desc(insights.updatedAt)).limit(limit),
      db.select().from(teamMembers).orderBy(desc(teamMembers.updatedAt)).limit(limit),
      db.select().from(testimonials).orderBy(desc(testimonials.updatedAt)).limit(limit),
      db.select().from(practiceAreas).orderBy(desc(practiceAreas.updatedAt)).limit(limit),
      db.select().from(matters).orderBy(desc(matters.updatedAt)).limit(limit),
      db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt)).limit(limit),
    ])

    const activity: ActivityItem[] = [
      ...requests.slice(0, limit).map((item) => ({ kind: 'request' as const, title: 'New consultation request', detail: `${item.fullName} · ${item.practiceArea}`, at: item.createdAt, href: item.status === 'new' ? '/admin/enquiries' : '/admin/consultations' })),
      ...recentInsights.map((item) => ({ kind: 'insight' as const, title: item.status === 'published' ? (changed(item) ? 'Insight updated' : 'Insight published') : 'Insight draft saved', detail: item.title, at: item.updatedAt, href: '/admin/insights' })),
      ...recentTeam.map((item) => ({ kind: 'team' as const, title: changed(item) ? 'Team profile updated' : 'Team profile added', detail: `${item.name} · ${item.role}`, at: item.updatedAt, href: '/admin/team' })),
      ...recentTestimonials.map((item) => ({ kind: 'testimonial' as const, title: item.status === 'approved' ? 'Testimonial approved' : 'Testimonial awaiting review', detail: item.authorName, at: item.updatedAt, href: '/admin/testimonials' })),
      ...recentPractice.map((item) => ({ kind: 'practice' as const, title: changed(item) ? 'Practice area updated' : 'Practice area added', detail: item.title, at: item.updatedAt, href: '/admin/practice-areas' })),
      ...recentMatters.map((item) => ({ kind: 'matter' as const, title: changed(item) ? 'Matter updated' : 'Matter opened', detail: `${item.title} · ${item.clientName}`, at: item.updatedAt, href: '/admin/matters' })),
      ...recentSubscribers.map((item) => ({ kind: 'subscriber' as const, title: 'New newsletter subscriber', detail: item.email, at: item.createdAt, href: '/admin/subscribers' })),
    ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit)

    // Booked-in first by appointment date, then requests still waiting for a date.
    const upcoming = requests
      .filter((item) => ['new', 'pending', 'confirmed'].includes(item.status))
      .sort((a, b) => (a.preferredDate?.getTime() ?? Infinity) - (b.preferredDate?.getTime() ?? Infinity) || b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6)

    return NextResponse.json({
      upcoming,
      activity,
      counts: {
        newRequests, confirmed, openMatters, subscribers, requestsThisMonth, draftInsights, pendingTestimonials,
        pendingReviews: draftInsights + pendingTestimonials,
        // Fixed pages (home, about, values, team, insights, gallery, contact) plus each live profile, practice area and article.
        publishedPages: 7 + livePractice + liveInsights + liveTeam,
      },
      syncedAt: now.toISOString(),
    })
  })
}
