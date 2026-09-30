import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { getManager } from '@/lib/content'

export const metadata: Metadata = { title: 'About Harry Advocates' }

const principles = [
  { number: '01', title: 'Client-First Counsel', body: 'We take the time to understand your goals before we recommend a course of action, so the advice you receive actually fits your situation.' },
  { number: '02', title: 'Clear Communication', body: 'Legal matters are explained in plain language, with regular updates so you always know where your matter stands.' },
  { number: '03', title: 'Practical Solutions', body: 'We look for the most efficient path to resolution, reserving litigation for when it is genuinely the best option for our clients.' },
]

export default async function AboutPage() {
  const manager = await getManager()
  const story = (manager?.bio ?? '').split('\n\n')

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'The Firm' }, { label: 'About Harry Advocates' }]}
        eyebrow="The Firm"
        title="A firm built on trust, integrity and results."
        description="Harry Advocates was founded to give individuals, families and businesses in Kenya access to legal counsel that is both rigorous and genuinely practical."
        image="https://images.pexels.com/photos/8428059/pexels-photo-8428059.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <div className="rounded-lg overflow-hidden aspect-[4/3] order-2 md:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/8428054/pexels-photo-8428054.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Three colleagues collaborating over documents in a bright office" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">OUR STORY</span>
            <h2 className="font-serif text-navy text-[28px] mt-3">Practical counsel, built around people.</h2>
            <p className="text-muted text-[14px] leading-relaxed mt-4">Harry Advocates was established with a simple idea: that legal advice should be clear, timely and genuinely useful, not just technically correct. What began as a small practice in Nairobi has grown into a firm trusted by individuals, families and businesses across Kenya.</p>
            <p className="text-muted text-[14px] leading-relaxed mt-4">Today, our advocates handle matters spanning corporate and commercial law, conveyancing, dispute resolution, family and succession law, employment law and criminal litigation, all guided by the same commitment to straightforward, client-focused advice.</p>
          </div>
        </div>
      </section>

      {manager && (
        <section id="manager" className="bg-navy text-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-[380px_1fr] gap-12 md:gap-16 items-start">
            <div className="md:sticky md:top-28">
              <div className="rounded-lg overflow-hidden aspect-[4/5] ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={manager.photoUrl || '/placeholder-user.jpg'} alt={`Portrait of ${manager.name}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-[12px]">
                {manager.education && <div><strong className="block text-gold text-[10px] tracking-[1.5px]">EDUCATION</strong><span className="text-white/75">{manager.education}</span></div>}
                {manager.barAdmission && <div><strong className="block text-gold text-[10px] tracking-[1.5px]">ADMITTED</strong><span className="text-white/75">{manager.barAdmission}</span></div>}
              </div>
            </div>
            <div>
              <span className="text-gold text-[10px] font-bold tracking-[1.7px]">MEET OUR MANAGER</span>
              <h2 className="font-serif text-[32px] md:text-[40px] leading-tight mt-3">{manager.name}</h2>
              <span className="block text-white/60 text-[13px] mt-2">{manager.role}, Harry Advocates</span>
              <div className="mt-8 space-y-5 text-[15px] leading-[1.8] text-white/80">
                {story.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'text-white text-[17px] leading-[1.7] first-letter:font-serif first-letter:text-gold first-letter:text-[52px] first-letter:float-left first-letter:leading-[0.9] first-letter:mr-2' : undefined}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-white text-[13px] font-semibold px-6 py-3.5 rounded hover:opacity-90">Book a Consultation <span>↗</span></Link>
                <Link href={`/team/${manager.slug}`} className="inline-flex items-center gap-2 border border-white/30 text-white text-[13px] font-semibold px-6 py-3.5 rounded hover:bg-white/10">Full profile <span>→</span></Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-canvas py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">HOW WE WORK</span>
            <h2 className="font-serif text-navy text-[28px] mt-3">An approach built for clarity.</h2>
            <p className="text-muted text-[13px] mt-3">Every matter we take on is guided by the same working principles, whatever the size or complexity of the case.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {principles.map((item) => (
              <div key={item.number} className="bg-white border border-line rounded-lg p-7">
                <span className="text-gold text-[13px] font-semibold">{item.number}</span>
                <h3 className="font-serif text-navy text-[17px] mt-3">{item.title}</h3>
                <p className="text-muted text-[13px] leading-relaxed mt-2">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">WHY HARRY ADVOCATES</span>
            <h2 className="font-serif text-navy text-[28px] mt-3">Experience across the matters that matter most.</h2>
            <p className="text-muted text-[14px] leading-relaxed mt-4">Our advocates bring together experience across corporate, property, family, employment and criminal law, allowing us to support clients across the full range of legal needs they may face over time.</p>
            <p className="text-muted text-[14px] leading-relaxed mt-4">We are admitted to practice before the High Court of Kenya, and we hold ourselves to the standards set by the Law Society of Kenya in every matter we handle.</p>
          </div>
          <div className="rounded-lg overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/33827319/pexels-photo-33827319.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Modern meeting room used for client consultations" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}
