import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/site/PageHero'
import { RichContent } from '@/components/site/RichContent'
import { getPracticeArea } from '@/lib/content'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = await getPracticeArea(slug)
  return { title: area ? area.title : 'Practice area' }
}

export default async function PracticeAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = await getPracticeArea(slug)
  if (!area) notFound()

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Practice Areas' }, { label: area.title }]}
        eyebrow="Practice Area"
        title={area.title}
        description={area.summary ?? undefined}
        image={area.heroImageUrl || '/placeholder.jpg'}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <span className="text-gold text-[10px] font-bold tracking-[1.7px]">WHAT WE HANDLE</span>
          <h2 className="font-serif text-navy text-[26px] mt-3 mb-6">Services within this practice area.</h2>
          <RichContent content={area.content ?? ''} />
        </div>
      </section>
    </>
  )
}
