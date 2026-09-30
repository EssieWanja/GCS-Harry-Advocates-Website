import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { getInsights } from '@/lib/content'

export const metadata: Metadata = { title: 'Insights' }

export default async function InsightsPage() {
  const articles = await getInsights()

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Insights' }]}
        eyebrow="Perspectives"
        title="Legal insight for individuals and businesses."
        description="Practical guidance on the legal issues shaping our clients' lives and businesses in Kenya."
        image="https://images.pexels.com/photos/33935830/pexels-photo-33935830.jpeg?auto=compress&cs=tinysrgb&w=1000"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.slug} href={`/insights/${article.slug}`} className="block border border-line rounded-lg overflow-hidden hover:border-gold hover:shadow-md transition">
              <div className="aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.imageUrl || '/placeholder.jpg'} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <span className="text-[11px] text-gold font-semibold">{article.category} · {article.readMinutes} min read</span>
                <h3 className="font-serif text-navy text-[16px] mt-2 leading-snug">{article.title}</h3>
                <p className="text-[13px] text-muted mt-2 leading-relaxed line-clamp-3">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
