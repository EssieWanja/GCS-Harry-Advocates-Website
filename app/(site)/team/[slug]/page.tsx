import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTeamMember, MANAGER_SLUG } from '@/lib/content'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const member = await getTeamMember(slug)
  return { title: member ? member.name : 'Team member' }
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await getTeamMember(slug)
  if (!member) notFound()
  const parent = member.slug === MANAGER_SLUG ? { label: 'About', href: '/about' } : { label: 'Our Team', href: '/our-team' }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <nav className="flex items-center gap-2 text-[11px] text-muted mb-8">
          <Link href="/" className="hover:text-gold">Home</Link><span>/</span>
          <Link href={parent.href} className="hover:text-gold">{parent.label}</Link><span>/</span>
          <span>{member.name}</span>
        </nav>

        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          <div className="rounded-lg overflow-hidden aspect-[3/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.photoUrl || '/placeholder-user.jpg'} alt={`Portrait of ${member.name}`} loading="lazy" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="font-serif text-navy text-[32px]">{member.name}</h1>
            <span className="block text-gold text-[13px] font-medium mt-1">{member.role}</span>

            {member.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {member.tags.map((tag) => (
                  <span key={tag} className="text-[11px] bg-canvas border border-line rounded-full px-3 py-1.5 text-ink">{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-4 text-[14px] text-muted leading-relaxed">
              {(member.bio ?? '').split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-line">
              {member.education && <MetaRow label="Education" value={member.education} />}
              {member.barAdmission && <MetaRow label="Bar Admission" value={member.barAdmission} />}
              {member.languages && <MetaRow label="Languages" value={member.languages} />}
              {member.focusAreas && <MetaRow label="Focus Areas" value={member.focusAreas} />}
            </div>

            {member.email && (
              <a href={`mailto:${member.email}?subject=${encodeURIComponent(`Enquiry for ${member.name}`)}`} className="inline-flex items-center gap-2 mt-8 bg-gold text-white text-[13px] font-semibold px-5 py-3 rounded hover:opacity-90">
                Get In Touch <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong className="block text-[11px] font-semibold text-navy">{label}</strong>
      <span className="block text-[13px] text-muted mt-1">{value}</span>
    </div>
  )
}
