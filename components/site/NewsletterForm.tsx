'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'done' | 'error'; message?: string }>({ status: 'idle' })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setState({ status: 'sending' })
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await response.json() as { error?: string }
      if (!response.ok) return setState({ status: 'error', message: data.error ?? 'Something went wrong. Please try again.' })
      setEmail('')
      setState({ status: 'done', message: 'Thank you for subscribing. Look out for our next legal update.' })
    } catch {
      setState({ status: 'error', message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 flex flex-col items-center gap-4">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        className="w-full bg-white border border-line rounded-md px-4 py-3.5 text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-gold"
      />
      <button type="submit" disabled={state.status === 'sending'} className="bg-navy text-white text-[13px] font-semibold px-8 py-3 rounded-full hover:bg-navy-2 disabled:opacity-60 transition">
        {state.status === 'sending' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {state.message && <p role="status" className={`text-[13px] ${state.status === 'error' ? 'text-red-700' : 'text-green'}`}>{state.message}</p>}
    </form>
  )
}
