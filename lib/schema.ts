import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const consultationRequests = pgTable('consultation_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  practiceArea: text('practice_area').notNull(),
  message: text('message'),
  preferredDate: timestamp('preferred_date', { withTimezone: true }),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  photoUrl: text('photo_url'),
  tags: text('tags').array().notNull().default([]),
  bio: text('bio'),
  education: text('education'),
  barAdmission: text('bar_admission'),
  languages: text('languages'),
  focusAreas: text('focus_areas'),
  email: text('email'),
  sortOrder: integer('sort_order').notNull().default(0),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const practiceAreas = pgTable('practice_areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary'),
  heroImageUrl: text('hero_image_url'),
  content: text('content'),
  sortOrder: integer('sort_order').notNull().default(0),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const insights = pgTable('insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category'),
  excerpt: text('excerpt'),
  content: text('content'),
  imageUrl: text('image_url'),
  readMinutes: integer('read_minutes').notNull().default(5),
  status: text('status').notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  quote: text('quote').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  photoUrl: text('photo_url'),
  status: text('status').notNull().default('pending'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const matters = pgTable('matters', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  clientName: text('client_name').notNull(),
  practiceArea: text('practice_area'),
  responsible: text('responsible'),
  status: text('status').notNull().default('open'),
  openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull().default(''),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('editor'),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ConsultationRequest = typeof consultationRequests.$inferSelect
export type TeamMember = typeof teamMembers.$inferSelect
export type PracticeArea = typeof practiceAreas.$inferSelect
export type Insight = typeof insights.$inferSelect
export type Testimonial = typeof testimonials.$inferSelect
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type Matter = typeof matters.$inferSelect
export type AdminUser = typeof adminUsers.$inferSelect
