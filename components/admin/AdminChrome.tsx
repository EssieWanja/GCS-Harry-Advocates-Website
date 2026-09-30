'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Activity, Bell, BookOpen, BriefcaseBusiness, CalendarDays, ChevronRight, ExternalLink, Gavel,
  LayoutDashboard, LogOut, Mail, Menu, MessageSquareText, Search, Settings, ShieldCheck, UserCog, Users, X,
} from 'lucide-react'
import { api, initials } from '@/lib/admin-client'

export type AdminUser = { email: string; name: string; role: 'admin' | 'editor' }
export type ActivityItem = { kind: string; title: string; detail: string; at: string; href: string }
export type ConsultationRequest = { id: string; fullName: string; email: string; phone: string | null; practiceArea: string; message: string | null; preferredDate: string | null; status: string; createdAt: string }
export type Summary = {
  upcoming: ConsultationRequest[]
  activity: ActivityItem[]
  counts: { newRequests: number; confirmed: number; openMatters: number; subscribers: number; requestsThisMonth: number; pendingReviews: number; draftInsights: number; pendingTestimonials: number; publishedPages: number }
  syncedAt: string
}

type AdminContextValue = { user: AdminUser | null; summary: Summary | null; refresh: () => Promise<void> }
const AdminContext = createContext<AdminContextValue>({ user: null, summary: null, refresh: async () => {} })

/** Logged-in user plus live counts; call refresh() after a change so badges update. */
export const useAdmin = () => useContext(AdminContext)

type CountKey = keyof Summary['counts']
type NavItem = { label: string; href: string; icon: typeof Activity; count?: CountKey; adminOnly?: boolean }

export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: 'Workspace', items: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquareText, count: 'newRequests' },
    { label: 'Consultations', href: '/admin/consultations', icon: CalendarDays, count: 'confirmed' },
    { label: 'Matters', href: '/admin/matters', icon: BriefcaseBusiness, count: 'openMatters' },
    { label: 'Subscribers', href: '/admin/subscribers', icon: Mail },
  ]},
  { label: 'Firm content', items: [
    { label: 'Practice areas', href: '/admin/practice-areas', icon: Gavel },
    { label: 'Team profiles', href: '/admin/team', icon: Users },
    { label: 'Insights', href: '/admin/insights', icon: BookOpen, count: 'draftInsights' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: ShieldCheck, count: 'pendingTestimonials' },
  ]},
  { label: 'System', items: [
    { label: 'Activity', href: '/admin/activity', icon: Activity },
    { label: 'Team & permissions', href: '/admin/users', icon: UserCog, adminOnly: true },
    { label: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
  ]},
]

const allItems = navGroups.flatMap((group) => group.items)
const isActive = (pathname: string, href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`))

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNav, setMobileNav] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [query, setQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    const result = await api<Summary>('/api/admin/summary?activity=6')
    if (result.data) setSummary(result.data)
  }, [])

  useEffect(() => {
    api<{ user: AdminUser | null }>('/api/admin/me').then((result) => result.data && setUser(result.data.user))
  }, [])

  // Refresh badges on every page change and every 30 seconds while the admin is open.
  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 30000)
    return () => window.clearInterval(timer)
  }, [refresh, pathname])

  useEffect(() => {
    setMobileNav(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const search = (event: FormEvent) => {
    event.preventDefault()
    if (query.trim()) router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`)
  }

  const current = pathname === '/admin/search' ? 'Search' : allItems.filter((item) => isActive(pathname, item.href)).at(-1)?.label ?? 'Overview'
  const newRequests = summary?.counts.newRequests ?? 0

  return (
    <AdminContext.Provider value={{ user, summary, refresh }}>
      <div className="admin-shell">
        <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
          <div className="brand-lockup">
            <div className="brand-mark">H</div>
            <div><strong>HARRY</strong><span>ADVOCATES</span></div>
            <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button>
          </div>
          <div className="workspace-label">FIRM ADMINISTRATION</div>
          <nav aria-label="Admin navigation">
            {navGroups.map((group) => {
              const items = group.items.filter((item) => !item.adminOnly || user?.role === 'admin')
              return (
                <div className={`nav-group ${group.label === 'System' ? 'utility-group' : ''}`} key={group.label}>
                  <p>{group.label}</p>
                  {items.map((item) => {
                    const Icon = item.icon
                    const count = item.count ? summary?.counts[item.count] : undefined
                    return (
                      <Link key={item.href} href={item.href} className={`side-link ${isActive(pathname, item.href) ? 'active' : ''}`} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                        <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{count ? <b>{count}</b> : null}
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </nav>
          <div className="sidebar-bottom">
            <a href="/" target="_blank" rel="noopener noreferrer" className="site-link"><ExternalLink size={15} /> View public website</a>
            <div className="user-card">
              <div className="avatar avatar-gold">{user ? initials(user.name) : '··'}</div>
              <div><strong>{user?.name ?? 'Loading…'}</strong><span>{user?.role === 'editor' ? 'Editor' : 'Administrator'}</span></div>
              <button onClick={logout} className="user-card-action" aria-label="Log out" title="Log out"><LogOut size={15} /></button>
            </div>
          </div>
        </aside>
        {mobileNav && <button className="mobile-overlay" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay" />}

        <main className="main-content">
          <header className="top-header">
            <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button>
            <div className="crumb"><Link href="/admin">Firm administration</Link><ChevronRight size={15} /><strong>{current}</strong></div>
            <div className="header-actions">
              <form className="search-box" onSubmit={search} role="search">
                <Search size={16} />
                <input aria-label="Search the admin" placeholder="Search anything..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </form>
              <Link href="/admin/enquiries" className="icon-button notification" aria-label={newRequests ? `${newRequests} new enquiries` : 'No new enquiries'} title={newRequests ? `${newRequests} new enquiries` : 'No new enquiries'}>
                <Bell size={18} />{newRequests > 0 && <i />}
              </Link>
              <div className="relative" ref={menuRef}>
                <button className="header-avatar" onClick={() => setMenuOpen((open) => !open)} aria-haspopup="menu" aria-expanded={menuOpen} aria-label="Account menu">{user ? initials(user.name) : '··'}</button>
                {menuOpen && (
                  <div className="admin-menu" role="menu">
                    <div className="admin-menu-head"><strong>{user?.name}</strong><span>{user?.email}</span></div>
                    {user?.role === 'admin' && <Link href="/admin/settings" role="menuitem"><Settings size={15} /> Site settings</Link>}
                    {user?.role === 'admin' && <Link href="/admin/users" role="menuitem"><UserCog size={15} /> Team & permissions</Link>}
                    <a href="/" target="_blank" rel="noopener noreferrer" role="menuitem"><ExternalLink size={15} /> View website</a>
                    <button onClick={logout} role="menuitem"><LogOut size={15} /> Log out</button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="page-wrap">{children}</div>
        </main>
      </div>
    </AdminContext.Provider>
  )
}
