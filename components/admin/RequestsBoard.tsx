'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, Clock3, Loader2, Mail, Phone, Search, Trash2, XCircle } from 'lucide-react'
import { useAdmin, type ConsultationRequest } from '@/components/admin/AdminChrome'
import { PageHeader, StatusBadge } from '@/components/admin/PageHeader'
import { api, formatDate, timeAgo } from '@/lib/admin-client'

type Tab = { label: string; statuses: string[] }

const modes = {
  enquiries: {
    eyebrow: 'WORKSPACE',
    title: 'Enquiries',
    description: 'New requests sent through the website contact form. Confirm a time to move one to Consultations, or decline it.',
    tabs: [{ label: 'New', statuses: ['new'] }, { label: 'All requests', statuses: ['new', 'pending', 'confirmed', 'completed', 'cancelled'] }],
    empty: 'No new enquiries. New requests from the contact form will appear here.',
  },
  consultations: {
    eyebrow: 'WORKSPACE',
    title: 'Consultations',
    description: 'Consultations you have accepted. Set the appointment time, then mark each one completed afterwards.',
    tabs: [
      { label: 'Upcoming', statuses: ['confirmed', 'pending'] },
      { label: 'Completed', statuses: ['completed'] },
      { label: 'Cancelled', statuses: ['cancelled'] },
      { label: 'All', statuses: ['new', 'pending', 'confirmed', 'completed', 'cancelled'] },
    ],
    empty: 'No consultations here yet. Confirm an enquiry to schedule it.',
  },
} satisfies Record<string, { eyebrow: string; title: string; description: string; tabs: Tab[]; empty: string }>

