import type { Metadata } from 'next'
import Link from 'next/link'
import { desc, ilike, or } from 'drizzle-orm'
import { ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { consultationRequests, getDb, insights, matters, newsletterSubscribers, practiceAreas, teamMembers, testimonials } from '@/lib/db'

export const metadata: Metadata = { title: 'Search' }

type Result = { title: string; detail: string; href: string }

async function searchEverything(query: string): Promise<{ section: string; results: Result[] }[]> {
  const db = await getDb()
  // Escape LIKE wildcards so a search for "50%" matches the literal text.
  const term = `%${query.replace(/[\\%_]/g, (character) => `\\${character}`)}%`
  const [requestRows, matterRows, practiceRows, teamRows, insightRows, testimonialRows, subscriberRows] = await Promise.all([
    db.select().from(consultationRequests).where(or(ilike(consultationRequests.fullName, term), ilike(consultationRequests.email, term), ilike(consultationRequests.practiceArea, term), ilike(consultationRequests.message, term))).orderBy(desc(consultationRequests.createdAt)).limit(10),
    db.select().from(matters).where(or(ilike(matters.title, term), ilike(matters.clientName, term), ilike(matters.notes, term), ilike(matters.responsible, term))).limit(10),
    db.select().from(practiceAreas).where(or(ilike(practiceAreas.title, term), ilike(practiceAreas.summary, term), ilike(practiceAreas.content, term))).limit(10),
    db.select().from(teamMembers).where(or(ilike(teamMembers.name, term), ilike(teamMembers.role, term), ilike(teamMembers.bio, term))).limit(10),
    db.select().from(insights).where(or(ilike(insights.title, term), ilike(insights.excerpt, term), ilike(insights.content, term), ilike(insights.category, term))).limit(10),
    db.select().from(testimonials).where(or(ilike(testimonials.quote, term), ilike(testimonials.authorName, term), ilike(testimonials.authorRole, term))).limit(10),
    db.select().from(newsletterSubscribers).where(ilike(newsletterSubscribers.email, term)).limit(10),
  ])
  return [
    { section: 'Enquiries & consultations', results: requestRows.map((row) => ({ title: row.fullName, detail: `${row.practiceArea} · ${row.status}`, href: row.status === 'new' ? '/admin/enquiries' : '/admin/consultations' })) },
    { section: 'Matters', results: matterRows.map((row) => ({ title: row.title, detail: `${row.clientName} · ${row.status}`, href: `/admin/matters?edit=${row.id}` })) },
    { section: 'Practice areas', results: practiceRows.map((row) => ({ title: row.title, detail: row.summary ?? '', href: `/admin/practice-areas?edit=${row.id}` })) },
    { section: 'Team profiles', results: teamRows.map((row) => ({ title: row.name, detail: row.role, href: `/admin/team?edit=${row.id}` })) },
    { section: 'Insights', results: insightRows.map((row) => ({ title: row.title, detail: `${row.category ?? 'Uncategorised'} · ${row.status}`, href: `/admin/insights?edit=${row.id}` })) },
    { section: 'Testimonials', results: testimonialRows.map((row) => ({ title: row.authorName, detail: row.quote, href: `/admin/testimonials?edit=${row.id}` })) },
    { section: 'Subscribers', results: subscriberRows.map((row) => ({ title: row.email, detail: 'Newsletter subscriber', href: '/admin/subscribers' })) },
  ].filter((group) => group.results.length)
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = ((await searchParams).q ?? '').trim()
  const groups = query ? await searchEverything(query) : []

  return (
    <>
      <PageHeader eyebrow="SEARCH" title={query ? `Results for “${query}”` : 'Search'} description="Searches enquiries, matters, practice areas, team profiles, insights, testimonials and subscribers." />
      {!query ? (
        <section className="panel p-10 text-center text-muted text-[13px]">Type in the search box at the top of the page and press Enter.</section>
      ) : groups.length === 0 ? (
        <section className="panel p-10 text-center text-muted text-[13px]">Nothing found for “{query}”. Try a shorter or different word.</section>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.section} className="panel">
              <div className="panel-heading"><h2>{group.section}</h2><span className="text-[11px] text-muted">{group.results.length} found</span></div>
              <ul className="border-t border-line divide-y divide-line">
                {group.results.map((result, index) => (
                  <li key={`${result.href}-${index}`}>
                    <Link href={result.href} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#fcfaf7]">
                      <div className="min-w-0 flex-1"><strong className="block text-[13px] text-navy">{result.title}</strong><span className="block text-[11px] text-muted truncate mt-0.5">{result.detail}</span></div>
                      <ChevronRight size={16} className="text-muted shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
