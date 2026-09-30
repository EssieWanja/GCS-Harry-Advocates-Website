import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { count, eq } from 'drizzle-orm'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from '@/lib/schema'
import { insightSeed, practiceAreaSeed, teamMemberSeed, testimonialSeed } from '@/lib/seed'

export * from '@/lib/schema'

export type Database = NodePgDatabase<typeof schema>

// With DATABASE_URL set we use that Postgres server. Without it we fall back to
// PGlite, an embedded Postgres stored in .data/ — same schema and queries, so the
// admin works out of the box on a single server or a developer's machine.
export const usingEmbeddedDatabase = !process.env.DATABASE_URL

const migrationsFolder = path.join(process.cwd(), 'drizzle')
const store = globalThis as unknown as { dbPromise?: Promise<Database> }

async function connect(): Promise<Database> {
  let db: Database
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 })
    pool.on('error', () => {})
    db = drizzle(pool, { schema })
    await migrate(db, { migrationsFolder })
  } else {
    const { PGlite } = await import('@electric-sql/pglite')
    const pglite = await import('drizzle-orm/pglite')
    const { migrate: migrateLocal } = await import('drizzle-orm/pglite/migrator')
    const dataDir = path.join(process.cwd(), '.data', 'pglite')
    // PGlite only creates the last folder of the path, so make sure .data/ exists first.
    await mkdir(path.dirname(dataDir), { recursive: true })
    const local = pglite.drizzle(new PGlite(dataDir), { schema })
    await migrateLocal(local, { migrationsFolder })
    db = local as unknown as Database
  }
  await seedOnce(db)
  return db
}

/** Connects (once per server process) and returns the database. */
export function getDb() {
  store.dbPromise ??= connect().catch((error) => {
    store.dbPromise = undefined
    throw error
  })
  return store.dbPromise
}

// Fills empty content tables with the starter content the first time only, so
// content the admin later deletes is not brought back on the next restart.
async function seedOnce(db: Database) {
  const [flag] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, '_seeded'))
  if (flag) return

  const isEmpty = async (table: typeof schema.practiceAreas | typeof schema.teamMembers | typeof schema.insights | typeof schema.testimonials) => {
    const [row] = await db.select({ total: count() }).from(table)
    return Number(row.total) === 0
  }
  if (await isEmpty(schema.practiceAreas)) await db.insert(schema.practiceAreas).values(practiceAreaSeed)
  if (await isEmpty(schema.teamMembers)) await db.insert(schema.teamMembers).values(teamMemberSeed)
  if (await isEmpty(schema.insights)) await db.insert(schema.insights).values(insightSeed.map((item) => ({ ...item, status: 'published', publishedAt: new Date() })))
  if (await isEmpty(schema.testimonials)) await db.insert(schema.testimonials).values(testimonialSeed.map((item) => ({ ...item, status: 'approved' })))
  await db.insert(schema.siteSettings).values({ key: '_seeded', value: new Date().toISOString() }).onConflictDoNothing()
}
