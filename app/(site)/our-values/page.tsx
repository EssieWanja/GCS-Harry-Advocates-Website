import type { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'

export const metadata: Metadata = { title: 'Our Values' }

const values = [
  { number: '01', title: 'Integrity', body: 'We give honest advice, even when it is not what a client hopes to hear, because trust is the foundation of good counsel.' },
  { number: '02', title: 'Excellence', body: 'We prepare thoroughly for every matter, from a simple lease review to a contested court case.' },
  { number: '03', title: 'Client-Centered Service', body: 'Your goals define how we approach a matter, not the other way around.' },
  { number: '04', title: 'Confidentiality', body: 'Client information is handled with strict discretion, in line with advocate-client privilege.' },
  { number: '05', title: 'Accountability', body: 'We take ownership of our advice and our conduct, and we keep clients informed at every stage.' },
  { number: '06', title: 'Access to Justice', body: 'We believe sound legal advice should be accessible, and we work to make our services clear and fairly priced.' },
]

export default function OurValuesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'The Firm' }, { label: 'Our Values' }]}
        eyebrow="The Firm"
        title="The principles that guide every matter we handle."
        description="Our values are not a poster on the wall. They shape how we take instructions, how we advise clients, and how we conduct ourselves before Kenyan courts and counterparties."
        image="https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1000"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">OUR CORE VALUES</span>
            <h2 className="font-serif text-navy text-[28px] mt-3">Six commitments we hold ourselves to.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((item) => (
              <div key={item.number} className="bg-canvas border border-line rounded-lg p-7">
                <span className="text-gold text-[13px] font-semibold">{item.number}</span>
                <h3 className="font-serif text-navy text-[17px] mt-3">{item.title}</h3>
                <p className="text-muted text-[13px] leading-relaxed mt-2">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <div className="rounded-lg overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/6077123/pexels-photo-6077123.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Statue of Lady Justice beside a gavel in a law library setting" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">PROFESSIONAL STANDARDS</span>
            <h2 className="font-serif text-navy text-[28px] mt-3">Held to the standards of the profession.</h2>
            <p className="text-muted text-[14px] leading-relaxed mt-4">As advocates enrolled in Kenya, we practice in accordance with the Law Society of Kenya&apos;s Code of Standards of Professional Practice and Ethical Conduct, and the Advocates Act.</p>
            <p className="text-muted text-[14px] leading-relaxed mt-4">This means clear engagement terms, careful handling of client funds, and a duty of candour to the courts, alongside our duty to represent our clients&apos; interests.</p>
          </div>
        </div>
      </section>
    </>
  )
}
