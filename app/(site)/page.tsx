import Link from 'next/link'
import { CountUp } from '@/components/site/CountUp'
import { HeroSlider } from '@/components/site/HeroSlider'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { getPracticeAreas, getSiteSettings, getTestimonials } from '@/lib/content'
import { telHref } from '@/lib/settings'

const heroImages = [
  { src: 'https://images.pexels.com/photos/29069329/pexels-photo-29069329.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Nairobi skyline at dusk' },
  { src: 'https://images.pexels.com/photos/29069344/pexels-photo-29069344.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Nairobi city skyline in daylight' },
  { src: 'https://images.pexels.com/photos/28977077/pexels-photo-28977077.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Aerial view of Nairobi city centre' },
]

const pillars = [
  { title: 'Our brand', body: 'is built on the pillars of integrity, clarity and results. By bringing modern tools into every part of how we work, from client onboarding and document management to legal research and compliance tracking, we deliver a seamless, efficient and responsive client experience.' },
  { title: 'Our people', body: 'are the driving force behind our success. With a multidisciplinary team of advocates and legal professionals, we combine technical expertise with deep commercial insight to help clients navigate complex legal and business environments.' },
  { title: 'Our clients', body: 'stand at the heart of our practice. We serve them with dedication, confidentiality and strategic counsel, delivering tailored, forward-thinking solutions that build lasting partnerships founded on trust.' },
]

export default async function HomePage() {
  const [practiceAreas, testimonials, settings] = await Promise.all([getPracticeAreas(), getTestimonials(), getSiteSettings()])
  // Years, clients and staff are edited in Admin > Settings; practice areas are counted live.
  const firmStats = [
    { value: Number.parseInt(settings.statYears, 10) || 0, suffix: '+', label: 'Years of practice' },
    { value: Number.parseInt(settings.statClients, 10) || 0, suffix: '+', label: 'Clients served' },
    { value: Number.parseInt(settings.statStaff, 10) || 0, suffix: '+', label: 'Legal professionals' },
    { value: practiceAreas.length, suffix: '', label: 'Practice areas' },
  ]
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter(Boolean)
  const loopedTestimonials = [...testimonials, ...testimonials]

  return (
    <>
      <section className="relative min-h-[92vh] flex flex-col justify-end text-white overflow-hidden bg-navy">
        <HeroSlider images={heroImages} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 w-full">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[2px] uppercase text-gold mb-6 hero-rise">
            <span className="w-8 h-px bg-gold" /> Nairobi · Kenya
          </div>
          <h1 className="font-serif text-[40px] md:text-[64px] leading-[1.05] max-w-4xl hero-rise [animation-delay:120ms]">
            Legal excellence. <em className="text-gold not-italic">Trusted counsel.</em> Strong representation.
          </h1>
          <p className="mt-6 max-w-xl text-white/80 text-[16px] leading-relaxed hero-rise [animation-delay:240ms]">
            Harry Advocates provides strategic, professional and client-focused legal solutions for individuals, families and businesses.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 hero-rise [animation-delay:360ms]">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-white text-[13px] font-semibold px-7 py-4 rounded hover:opacity-90 shadow-lg shadow-black/20">
              Book a Consultation <span>↗</span>
            </Link>
            <Link href="#practice" className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm text-white text-[13px] font-semibold px-7 py-4 rounded hover:bg-white/10">
              Explore Practice Areas <span>→</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full border-t border-white/10 bg-black/25 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 h-14 flex items-center gap-3 text-[12px] text-white/70 overflow-x-auto">
            {['Corporate Law', 'Property Law', 'Litigation', 'Family Law', 'Employment Law'].map((item, index) => (
              <span key={item} className="flex items-center gap-3 whitespace-nowrap">{index > 0 && <span className="w-1 h-1 rounded-full bg-gold/60" />}{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-[1fr_auto_1.25fr] gap-12 lg:gap-16">
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">WHO WE ARE</span>
            <h2 className="font-serif text-navy text-[30px] md:text-[38px] leading-[1.2] mt-3">
              Harry Advocates is a trusted legal and business advisory firm based in Nairobi, Kenya.
            </h2>
            <div className="grid grid-cols-2 gap-px bg-line border border-line rounded-lg overflow-hidden mt-10">
              {firmStats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 md:p-7">
                  <strong className="block font-serif text-navy text-[36px] md:text-[44px] leading-none"><CountUp value={stat.value} suffix={stat.suffix} /></strong>
                  <span className="block text-muted text-[12px] mt-3 tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-gradient-to-b from-navy via-gold to-transparent" />

          <div>
            <h3 className="font-serif text-navy text-[22px] md:text-[24px]">Our Brand. Our People. Our Clients.</h3>
            <div className="mt-6 space-y-5 text-[15px] leading-[1.8] text-ink/80">
              {pillars.map((pillar) => (
                <p key={pillar.title}><strong className="text-navy font-semibold">{pillar.title}</strong> {pillar.body}</p>
              ))}
              <p className="text-navy font-semibold">At Harry Advocates, we don&rsquo;t just offer services. We deliver solutions that protect what matters, ensure compliance and create lasting value.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 mt-9 bg-navy text-white text-[13px] font-semibold px-6 py-3.5 rounded hover:bg-navy-2">
              Get in Touch <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-canvas py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 text-center mb-12">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">CLIENT VOICES</span>
            <h2 className="font-serif text-navy text-[30px] mt-3">Trusted by the clients we represent.</h2>
          </div>
          <div className="site-marquee-track" style={{ animationDuration: '36s' }}>
            {loopedTestimonials.map((item, index) => (
              <div key={`${item.id}-${index}`} className="w-[320px] shrink-0 bg-white border border-line rounded-lg p-6 mx-3 flex flex-col gap-4">
                <p className="text-[13px] text-ink leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div>
                  <strong className="block text-[13px] text-navy">{item.authorName}</strong>
                  <span className="text-[11px] text-muted">{item.authorRole}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="practice" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">OUR EXPERTISE</span>
            <h2 className="font-serif text-navy text-[30px] mt-3">Practice Areas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {practiceAreas.map((area) => (
              <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="block border border-line rounded-lg p-6 hover:border-gold hover:shadow-md transition">
                <h3 className="font-serif text-navy text-[18px]">{area.title}</h3>
                <p className="text-[13px] text-muted mt-2 leading-relaxed line-clamp-3">{area.summary}</p>
                <span className="inline-flex items-center gap-1 text-gold text-[12px] font-semibold mt-4">Learn more <span>→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.pexels.com/photos/8428054/pexels-photo-8428054.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl px-6 py-12 md:px-16 text-center shadow-2xl shadow-black/30">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">STAY INFORMED</span>
            <h2 className="font-serif text-navy text-[28px] md:text-[34px] mt-2">Subscribe to our Mailing List</h2>
            <p className="text-muted text-[14px] mt-3">Enter your email address to receive legal alerts, articles and newsletters.</p>
            <NewsletterForm />
          </div>
          <div className="text-center text-white mt-14">
            <p className="text-white/80 text-[16px]">Let us take it from here.</p>
            <div className="font-serif text-[24px] md:text-[34px] mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {phones.map((phone, index) => (
                <span key={phone} className="flex gap-x-4">{index > 0 && <span className="text-gold">/</span>}<a href={telHref(phone)} className="hover:text-gold">{phone}</a></span>
              ))}
            </div>
            <a href={`mailto:${settings.email}`} className="inline-block mt-4 text-[16px] font-semibold hover:text-gold">{settings.email}</a>
          </div>
        </div>
      </section>
    </>
  )
}
