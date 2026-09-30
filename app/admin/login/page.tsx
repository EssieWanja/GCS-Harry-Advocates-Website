'use client'

import { useState, type FormEvent } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(body.error || 'Unable to log in.')
      return
    }
    // Return to the page that sent the user here, but only ever within the admin area.
    const next = new URLSearchParams(window.location.search).get('next')
    window.location.href = next?.startsWith('/admin/') ? next : '/admin'
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark login-brand-mark">H</div>
        <h1>Firm administration</h1>
        <p>Sign in to manage Harry Advocates content and consultations.</p>
        {error && <div className="login-error" role="alert">{error}</div>}
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@harryadvocates.co.ke" />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        </div>
        <button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
