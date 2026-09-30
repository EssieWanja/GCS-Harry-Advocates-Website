// Browser-side helpers shared by the admin screens.

export type ApiResult<T> = { data: T; error?: undefined } | { data?: undefined; error: string }

/** fetch() wrapper that always resolves to either data or a readable error message. */
export async function api<T = unknown>(url: string, init?: { method?: string; body?: unknown }): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method: init?.method ?? 'GET',
      cache: 'no-store',
      headers: init?.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
    if (response.status === 401) {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`
      return { error: 'Your session has expired. Please log in again.' }
    }
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) return { error: payload.error ?? 'Something went wrong. Please try again.' }
    return { data: payload as T }
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' }
  }
}

export function formatDate(value: string | Date | null | undefined, withTime = false) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-KE', withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' })
}

export function timeAgo(value: string | Date) {
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(value)
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}
