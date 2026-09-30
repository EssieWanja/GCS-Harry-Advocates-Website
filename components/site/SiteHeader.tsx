'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { telHref, type SiteSettings } from '@/lib/settings'

type NavPracticeArea = { slug: string; title: string }

const firmLinks = [
  { href: '/about', label: 'About Harry Advocates', hint: 'Our identity and approach' },
  { href: '/our-values', label: 'Our Values', hint: 'Integrity, professionalism and trust' },
]

export function SiteHeader({ practiceAreas, settings }: { practiceAreas: NavPracticeArea[]; settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-[0_2px_16px_rgba(20,40,61,0.08)]' : ''}`}>
      <div className="hidden md:block bg-navy text-white/80 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-3">
            <a href={telHref(settings.phonePrimary)} className="hover:text-gold">{settings.phonePrimary}</a>
            <span className="w-px h-3 bg-white/20" />
            <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <span>{settings.officeHours}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 border border-gold text-gold grid place-items-center font-serif text-xl">H</div>
          <div className="leading-tight">
            <strong className="block font-serif text-[15px] tracking-[2px] text-navy">HARRY</strong>
            <span className="block text-[8px] tracking-[2.3px] text-muted">ADVOCATES</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-ink">
          <Link href="/" className="hover:text-gold">Home</Link>

          <div className="group relative py-8 -my-8">
            <button className="flex items-center gap-1 hover:text-gold">The Firm <ChevronDown size={14} /></button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-0 top-full w-80 bg-white border border-line shadow-xl rounded-md p-2">
              {firmLinks.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded p-3 hover:bg-canvas">
                  <strong className="block text-[13px] text-navy">{item.label}</strong>
                  <small className="text-[11px] text-muted">{item.hint}</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative py-8 -my-8">
            <button className="flex items-center gap-1 hover:text-gold">Practice Areas <ChevronDown size={14} /></button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute left-0 top-full w-96 bg-white border border-line shadow-xl rounded-md p-2 grid grid-cols-1 gap-1">
              {practiceAreas.map((area) => (
                <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="block rounded p-3 text-[13px] hover:bg-canvas">{area.title}</Link>
              ))}
            </div>
          </div>

          <Link href="/our-team" className="hover:text-gold">Our Team</Link>
          <Link href="/insights" className="hover:text-gold">Insights</Link>
          <Link href="/contact" className="hover:text-gold">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden md:inline-flex items-center gap-2 bg-gold text-white text-[12px] font-semibold px-4 py-2.5 rounded hover:opacity-90">
            Book Consultation <span>↗</span>
          </Link>
          <button className="lg:hidden text-navy" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-6 h-16 border-b border-line">
            <span className="font-serif text-navy">Menu</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={22} /></button>
          </div>
          <div className="p-6 flex flex-col gap-1 text-[14px]">
            <Link href="/" className="py-3 border-b border-line" onClick={() => setMobileOpen(false)}>Home</Link>
            <button className="py-3 border-b border-line flex items-center justify-between text-left" onClick={() => setMobileSection(mobileSection === 'firm' ? null : 'firm')}>
              The Firm <span>{mobileSection === 'firm' ? '−' : '+'}</span>
            </button>
            {mobileSection === 'firm' && firmLinks.map((item) => (
              <Link key={item.href} href={item.href} className="py-2 pl-4 text-muted" onClick={() => setMobileOpen(false)}>{item.label}</Link>
            ))}
            <button className="py-3 border-b border-line flex items-center justify-between text-left" onClick={() => setMobileSection(mobileSection === 'practice' ? null : 'practice')}>
              Practice Areas <span>{mobileSection === 'practice' ? '−' : '+'}</span>
            </button>
            {mobileSection === 'practice' && practiceAreas.map((area) => (
              <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="py-2 pl-4 text-muted" onClick={() => setMobileOpen(false)}>{area.title}</Link>
            ))}
            <Link href="/our-team" className="py-3 border-b border-line" onClick={() => setMobileOpen(false)}>Our Team</Link>
            <Link href="/insights" className="py-3 border-b border-line" onClick={() => setMobileOpen(false)}>Insights</Link>
            <Link href="/contact" className="py-3 border-b border-line" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/contact" className="mt-5 inline-flex items-center justify-center gap-2 bg-gold text-white text-[13px] font-semibold px-4 py-3 rounded" onClick={() => setMobileOpen(false)}>
              Book Consultation <span>↗</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
