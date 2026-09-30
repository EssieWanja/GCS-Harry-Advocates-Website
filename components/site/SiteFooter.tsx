import Link from 'next/link'
import { telHref, type SiteSettings } from '@/lib/settings'

type NavPracticeArea = { slug: string; title: string }

const socials: { label: string; key: 'facebookUrl' | 'xUrl' | 'linkedinUrl'; path: string }[] = [
  { label: 'Facebook', key: 'facebookUrl', path: 'M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z' },
  { label: 'X (Twitter)', key: 'xUrl', path: 'M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2zm-1.2 18h1.9L7.4 4h-2l12.3 16z' },
  { label: 'LinkedIn', key: 'linkedinUrl', path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9z' },
]

export function SiteFooter({ practiceAreas, settings }: { practiceAreas: NavPracticeArea[]; settings: SiteSettings }) {
  const socialLinks = socials.filter((social) => settings[social.key])

  return (
    <footer className="bg-navy text-white/85">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">TALK TO US</span>
            <h2 className="font-serif text-2xl text-white mt-2">Ready to discuss your matter?</h2>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-white text-[13px] font-semibold px-5 py-3 rounded hover:opacity-90">
            Book Consultation <span>↗</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold text-gold grid place-items-center font-serif text-lg">H</div>
            <div className="leading-tight">
              <strong className="block font-serif text-sm tracking-[2px] text-white">HARRY</strong>
              <span className="block text-[8px] tracking-[2.3px] text-white/60">ADVOCATES</span>
            </div>
          </Link>
          <p className="text-[12px] text-white/60 mt-4 leading-relaxed">
            Professional, practical and trusted legal solutions for individuals, families and businesses across Kenya.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold tracking-wide text-white mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2.5 text-[12px] text-white/65">
            <Link href="/about" className="hover:text-gold">About Harry Advocates</Link>
            <Link href="/our-values" className="hover:text-gold">Our Values</Link>
            <Link href="/our-team" className="hover:text-gold">Our Team</Link>
            <Link href="/gallery" className="hover:text-gold">Gallery</Link>
            <Link href="/insights" className="hover:text-gold">Insights</Link>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold tracking-wide text-white mb-4">Practice Areas</h4>
          <div className="flex flex-col gap-2.5 text-[12px] text-white/65">
            {practiceAreas.map((area) => (
              <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="hover:text-gold">{area.title}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold tracking-wide text-white mb-4">Contact</h4>
          <div className="flex flex-col gap-2.5 text-[12px] text-white/65">
            {settings.phonePrimary && <a href={telHref(settings.phonePrimary)} className="hover:text-gold">Tel {settings.phonePrimary}</a>}
            {settings.phoneSecondary && <a href={telHref(settings.phoneSecondary)} className="hover:text-gold">Cell {settings.phoneSecondary}</a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a>}
            {settings.address && <span>{settings.address}</span>}
            {settings.postalAddress && <span>{settings.postalAddress}</span>}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-[11px] text-white/50">
          <span>© {new Date().getFullYear()} Harry Advocates. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={settings[social.key]} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-gold">
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d={social.path} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
