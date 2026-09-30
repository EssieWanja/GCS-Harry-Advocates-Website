import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getPracticeAreas, getSiteSettings } from '@/lib/content'

// Content is edited live from the admin, so every page reads the latest data on each request.
export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [practiceAreas, settings] = await Promise.all([getPracticeAreas(), getSiteSettings()])
  const navPracticeAreas = practiceAreas.map((area) => ({ slug: area.slug, title: area.title }))

  return (
    <div className="font-sans">
      <SiteHeader practiceAreas={navPracticeAreas} settings={settings} />
      <main>{children}</main>
      <SiteFooter practiceAreas={navPracticeAreas} settings={settings} />
    </div>
  )
}