const toLocalInput = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function RequestsBoard({ mode }: { mode: keyof typeof modes }) {
  const config = modes[mode]
  const { refresh } = useAdmin()
  const [items, setItems] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [dates, setDates] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const result = await api<{ items: ConsultationRequest[] }>('/api/admin/requests')
    if (result.data) { setItems(result.data.items); setError('') } else setError(result.error)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200) }

  const update = async (item: ConsultationRequest, changes: { status?: string; preferredDate?: string }, message: string) => {
    setBusy(item.id)
    const result = await api(`/api/admin/requests/${item.id}`, { method: 'PATCH', body: changes })
    setBusy(null)
    if (result.error) return flash(result.error)
    flash(message)
    load()
    refresh()
  }

  const remove = async (item: ConsultationRequest) => {
    if (!window.confirm(`Delete the request from ${item.fullName}? This cannot be undone.`)) return
    setBusy(item.id)
    const result = await api(`/api/admin/requests/${item.id}`, { method: 'DELETE' })
    setBusy(null)
    if (result.error) return flash(result.error)
    flash('Request deleted.')
    load()
    refresh()
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items
      .filter((item) => config.tabs[tab].statuses.includes(item.status))
      .filter((item) => !needle || `${item.fullName} ${item.email} ${item.practiceArea} ${item.message ?? ''}`.toLowerCase().includes(needle))
      .sort((a, b) => (mode === 'consultations' && tab === 0
        ? (a.preferredDate ? new Date(a.preferredDate).getTime() : Infinity) - (b.preferredDate ? new Date(b.preferredDate).getTime() : Infinity)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [items, query, tab, config, mode])

  return (
    <>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} />

      <section className="panel">
        <div className="flex flex-wrap items-center gap-3 justify-between px-5 py-4 border-b border-line">
          <div className="flex flex-wrap gap-1.5">
            {config.tabs.map((option, index) => (
              <button key={option.label} onClick={() => setTab(index)} className={`text-[12px] px-3 py-1.5 rounded-full border ${tab === index ? 'bg-navy text-white border-navy' : 'bg-white text-ink border-line hover:border-gold'}`}>
                {option.label} <span className="opacity-60">{items.filter((item) => option.statuses.includes(item.status)).length}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border border-line rounded-md px-3 py-2 w-full sm:w-64 bg-white">
            <Search size={15} className="text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email or matter…" className="w-full text-[13px] outline-none" />
          </label>
        </div>

        {loading ? (
          <p className="p-8 text-center text-muted text-[13px] flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-700 text-[13px]">{error} <button onClick={load} className="underline ml-1">Try again</button></p>
        ) : visible.length === 0 ? (
          <p className="p-10 text-center text-muted text-[13px]">{query ? 'Nothing matches your search.' : config.empty}</p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((item) => (
              <li key={item.id} className="px-5 py-5 grid lg:grid-cols-[1fr_300px] gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <strong className="text-navy text-[14px]">{item.fullName}</strong>
                    <StatusBadge value={item.status} />
                    <span className="text-[11px] text-muted">Received {timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="text-[12px] text-gold font-semibold mt-1.5">{item.practiceArea}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[12px] text-muted">
                    <a href={`mailto:${item.email}?subject=${encodeURIComponent('Your consultation request – Harry Advocates')}`} className="inline-flex items-center gap-1.5 hover:text-navy"><Mail size={13} /> {item.email}</a>
                    {item.phone && <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 hover:text-navy"><Phone size={13} /> {item.phone}</a>}
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {item.preferredDate ? formatDate(item.preferredDate, true) : 'No appointment set'}</span>
                  </div>
                  {item.message && <p className="mt-3 text-[13px] text-ink leading-relaxed bg-canvas border border-line rounded-md px-3.5 py-3 whitespace-pre-line">{item.message}</p>}
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold text-ink" htmlFor={`date-${item.id}`}>Appointment date & time</label>
                  <div className="flex gap-2">
                    <input id={`date-${item.id}`} type="datetime-local" value={dates[item.id] ?? toLocalInput(item.preferredDate)} onChange={(event) => setDates({ ...dates, [item.id]: event.target.value })} className="flex-1 min-w-0 border border-line rounded-md px-2.5 py-2 text-[12px]" />
                    <button
                      disabled={busy === item.id || !(dates[item.id] ?? '')}
                      onClick={() => update(item, { preferredDate: new Date(dates[item.id]).toISOString(), status: item.status === 'new' || item.status === 'pending' ? 'confirmed' : item.status }, 'Appointment saved and confirmed.')}
                      className="outline-button disabled:opacity-50"
                      title="Save appointment time"
                    >
                      <CalendarClock size={14} /> Set
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {busy === item.id ? <Loader2 size={16} className="animate-spin text-muted" /> : (
                      <>
                        {['new', 'pending'].includes(item.status) && <button onClick={() => update(item, { status: 'confirmed' }, 'Moved to Consultations.')} className="primary-button"><CheckCircle2 size={14} /> Confirm</button>}
                        {item.status === 'confirmed' && <button onClick={() => update(item, { status: 'completed' }, 'Marked as completed.')} className="primary-button"><CheckCircle2 size={14} /> Mark completed</button>}
                        {item.status === 'new' && <button onClick={() => update(item, { status: 'pending' }, 'Marked as awaiting reply.')} className="outline-button">Awaiting reply</button>}
                        {!['cancelled', 'completed'].includes(item.status) && <button onClick={() => update(item, { status: 'cancelled' }, 'Request declined.')} className="outline-button"><XCircle size={14} /> Decline</button>}
                        {['cancelled', 'completed'].includes(item.status) && <button onClick={() => update(item, { status: 'confirmed' }, 'Reopened.')} className="outline-button">Reopen</button>}
                        <button onClick={() => remove(item)} className="p-2 text-muted hover:text-red-700" title="Delete request" aria-label="Delete request"><Trash2 size={15} /></button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toast && <div className="fixed bottom-6 right-6 z-[60] bg-navy text-white text-[13px] px-4 py-3 rounded-md shadow-lg" role="status">{toast}</div>}
    </>
  )
}
