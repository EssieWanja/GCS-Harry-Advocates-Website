import Link from 'next/link'

export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  image,
}: {
  crumbs: { label: string; href?: string }[]
  eyebrow: string
  title: string
  description?: string
  image: string
}) {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <nav className="flex items-center gap-2 text-[11px] text-muted mb-6">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? <Link href={crumb.href} className="hover:text-gold">{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
          <span className="text-gold text-[10px] font-bold tracking-[1.7px]">{eyebrow}</span>
          <h1 className="font-serif text-navy text-[32px] md:text-[42px] leading-tight mt-3">{title}</h1>
          {description && <p className="text-muted text-[14px] leading-relaxed mt-4 max-w-md">{description}</p>}
        </div>
        <div className="rounded-lg overflow-hidden aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  )
}
