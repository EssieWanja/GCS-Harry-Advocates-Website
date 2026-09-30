'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import { formatDate } from '@/lib/admin-client'
import type { Insight } from '@/lib/schema'

const emptyForm = { title: '', category: '', excerpt: '', content: '', imageUrl: '', readMinutes: '5', status: 'draft' }

export default function InsightsAdminPage() {
  return (
    <ResourceManager<Insight>
      endpoint="/api/admin/insights"
      eyebrow="FIRM CONTENT"
      title="Insights"
      description="Articles and legal updates. Published articles appear on the public Insights page straight away."
      singular="insight"
      addLabel="Write an insight"
      emptyForm={emptyForm}
      toForm={(item) => ({ title: item.title, category: item.category ?? '', excerpt: item.excerpt ?? '', content: item.content ?? '', imageUrl: item.imageUrl ?? '', readMinutes: String(item.readMinutes), status: item.status })}
      fields={[
        { name: 'title', label: 'Title', required: true, full: true },
        { name: 'category', label: 'Category', placeholder: 'e.g. Corporate & Commercial' },
        { name: 'readMinutes', label: 'Reading time (minutes)', type: 'number' },
        { name: 'imageUrl', label: 'Cover image', type: 'image' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3, hint: 'A one or two sentence teaser shown on the Insights page.' },
        { name: 'content', label: 'Article', type: 'textarea', rows: 16, hint: 'Leave a blank line between paragraphs. Lines starting with "- " become a bulleted list.' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'draft', label: 'Draft (not visible)' }, { value: 'published', label: 'Published (visible on site)' }] },
      ]}
      columns={[
        { label: 'Title', render: (item) => <div className="max-w-md"><strong className="text-navy text-[13px]">{item.title}</strong><p className="text-muted text-[11px] mt-1">{item.category ?? 'Uncategorised'} · {item.readMinutes} min read</p></div> },
        { label: 'Published', render: (item) => <span className="muted-cell">{item.status === 'published' ? formatDate(item.publishedAt) : '—'}</span> },
        { label: 'Status', render: (item) => <StatusBadge value={item.status} /> },
      ]}
      filters={[
        { label: 'All', match: () => true },
        { label: 'Published', match: (item) => item.status === 'published' },
        { label: 'Drafts', match: (item) => item.status === 'draft' },
      ]}
      toggle={{ field: 'status', on: 'published', off: 'draft', onLabel: 'Publish', offLabel: 'Move to drafts' }}
      searchText={(item) => `${item.title} ${item.category ?? ''} ${item.excerpt ?? ''}`}
      viewHref={(item) => (item.status === 'published' ? `/insights/${item.slug}` : null)}
    />
  )
}
