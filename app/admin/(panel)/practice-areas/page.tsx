'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import type { PracticeArea } from '@/lib/schema'

const emptyForm = { title: '', summary: '', heroImageUrl: '', content: '', sortOrder: '0', status: 'published' }

export default function PracticeAreasAdminPage() {
  return (
    <ResourceManager<PracticeArea>
      endpoint="/api/admin/practice-areas"
      eyebrow="FIRM CONTENT"
      title="Practice areas"
      description="The services listed on the home page, in the site menu and on each practice area page."
      singular="practice area"
      addLabel="Add practice area"
      emptyForm={emptyForm}
      toForm={(item) => ({ title: item.title, summary: item.summary ?? '', heroImageUrl: item.heroImageUrl ?? '', content: item.content ?? '', sortOrder: String(item.sortOrder), status: item.status })}
      fields={[
        { name: 'title', label: 'Title', required: true, full: true, placeholder: 'e.g. Corporate & Commercial Law' },
        { name: 'summary', label: 'Short summary', type: 'textarea', rows: 3, hint: 'Shown on the practice area cards on the home page.' },
        { name: 'heroImageUrl', label: 'Page image', type: 'image' },
        { name: 'content', label: 'Page content', type: 'textarea', rows: 12, hint: 'Leave a blank line between paragraphs. To make a list of services, put each on its own line starting with "- ".' },
        { name: 'sortOrder', label: 'Display order', type: 'number', hint: 'Lower numbers appear first.' },
        { name: 'status', label: 'Visibility', type: 'select', options: [{ value: 'published', label: 'Published (visible on site)' }, { value: 'hidden', label: 'Hidden' }] },
      ]}
      columns={[
        { label: 'Practice area', render: (item) => <div className="max-w-md"><strong className="text-navy text-[13px]">{item.title}</strong><p className="text-muted text-[11px] mt-1 line-clamp-1">{item.summary}</p></div> },
        { label: 'Order', render: (item) => <span className="muted-cell">{item.sortOrder}</span> },
        { label: 'Status', render: (item) => <StatusBadge value={item.status} /> },
      ]}
      filters={[
        { label: 'All', match: () => true },
        { label: 'Published', match: (item) => item.status === 'published' },
        { label: 'Hidden', match: (item) => item.status !== 'published' },
      ]}
      toggle={{ field: 'status', on: 'published', off: 'hidden', onLabel: 'Publish', offLabel: 'Hide from site' }}
      searchText={(item) => `${item.title} ${item.summary ?? ''}`}
      viewHref={(item) => (item.status === 'published' ? `/practice-areas/${item.slug}` : null)}
    />
  )
}
