import type { ResourceSpec } from '@/lib/admin-api'
import { consultationRequests, insights, matters, practiceAreas, teamMembers, testimonials } from '@/lib/db'

export const REQUEST_STATUSES = ['new', 'pending', 'confirmed', 'completed', 'cancelled'] as const
export const MATTER_STATUSES = ['open', 'on-hold', 'closed'] as const

export const practiceAreaResource: ResourceSpec = {
  table: practiceAreas,
  order: ['sortOrder', 'title'],
  slugFrom: 'title',
  public: true,
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'summary', label: 'Summary' },
    { key: 'heroImageUrl', label: 'Image' },
    { key: 'content', label: 'Page content' },
    { key: 'sortOrder', label: 'Display order', type: 'int' },
    { key: 'status', label: 'Visibility', type: 'enum', values: ['published', 'hidden'] },
  ],
}

export const teamResource: ResourceSpec = {
  table: teamMembers,
  order: ['sortOrder', 'name'],
  slugFrom: 'name',
  public: true,
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'role', label: 'Role', required: true },
    { key: 'photoUrl', label: 'Photo' },
    { key: 'tags', label: 'Expertise tags', type: 'tags' },
    { key: 'bio', label: 'Biography' },
    { key: 'education', label: 'Education' },
    { key: 'barAdmission', label: 'Bar admission' },
    { key: 'languages', label: 'Languages' },
    { key: 'focusAreas', label: 'Focus areas' },
    { key: 'email', label: 'Email' },
    { key: 'sortOrder', label: 'Display order', type: 'int' },
    { key: 'status', label: 'Visibility', type: 'enum', values: ['published', 'hidden'] },
  ],
}

export const insightResource: ResourceSpec = {
  table: insights,
  order: ['-createdAt'],
  slugFrom: 'title',
  public: true,
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'category', label: 'Category' },
    { key: 'excerpt', label: 'Excerpt' },
    { key: 'content', label: 'Article content' },
    { key: 'imageUrl', label: 'Cover image' },
    { key: 'readMinutes', label: 'Reading time', type: 'int' },
    { key: 'status', label: 'Status', type: 'enum', values: ['draft', 'published'] },
  ],
  // Stamp the publish date the first time an article goes live.
  onCreate: (values) => ({ ...values, readMinutes: values.readMinutes || 5, publishedAt: values.status === 'published' ? new Date() : null }),
  onUpdate: (values, existing) => ({ ...values, publishedAt: values.status === 'published' && !existing.publishedAt ? new Date() : existing.publishedAt }),
}

export const testimonialResource: ResourceSpec = {
  table: testimonials,
  order: ['sortOrder', '-createdAt'],
  public: true,
  fields: [
    { key: 'quote', label: 'Quote', required: true },
    { key: 'authorName', label: 'Client name', required: true },
    { key: 'authorRole', label: 'Client title' },
    { key: 'photoUrl', label: 'Photo' },
    { key: 'sortOrder', label: 'Display order', type: 'int' },
    { key: 'status', label: 'Status', type: 'enum', values: ['pending', 'approved'] },
  ],
}

export const matterResource: ResourceSpec = {
  table: matters,
  order: ['-openedAt'],
  fields: [
    { key: 'title', label: 'Matter title', required: true },
    { key: 'clientName', label: 'Client', required: true },
    { key: 'practiceArea', label: 'Practice area' },
    { key: 'responsible', label: 'Responsible advocate' },
    { key: 'status', label: 'Status', type: 'enum', values: MATTER_STATUSES },
    { key: 'openedAt', label: 'Date opened', type: 'date', required: true },
    { key: 'notes', label: 'Notes' },
  ],
}

export const requestResource: ResourceSpec = {
  table: consultationRequests,
  order: ['-createdAt'],
  fields: [
    { key: 'status', label: 'Status', type: 'enum', values: REQUEST_STATUSES },
    { key: 'preferredDate', label: 'Appointment date', type: 'date' },
  ],
}
