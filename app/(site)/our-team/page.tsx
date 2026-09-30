import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { getTeamMembers, MANAGER_SLUG } from '@/lib/content'

export const metadata: Metadata = { title: 'Our Team' }

export default async function OurTeamPage() {
  const teamMembers = (await getTeamMembers()).filter((member) => member.slug !== MANAGER_SLUG)

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Our Team' }]}
        eyebrow="The People"
        title="Advocates you can rely on."
        description="Meet the team behind every matter we handle, each bringing focused expertise and a client-first approach."
        image="https://images.pexels.com/photos/32064778/pexels-photo-32064778.jpeg?auto=compress&cs=tinysrgb&w=1000"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Link key={member.slug} href={`/team/${member.slug}`} className="group block">
              <div className="rounded-lg overflow-hidden aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.photoUrl || '/placeholder-user.jpg'} alt={`Portrait of ${member.name}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <strong className="block font-serif text-navy text-[16px] mt-4">{member.name}</strong>
              <span className="block text-gold text-[12px] font-medium mt-1">{member.role}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
