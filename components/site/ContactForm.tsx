'use client'

import { useState, type FormEvent } from 'react'

export function ContactForm({ practiceAreas }: { practiceAreas: string[] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')
    const form = new FormData(event.currentTarget)
    const payload = {
      fullName: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      practiceArea: String(form.get('area') ?? ''),
      message: String(form.get('message') ?? ''),
    }
    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setErrorMessage(body.error || 'Something went wrong. Please try again.')
      setStatus('error')
      return
    }
    setStatus('sent')
    event.currentTarget.reset()
  }

  if (status === 'sent') {
    return (
      <div className="bg-canvas border border-line rounded-lg p-8 text-center">
        <h3 className="font-serif text-navy text-[19px]">Thank you — your message is on its way.</h3>
        <p className="text-muted text-[13px] mt-2">A member of our team will be in touch shortly to confirm your consultation.</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div>
        <label htmlFor="name" className="block text-[11px] font-semibold text-ink mb-1.5">Full Name</label>
        <input id="name" name="name" required placeholder="Jane Wanjiku" className="w-full border border-line rounded-md px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gold/40" />
      </div>
      <div>
        <label htmlFor="email" className="block text-[11px] font-semibold text-ink mb-1.5">Email Address</label>
        <input id="email" name="email" type="email" required placeholder="jane@example.com" className="w-full border border-line rounded-md px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gold/40" />
      </div>
      <div>
        <label htmlFor="area" className="block text-[11px] font-semibold text-ink mb-1.5">Practice Area</label>
        <select id="area" name="area" required className="w-full border border-line rounded-md px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gold/40">
          {practiceAreas.map((area) => <option key={area} value={area}>{area}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-[11px] font-semibold text-ink mb-1.5">Message</label>
        <textarea id="message" name="message" rows={4} placeholder="Tell us briefly about your matter..." className="w-full border border-line rounded-md px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gold/40" />
      </div>
      {status === 'error' && <p className="text-[12px] text-red-600">{errorMessage}</p>}
      <button type="submit" disabled={status === 'sending'} className="inline-flex items-center justify-center gap-2 bg-gold text-white text-[13px] font-semibold px-5 py-3 rounded hover:opacity-90 disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send Message'} <span>↗</span>
      </button>
    </form>
  )
}
