import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_ONLY_PATHS, SESSION_COOKIE, verifySessionToken } from '@/lib/auth'

const PUBLIC_PATHS = new Set(['/admin/login', '/api/admin/login', '/api/admin/logout'])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  const isApi = pathname.startsWith('/api/admin')
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    if (isApi) return NextResponse.json({ error: 'Your session has expired. Please log in again.' }, { status: 401 })
    const loginUrl = new URL('/admin/login', request.url)
    if (pathname !== '/admin') loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (session.role !== 'admin' && ADMIN_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (isApi) return NextResponse.json({ error: 'Only administrators can do this.' }, { status: 403 })
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
