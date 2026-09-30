'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ExternalLink, Loader2, Save } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { api } from '@/lib/admin-client'
import { settingGroups, type SiteSettings } from '@/lib/settings'

const inputClass = 'w-full border border-line rounded-md px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25'

export default function SettingsPage() {
  const [values, setValues] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api<{ settings: SiteSettings }>('/api/admin/settings').then((result) => {
      if (result.data) setValues(result.data.settings)
      else setMessage({ tone: 'error', text: result.error })
    })
  }, [])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!values) return
    setSaving(true)
    setMessage(null)
    const result = await api<{ settings: SiteSettings }>('/api/admin/settings', { method: 'PUT', body: values })
    setSaving(false)
    if (!result.data) return setMessage({ tone: 'error', text: result.error })
    setValues(result.data.settings)
    setMessage({ tone: 'ok', text: 'Settings saved. The website now shows the new details.' })
  }

  return (
    <form onSubmit={save}>
      <PageHeader
        eyebrow="SYSTEM"
        title="Site settings"
        description="Firm details used across the public website. Changes go live as soon as you save."
        actions={<>
          <a href="/" target="_blank" rel="noopener noreferrer" className="outline-button"><ExternalLink size={15} /> View website</a>
          <button type="submit" disabled={!values || saving} className="primary-button disabled:opacity-60">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save settings</button>
        </>}
      />
      {message && <div className={message.tone === 'ok' ? 'admin-notice' : 'admin-notice !bg-[#fbeaea] !text-[#a94442] !border-[#f0caca]'} role="status">{message.text}</div>}

      {!values ? (
        <p className="p-8 text-center text-muted text-[13px] flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</p>
      ) : (
        <div className="space-y-5">
          {settingGroups.map((group) => (
            <section key={group.title} className="panel p-6">
              <h2 className="font-serif text-navy text-[18px]">{group.title}</h2>
              <p className="text-muted text-[12px] mt-1 mb-5">{group.description}</p>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className={field.key === 'address' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={field.key} className="block text-[11px] font-semibold text-ink mb-1.5">{field.label}</label>
                    <input
                      id={field.key}
                      value={values[field.key]}
                      inputMode={field.key.startsWith('stat') ? 'numeric' : undefined}
                      onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </form>
  )
}
