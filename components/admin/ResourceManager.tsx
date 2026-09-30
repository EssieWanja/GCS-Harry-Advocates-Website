'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ExternalLink, Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useAdmin } from '@/components/admin/AdminChrome'
import { ImageField } from '@/components/admin/ImageField'
import { PageHeader } from '@/components/admin/PageHeader'
import { api } from '@/lib/admin-client'

export type FieldDef = {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'select' | 'number' | 'image' | 'email' | 'date' | 'password'
  options?: { value: string; label: string }[]
  full?: boolean
  rows?: number
  required?: boolean
  placeholder?: string
  hint?: string
}

type Row = { id: string }
type Form = Record<string, string>

type Props<T extends Row> = {
  endpoint: string
  eyebrow: string
  title: string
  description: string
  singular: string
  addLabel?: string
  fields: FieldDef[]
  emptyForm: Form
  toForm: (item: T) => Form
  columns: { label: string; render: (item: T) => ReactNode; className?: string }[]
  searchText: (item: T) => string
  filters?: { label: string; match: (item: T) => boolean }[]
  /** One-click switch shown on each row, e.g. publish / hide. */
  toggle?: { field: string; on: string; off: string; onLabel: string; offLabel: string }
  viewHref?: (item: T) => string | null
  canEdit?: (item: T) => boolean
  toPayload?: (form: Form, isNew: boolean) => Record<string, unknown>
  notice?: ReactNode
}

const inputClass = 'w-full border border-line rounded-md px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25'

