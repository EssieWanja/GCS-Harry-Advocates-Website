'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import type { Testimonial } from '@/lib/schema'

const emptyForm = { quote: '', authorName: '', authorRole: '', photoUrl: '', sortOrder: '0', status: 'approved' }

export default function TestimonialsAdminPage() {
  return (
    <ResourceManager<Testimonial>
      endpoint="/api/admin/testimonials"
      eyebrow="FIRM CONTENT"
      title="Testimonials"
      description="Client feedback. Approved testimonials scroll across the home page; pending ones stay hidden until approved."
      singular="testimonial"
      addLabel="Add testimonial"
      emptyForm={emptyForm}
      toForm={(item) => ({ quote: item.quote, authorName: item.authorName, authorRole: item.authorRole ?? '', photoUrl: item.photoUrl ?? '', sortOrder: String(item.sortOrder), status: item.status })}
      fields={[
        { name: 'quote', label: 'Quote', type: 'textarea', rows: 5, required: true },
        { name: 'authorName', label: 'Client name', required: true },
        { name: 'authorRole', label: 'Client title / company', placeholder: 'e.g. CEO, Kamau Construction Ltd' },
        { name: 'photoUrl', label: 'Client photo (optional)', type: 'image' },
        { name: 'sortOrder', label: 'Display order', type: 'number', hint: 'Lower numbers appear first.' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'approved', label: 'Approved (visible on site)' }, { value: 'pending', label: 'Pending review' }] },
      ]}
      columns={[
        { label: 'Quote', render: (item) => <p className="text-[12px] text-ink max-w-md line-clamp-2">&ldquo;{item.quote}&rdquo;</p> },
        { label: 'Client', render: (item) => <div><strong className="text-[12px] text-navy">{item.authorName}</strong><span className="block muted-cell">{item.authorRole}</span></div> },
        { label: 'Status', render: (item) => <StatusBadge value={item.status} /> },
      ]}
      filters={[
        { label: 'All', match: () => true },
        { label: 'Pending review', match: (item) => item.status === 'pending' },
        { label: 'Approved', match: (item) => item.status === 'approved' },
      ]}
      toggle={{ field: 'status', on: 'approved', off: 'pending', onLabel: 'Approve', offLabel: 'Unapprove' }}
      searchText={(item) => `${item.quote} ${item.authorName} ${item.authorRole ?? ''}`}
      viewHref={(item) => (item.status === 'approved' ? '/' : null)}
    />
  )
}
