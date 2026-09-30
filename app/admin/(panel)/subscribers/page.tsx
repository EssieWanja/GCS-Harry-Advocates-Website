'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Loader2, Search, Trash2 } from 'lucide-react'
import { useAdmin } from '@/components/admin/AdminChrome'
import { PageHeader } from '@/components/admin/PageHeader'
import { api, formatDate } from '@/lib/admin-client'
import type { NewsletterSubscriber } from '@/lib/schema'

export default function SubscribersPage() {
  const { refresh } = useAdmin()
  const [items, setItems] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const result = await api<{ items: NewsletterSubscriber[] }>('/api/admin/subscribers')
    if (result.data) { setItems(result.data.items); setError('') } else setError(result.error)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const remove = async (item: NewsletterSubscriber) => {
    if (!window.confirm(`Remove ${item.email} from the mailing list?`)) return
    setBusy(item.id)
    const result = await api(`/api/admin/subscribers/${item.id}`, { method: 'DELETE' })
    setBusy(null)
    if (result.error) return setError(result.error)
    load()
    refresh()
  }

  const visible = useMemo(() => items.filter((item) => item.email.includes(query.trim().toLowerCase())), [items, query])

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE"
        title="Newsletter subscribers"
        description="People who signed up through the mailing list form on the home page. Export the list to use in your email tool."
        actions={<a href="/api/admin/subscribers?format=csv" className="primary-button"><Download size={15} /> Export CSV</a>}
      />
      <section className="panel">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <span className="text-[12px] text-muted">{items.length} subscriber{items.length === 1 ? '' : 's'}</span>
          <label className="flex items-center gap-2 border border-line rounded-md px-3 py-2 w-full sm:w-64 bg-white">
            <Search size={15} className="text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by email…" className="w-full text-[13px] outline-none" />
          </label>
        </div>
        {loading ? (
          <p className="p-8 text-center text-muted text-[13px] flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-700 text-[13px]">{error}</p>
        ) : visible.length === 0 ? (
          <p className="p-10 text-center text-muted text-[13px]">{items.length ? 'Nothing matches your search.' : 'No subscribers yet. Sign-ups from the home page will appear here.'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>EMAIL</th><th>SUBSCRIBED</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td><a href={`mailto:${item.email}`} className="text-navy font-medium hover:text-gold">{item.email}</a></td>
                    <td><span className="muted-cell">{formatDate(item.createdAt, true)}</span></td>
                    <td className="text-right">
                      {busy === item.id ? <Loader2 size={16} className="animate-spin inline text-muted" /> : <button onClick={() => remove(item)} className="p-2 text-muted hover:text-red-700" aria-label={`Remove ${item.email}`} title="Remove"><Trash2 size={15} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
