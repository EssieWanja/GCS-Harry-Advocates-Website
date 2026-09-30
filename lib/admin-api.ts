import { asc, desc, eq, type SQL } from 'drizzle-orm'
import type { PgTableWithColumns } from 'drizzle-orm/pg-core'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return token ? verifySessionToken(token) : null
}

/** Public pages read straight from the database; this drops any cached copies after an admin change. */
export function refreshSite() {
  revalidatePath('/', 'layout')
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json()
    return body && typeof body === 'object' ? body as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

/** Runs a handler and turns database failures into readable JSON errors for the admin UI. */
export async function guard(handler: () => Promise<Response>) {
  try {
    return await handler()
  } catch (error) {
    const code = (error as { code?: string; cause?: { code?: string } })?.code ?? (error as { cause?: { code?: string } })?.cause?.code
    if (code === '23505') return jsonError('Another record already uses that web address or email. Please choose a different one.', 409)
    console.error('[admin api]', error)
    return jsonError('Something went wrong while saving. Please try again.', 500)
  }
}

type FieldSpec = {
  key: string
  label: string
  type?: 'text' | 'int' | 'tags' | 'date' | 'enum'
  required?: boolean
  values?: readonly string[]
}

type ParseResult = { values: Record<string, unknown>; error?: string }

export function parseFields(body: Record<string, unknown>, fields: FieldSpec[], mode: 'create' | 'update'): ParseResult {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if (!(field.key in body)) {
      if (mode === 'create' && field.required) return { values, error: `${field.label} is required.` }
      continue
    }
    const raw = body[field.key]
    let value: unknown
    switch (field.type ?? 'text') {
      case 'int': {
        const parsed = Number.parseInt(String(raw ?? ''), 10)
        value = Number.isNaN(parsed) ? 0 : parsed
        break
      }
      case 'tags':
        value = (Array.isArray(raw) ? raw.map(String) : String(raw ?? '').split(',')).map((tag) => tag.trim()).filter(Boolean)
        break
      case 'date': {
        const text = String(raw ?? '').trim()
        value = text ? new Date(text) : null
        if (value && Number.isNaN((value as Date).getTime())) return { values, error: `${field.label} is not a valid date.` }
        break
      }
      case 'enum':
        value = String(raw ?? '')
        if (!field.values?.includes(value as string)) return { values, error: `${field.label} must be one of: ${field.values?.join(', ')}.` }
        break
      default:
        value = String(raw ?? '').trim() || null
    }
    if (field.required && (value === null || value === '')) return { values, error: `${field.label} is required.` }
    values[field.key] = value
  }
  return { values }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = PgTableWithColumns<any>

export type ResourceSpec = {
  table: AnyTable
  fields: FieldSpec[]
  /** Column names to order the admin list by; prefix with '-' for descending. */
  order: string[]
  /** Build a slug from this field on create when none is given. */
  slugFrom?: string
  /** Whether changes should appear on the public website. */
  public?: boolean
  onCreate?: (values: Record<string, unknown>) => Record<string, unknown>
  onUpdate?: (values: Record<string, unknown>, existing: Record<string, unknown>) => Record<string, unknown>
}

function orderBy(spec: ResourceSpec): SQL[] {
  return spec.order.map((name) => (name.startsWith('-') ? desc(spec.table[name.slice(1)]) : asc(spec.table[name])))
}

/** GET (list) and POST (create) handlers for a content table. */
export function collectionRoutes(spec: ResourceSpec) {
  return {
    GET: () => guard(async () => {
      const db = await getDb()
      const items = await db.select().from(spec.table).orderBy(...orderBy(spec))
      return NextResponse.json({ items })
    }),
    POST: (request: Request) => guard(async () => {
      const body = await readJson(request)
      const parsed = parseFields(body, spec.fields, 'create')
      if (parsed.error) return jsonError(parsed.error)
      let values = parsed.values
      if (spec.slugFrom) {
        const slug = slugify(String(body.slug ?? '') || String(values[spec.slugFrom] ?? ''))
        if (!slug) return jsonError('Please enter a title so the page can be given a web address.')
        values.slug = slug
      }
      if (spec.onCreate) values = spec.onCreate(values)
      const db = await getDb()
      const [item] = await db.insert(spec.table).values(values).returning()
      if (spec.public) refreshSite()
      return NextResponse.json({ item }, { status: 201 })
    }),
  }
}

type IdContext = { params: Promise<{ id: string }> }

/** PATCH (update) and DELETE handlers for a single row, addressed by id. */
export function itemRoutes(spec: ResourceSpec) {
  return {
    PATCH: (request: Request, { params }: IdContext) => guard(async () => {
      const { id } = await params
      const body = await readJson(request)
      const parsed = parseFields(body, spec.fields, 'update')
      if (parsed.error) return jsonError(parsed.error)
      const db = await getDb()
      const [existing] = await db.select().from(spec.table).where(eq(spec.table.id, id))
      if (!existing) return jsonError('This item no longer exists. It may have been deleted.', 404)
      let values = parsed.values
      if (spec.slugFrom && typeof body.slug === 'string' && body.slug.trim()) values.slug = slugify(body.slug)
      if (spec.onUpdate) values = spec.onUpdate(values, existing)
      const [item] = await db.update(spec.table).set({ ...values, updatedAt: new Date() }).where(eq(spec.table.id, id)).returning()
      if (spec.public) refreshSite()
      return NextResponse.json({ item })
    }),
    DELETE: (_request: Request, { params }: IdContext) => guard(async () => {
      const { id } = await params
      const db = await getDb()
      await db.delete(spec.table).where(eq(spec.table.id, id))
      if (spec.public) refreshSite()
      return NextResponse.json({ ok: true })
    }),
  }
}
