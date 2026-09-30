'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, BookOpen, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronRight, CircleCheck, Clock3,
  ExternalLink, FileText, Gavel, Loader2, Mail, MessageSquareText, Plus, ShieldCheck, Users,
} from 'lucide-react'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import { useAdmin } from '@/components/admin/AdminChrome'
import { api, formatDate, initials } from '@/lib/admin-client'

const newContent = [
  { href: '/admin/insights?new=1', icon: FileText, label: 'Insight article' },
  { href: '/admin/practice-areas?new=1', icon: Gavel, label: 'Practice area' },
  { href: '/admin/team?new=1', icon: Users, label: 'Team member' },
  { href: '/admin/testimonials?new=1', icon: ShieldCheck, label: 'Testimonial' },
  { href: '/admin/matters?new=1', icon: BriefcaseBusiness, label: 'Matter' },
]

const tones: Record<string, string> = { new: 'gold', pending: 'blue', confirmed: 'green' }

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

export default function DashboardPage() {
  const { user, summary, refresh } = useAdmin()
  const [menuOpen, setMenuOpen] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  const confirm = async (id: string, name: string) => {
    setBusy(id)
    const result = await api(`/api/admin/requests/${id}`, { method: 'PATCH', body: { status: 'confirmed' } })
    setBusy(null)
    setNotice(result.error ?? `${name}'s consultation confirmed.`)
    window.setTimeout(() => setNotice(''), 3000)
    refresh()
  }

  const counts = summary?.counts
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <>
      {notice && <div className="admin-notice" role="status">{notice}</div>}
      <div className="page-heading">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>{greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
          <p className="subheading">Here&apos;s what is happening across your firm today.</p>
        </div>
        <div className="heading-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="outline-button"><ExternalLink size={15} /> View website</a>
          <div className="relative" ref={menuRef}>
            <button className="primary-button" onClick={() => setMenuOpen((open) => !open)} aria-haspopup="menu" aria-expanded={menuOpen}><Plus size={16} /> New content <ChevronDown size={14} /></button>
            {menuOpen && (
              <div className="admin-menu" role="menu">
                {newContent.map(({ href, icon: Icon, label }) => <Link key={href} href={href} role="menuitem"><Icon size={15} /> {label}</Link>)}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="stat-grid" aria-label="Firm overview">
        <Stat href="/admin/enquiries" icon={MessageSquareText} label="New enquiries" value={counts?.newRequests} trend={`${counts?.requestsThisMonth ?? 0} received this month`} color="gold" />
        <Stat href="/admin/consultations" icon={CalendarDays} label="Confirmed consultations" value={counts?.confirmed} trend="Scheduled with clients" color="navy" />
        <Stat href="/admin/matters" icon={BriefcaseBusiness} label="Open matters" value={counts?.openMatters} trend="Firm workspace" color="green" />
        <Stat href="/admin/subscribers" icon={Mail} label="Newsletter subscribers" value={counts?.subscribers} trend="From the home page sign-up" color="purple" />
      </section>

      <div className="dashboard-grid">
        <section className="panel consultations-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">YOUR CALENDAR</p><h2>Upcoming consultations</h2></div>
            <Link href="/admin/consultations" className="text-button">View all <ArrowUpRight size={14} /></Link>
          </div>
          {!summary ? (
            <p className="p-8 text-center text-muted text-[12px] flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" /> Loading…</p>
          ) : summary.upcoming.length === 0 ? (
            <p className="px-6 pb-8 pt-2 text-muted text-[12px]">No upcoming consultations. New requests from the website contact form will appear here.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>CLIENT</th><th>PRACTICE AREA</th><th>DATE & TIME</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {summary.upcoming.map((item) => {
                    const tone = tones[item.status] ?? 'blue'
                    return (
                      <tr key={item.id}>
                        <td><Link href={item.status === 'new' ? '/admin/enquiries' : '/admin/consultations'} className="client-cell"><div className={`avatar avatar-${tone}`}>{initials(item.fullName)}</div><strong>{item.fullName}</strong></Link></td>
                        <td><span className="muted-cell">{item.practiceArea}</span></td>
                        <td><span className="date-cell"><Clock3 size={14} />{item.preferredDate ? formatDate(item.preferredDate, true) : 'To be arranged'}</span></td>
                        <td><span className={`status status-${tone}`}><i />{item.status[0].toUpperCase() + item.status.slice(1)}</span></td>
                        <td className="text-right">
                          {item.status === 'confirmed' ? null : busy === item.id ? <Loader2 size={16} className="animate-spin inline text-muted" /> : (
                            <button className="more-button" title="Confirm consultation" aria-label={`Confirm ${item.fullName}`} onClick={() => confirm(item.id, item.fullName)}><CircleCheck size={17} /></button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel activity-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">FIRM PULSE</p><h2>Recent activity</h2></div>
          </div>
          {summary ? <ActivityFeed items={summary.activity.slice(0, 5)} /> : <p className="p-8 text-center"><Loader2 size={15} className="animate-spin inline text-muted" /></p>}
          <Link href="/admin/activity" className="activity-footer">View all activity <ArrowUpRight size={14} /></Link>
        </section>
      </div>

      <div className="bottom-grid">
        <section className="panel quick-panel">
          <div className="panel-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h2>Quick actions</h2></div></div>
          <div className="quick-actions">
            <Quick href="/admin/insights?new=1" icon={FileText} title="Write an insight" detail="Publish to your insights page" />
            <Quick href="/admin/team?new=1" icon={Users} title="Add team member" detail="Update the firm directory" />
            <Quick href="/admin/practice-areas" icon={Gavel} title="Manage practice areas" detail="Edit services and descriptions" />
            <Quick href="/admin/testimonials" icon={ShieldCheck} title="Review testimonials" detail="Approve client feedback" />
          </div>
        </section>
        <section className="panel status-panel">
          <div className="panel-heading"><div><p className="eyebrow">PUBLIC WEBSITE</p><h2>Site health</h2></div><span className="live-badge"><i /> Website live</span></div>
          <Link href="/" target="_blank" className="health-row hover:bg-[#fcfaf7]"><span>Pages published</span><strong>{counts?.publishedPages ?? '—'} pages</strong></Link>
          <Link href="/admin/insights" className="health-row hover:bg-[#fcfaf7]"><span>Draft insights</span><strong>{counts?.draftInsights ?? '—'}</strong></Link>
          <Link href="/admin/testimonials" className="health-row hover:bg-[#fcfaf7]"><span>Testimonials awaiting review</span><strong className={counts?.pendingTestimonials ? 'gold-text' : ''}>{counts?.pendingTestimonials ?? '—'}</strong></Link>
          <Link href="/admin/enquiries" className="health-row hover:bg-[#fcfaf7]"><span>Enquiries this month</span><strong>{counts?.requestsThisMonth ?? '—'}</strong></Link>
        </section>
      </div>
      <footer className="footer-note"><span>Harry Advocates Administration</span><span>Secure workspace · {summary ? `Synced ${new Date(summary.syncedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Syncing…'}</span></footer>
    </>
  )
}

function Stat({ href, icon: Icon, label, value, trend, color }: { href: string; icon: typeof BookOpen; label: string; value: number | undefined; trend: string; color: string }) {
  return (
    <Link href={href} className="stat-card">
      <div className={`stat-icon stat-${color}`}><Icon size={18} /></div>
      <div><span>{label}</span><strong>{value ?? '—'}</strong><small className={color === 'gold' || color === 'green' ? 'positive' : ''}>{trend}</small></div>
      <ArrowUpRight className="stat-arrow" size={16} />
    </Link>
  )
}

function Quick({ href, icon: Icon, title, detail }: { href: string; icon: typeof FileText; title: string; detail: string }) {
  return (
    <Link href={href} className="quick-action">
      <div className="quick-icon"><Icon size={17} /></div>
      <div><strong>{title}</strong><span>{detail}</span></div>
      <ChevronRight size={16} />
    </Link>
  )
}