export function ResourceManager<T extends Row>(props: Props<T>) {
  const { endpoint, singular, fields, emptyForm } = props
  // Kept in a ref so pages can pass inline functions without re-triggering the initial load.
  const toFormRef = useRef(props.toForm)
  toFormRef.current = props.toForm
  const { refresh } = useAdmin()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<T | 'new' | null>(null)
  const [form, setForm] = useState<Form>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(0)
  const [busyId, setBusyId] = useState<string | null>(null)

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const load = useCallback(async () => {
    const result = await api<{ items: T[] }>(endpoint)
    if (result.data) { setItems(result.data.items); setLoadError('') } else setLoadError(result.error)
    setLoading(false)
    return result.data?.items ?? []
  }, [endpoint])

  const open = useCallback((item: T | 'new') => {
    setForm(item === 'new' ? { ...emptyForm } : toFormRef.current(item))
    setFormError('')
    setEditing(item)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { load() }, [load])

  // Links such as ?new=1 (quick actions) or ?edit=<id> (search results) open the form straight away.
  const newParam = searchParams.get('new')
  const editParam = searchParams.get('edit')
  useEffect(() => {
    if (!newParam && !editParam) return
    if (newParam) open('new')
    else {
      const target = items.find((item) => item.id === editParam)
      if (!target) return
      open(target)
    }
    router.replace(pathname, { scroll: false })
  }, [newParam, editParam, items, open, router, pathname])

  useEffect(() => {
    if (!editing) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setEditing(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editing])

  const save = async () => {
    const missing = fields.find((field) => field.required && !form[field.name]?.trim())
    if (missing) return setFormError(`${missing.label} is required.`)
    setSaving(true)
    setFormError('')
    const isNew = editing === 'new'
    const result = await api(isNew ? endpoint : `${endpoint}/${(editing as T).id}`, { method: isNew ? 'POST' : 'PATCH', body: props.toPayload ? props.toPayload(form, isNew) : form })
    setSaving(false)
    if (result.error) return setFormError(result.error)
    setEditing(null)
    flash(isNew ? `New ${singular} added.` : `${singular[0].toUpperCase()}${singular.slice(1)} saved.`)
    load()
    refresh()
  }

  const remove = async (item: T) => {
    if (!window.confirm(`Delete this ${singular}? This cannot be undone.`)) return
    setBusyId(item.id)
    const result = await api(`${endpoint}/${item.id}`, { method: 'DELETE' })
    setBusyId(null)
    if (result.error) return flash(result.error)
    setEditing(null)
    flash(`${singular[0].toUpperCase()}${singular.slice(1)} deleted.`)
    load()
    refresh()
  }

  const toggle = async (item: T) => {
    const spec = props.toggle
    if (!spec) return
    const next = (item as Record<string, unknown>)[spec.field] === spec.on ? spec.off : spec.on
    setBusyId(item.id)
    const result = await api(`${endpoint}/${item.id}`, { method: 'PATCH', body: { [spec.field]: next } })
    setBusyId(null)
    if (result.error) return flash(result.error)
    flash(`Marked as ${next}.`)
    load()
    refresh()
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const activeFilter = props.filters?.[filter]
    return items.filter((item) => (!activeFilter || activeFilter.match(item)) && (!needle || props.searchText(item).toLowerCase().includes(needle)))
  }, [items, query, filter, props])

  const editable = (item: T) => props.canEdit?.(item) ?? true

  return (
    <>
      <PageHeader
        eyebrow={props.eyebrow}
        title={props.title}
        description={props.description}
        actions={props.addLabel && <button onClick={() => open('new')} className="primary-button"><Plus size={16} /> {props.addLabel}</button>}
      />
      {props.notice}

      <section className="panel">
        <div className="flex flex-wrap items-center gap-3 justify-between px-5 py-4 border-b border-line">
          <div className="flex flex-wrap gap-1.5">
            {props.filters?.map((option, index) => (
              <button key={option.label} onClick={() => setFilter(index)} className={`text-[12px] px-3 py-1.5 rounded-full border ${filter === index ? 'bg-navy text-white border-navy' : 'bg-white text-ink border-line hover:border-gold'}`}>
                {option.label} <span className="opacity-60">{items.filter(option.match).length}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border border-line rounded-md px-3 py-2 w-full sm:w-64 bg-white">
            <Search size={15} className="text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${props.title.toLowerCase()}…`} className="w-full text-[13px] outline-none" />
          </label>
        </div>

        {loading ? (
          <p className="p-8 text-center text-muted text-[13px] flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</p>
        ) : loadError ? (
          <p className="p-8 text-center text-red-700 text-[13px]">{loadError} <button onClick={load} className="underline ml-1">Try again</button></p>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted text-[13px]">{items.length ? 'Nothing matches your search.' : `No ${props.title.toLowerCase()} yet.`}</p>
            {!items.length && props.addLabel && <button onClick={() => open('new')} className="mt-4 primary-button mx-auto"><Plus size={16} /> {props.addLabel}</button>}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>{props.columns.map((column) => <th key={column.label}>{column.label.toUpperCase()}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {visible.map((item) => {
                  const href = props.viewHref?.(item)
                  const on = props.toggle && (item as Record<string, unknown>)[props.toggle.field] === props.toggle.on
                  return (
                    <tr key={item.id} className={editable(item) ? 'cursor-pointer hover:bg-[#fcfaf7]' : ''} onClick={() => editable(item) && open(item)}>
                      {props.columns.map((column) => <td key={column.label} className={column.className}>{column.render(item)}</td>)}
                      <td className="text-right whitespace-nowrap" onClick={(event) => event.stopPropagation()}>
                        {busyId === item.id ? <Loader2 size={16} className="animate-spin inline text-muted" /> : (
                          <div className="inline-flex items-center gap-0.5">
                            {href && <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-navy" title="View on website" aria-label="View on website"><ExternalLink size={15} /></a>}
                            {props.toggle && editable(item) && (
                              <button onClick={() => toggle(item)} className="p-2 text-muted hover:text-gold" title={on ? props.toggle.offLabel : props.toggle.onLabel} aria-label={on ? props.toggle.offLabel : props.toggle.onLabel}>
                                {on ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            )}
                            {editable(item) && <button onClick={() => open(item)} className="p-2 text-muted hover:text-gold" title="Edit" aria-label="Edit"><Pencil size={15} /></button>}
                            {editable(item) && <button onClick={() => remove(item)} className="p-2 text-muted hover:text-red-700" title="Delete" aria-label="Delete"><Trash2 size={15} /></button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={editing === 'new' ? `New ${singular}` : `Edit ${singular}`}>
          <button className="absolute inset-0 bg-navy/40" onClick={() => setEditing(null)} aria-label="Close" />
          <div className="relative bg-white w-full max-w-[620px] h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 h-16 border-b border-line shrink-0">
              <h2 className="font-serif text-navy text-[19px]">{editing === 'new' ? `New ${singular}` : `Edit ${singular}`}</h2>
              <button onClick={() => setEditing(null)} className="p-2 text-muted hover:text-navy" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
                {fields.map((field) => (
                  <div key={field.name} className={field.full || field.type === 'textarea' || field.type === 'image' ? 'sm:col-span-2' : ''}>
                    <label className="block text-[11px] font-semibold text-ink mb-1.5" htmlFor={`field-${field.name}`}>{field.label}{field.required && <span className="text-gold"> *</span>}</label>
                    <FieldInput field={field} value={form[field.name] ?? ''} onChange={(value) => setForm((current) => ({ ...current, [field.name]: value }))} />
                    {field.hint && <p className="text-[11px] text-muted mt-1.5 leading-relaxed">{field.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-line px-6 py-4 shrink-0 bg-canvas">
              {formError && <p className="text-[12px] text-red-700 mb-3" role="alert">{formError}</p>}
              <div className="flex items-center gap-3">
                <button onClick={save} disabled={saving} className="primary-button disabled:opacity-60">{saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : editing === 'new' ? `Add ${singular}` : 'Save changes'}</button>
                <button onClick={() => setEditing(null)} className="outline-button">Cancel</button>
                {editing !== 'new' && <button onClick={() => remove(editing)} className="ml-auto text-[12px] text-red-700 hover:underline inline-flex items-center gap-1"><Trash2 size={14} /> Delete</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 z-[60] bg-navy text-white text-[13px] px-4 py-3 rounded-md shadow-lg" role="status">{toast}</div>}
    </>
  )
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: string; onChange: (value: string) => void }) {
  const common = { id: `field-${field.name}`, value, placeholder: field.placeholder, className: inputClass }
  switch (field.type) {
    case 'textarea':
      return <textarea {...common} rows={field.rows ?? 4} onChange={(event) => onChange(event.target.value)} />
    case 'select':
      return <select {...common} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    case 'image':
      return <ImageField value={value} onChange={onChange} inputClass={inputClass} />
    default:
      return <input {...common} type={field.type ?? 'text'} autoComplete={field.type === 'password' ? 'new-password' : undefined} onChange={(event) => onChange(event.target.value)} />
  }
}
