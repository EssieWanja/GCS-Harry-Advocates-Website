import type { Metadata } from 'next'
import { ContactForm } from '@/components/site/ContactForm'
import { getPracticeAreas, getSiteSettings } from '@/lib/content'
import { telHref } from '@/lib/settings'

export const metadata: Metadata = { title: 'Contact Us' }

export default async function ContactPage() {
  const [practiceAreas, settings] = await Promise.all([getPracticeAreas(), getSiteSettings()])
  const mapQuery = encodeURIComponent(`${settings.address}, Kenya`)

  return (
    <>
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <span className="text-gold text-[10px] font-bold tracking-[1.7px]">GET IN TOUCH</span>
          <h1 className="font-serif text-navy text-[32px] md:text-[42px] mt-3 max-w-2xl">Let&apos;s discuss your legal matter.</h1>
          <p className="text-muted text-[14px] mt-4 max-w-xl">Reach out to schedule a consultation. We will connect you with the advocate best suited to your matter.</p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-14">
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">CONTACT DETAILS</span>
            <h2 className="font-serif text-navy text-[24px] mt-3 mb-6">Visit, call or write to us.</h2>
            <div className="space-y-5 text-[13px]">
              <InfoRow label="Office">
                <span className="block">{settings.address}</span>
                {settings.postalAddress && <span className="block">{settings.postalAddress}</span>}
              </InfoRow>
              {settings.phonePrimary && <InfoRow label="Tel"><a href={telHref(settings.phonePrimary)} className="hover:text-gold">{settings.phonePrimary}</a></InfoRow>}
              {(settings.phoneSecondary || settings.phoneTertiary) && (
                <InfoRow label="Cell">
                  {[settings.phoneSecondary, settings.phoneTertiary].filter(Boolean).map((phone, index) => (
                    <span key={phone}>{index > 0 && ' / '}<a href={telHref(phone)} className="hover:text-gold">{phone}</a></span>
                  ))}
                </InfoRow>
              )}
              {settings.email && <InfoRow label="Email"><a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a></InfoRow>}
              {settings.officeHours && <InfoRow label="Office Hours">{settings.officeHours}</InfoRow>}
            </div>

            <div className="mt-8 rounded-lg overflow-hidden border border-line">
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="block">
                <iframe
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing ${settings.address}`}
                  className="w-full h-64 pointer-events-none"
                />
              </a>
            </div>
          </div>

          <div>
            <span className="text-gold text-[10px] font-bold tracking-[1.7px]">BOOK A CONSULTATION</span>
            <h2 className="font-serif text-navy text-[24px] mt-3 mb-6">Send us a message.</h2>
            <ContactForm practiceAreas={practiceAreas.map((area) => area.title)} />
          </div>
        </div>
      </section>
    </>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <strong className="block text-navy text-[12px] font-semibold mb-1">{label}</strong>
      <div className="text-muted">{children}</div>
    </div>
  )
}
