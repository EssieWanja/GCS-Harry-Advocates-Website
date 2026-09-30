import type { Metadata } from 'next'
import { AdminChrome } from '@/components/admin/AdminChrome'

// Admin screens always show live data and read query parameters, so never prerender them.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: { default: 'Firm administration', template: '%s · Admin' }, robots: { index: false, follow: false } }

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>
}
