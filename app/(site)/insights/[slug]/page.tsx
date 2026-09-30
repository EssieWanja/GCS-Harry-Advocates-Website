import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichContent } from '@/components/site/RichContent'
import { getInsight } from '@/lib/content'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getInsight(slug)
  return { title: article ? article.title : 'Insight' }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getInsight(slug)
  if (!article) notFound()

  return (
    <article className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <nav className="flex items-center gap-2 text-[11px] text-muted mb-8">
          <Link href="/" className="hover:text-gold">Home</Link><span>/</span>
          <Link href="/insights" className="hover:text-gold">Insights</Link><span>/</span>
          <span>{article.title}</span>
        </nav>

        <span className="text-gold text-[11px] font-semibold">{article.category} · {article.readMinutes} min read</span>
        <h1 className="font-serif text-navy text-[30px] md:text-[36px] mt-3 leading-tight">{article.title}</h1>

        {article.imageUrl && (
          <div className="rounded-lg overflow-hidden aspect-[16/9] my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <RichContent content={article.content ?? article.excerpt ?? ''} className="text-[15px]" />
      </div>
    </article>
  )
}
