'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import type { Summary } from '@/components/admin/AdminChrome'
import { PageHeader } from '@/components/admin/PageHeader'
import { api } from '@/lib/admin-client'

export default function ActivityPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Summary>('/api/admin/summary?activity=100').then((result) => (result.data ? setData(result.data) : setError(result.error)))
  }, [])

  return (
    <>
      <PageHeader eyebrow="FIRM PULSE" title="Recent activity" description="Everything that has changed across the website and workspace, newest first. Click any item to open it." />
      <section className="panel py-2">
        {error ? <p className="p-8 text-center text-red-700 text-[13px]">{error}</p>
          : !data ? <p className="p-8 text-center text-muted text-[13px] flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</p>
          : <ActivityFeed items={data.activity} />}
      </section>
    </>
  )
}
