'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import { initials } from '@/lib/admin-client'
import { MANAGER_SLUG } from '@/lib/constants'
import type { TeamMember } from '@/lib/schema'

const emptyForm = { name: '', role: '', photoUrl: '', tags: '', bio: '', education: '', barAdmission: '', languages: '', focusAreas: '', email: '', sortOrder: '0', status: 'published' }

export default function TeamAdminPage() {
  return (
    <ResourceManager<TeamMember>
      endpoint="/api/admin/team"
      eyebrow="FIRM CONTENT"
      title="Team profiles"
      description="The people shown on the Our Team page and their profile pages. The Manager's profile appears on the About page."
      singular="team member"
      addLabel="Add team member"
      emptyForm={emptyForm}
      toForm={(item) => ({ name: item.name, role: item.role, photoUrl: item.photoUrl ?? '', tags: item.tags.join(', '), bio: item.bio ?? '', education: item.education ?? '', barAdmission: item.barAdmission ?? '', languages: item.languages ?? '', focusAreas: item.focusAreas ?? '', email: item.email ?? '', sortOrder: String(item.sortOrder), status: item.status })}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'role', label: 'Role / title', required: true, placeholder: 'e.g. Senior Associate' },
        { name: 'photoUrl', label: 'Portrait photo', type: 'image' },
        { name: 'bio', label: 'Biography', type: 'textarea', rows: 10, hint: 'Leave a blank line between paragraphs.' },
        { name: 'tags', label: 'Expertise tags', full: true, hint: 'Separate with commas, e.g. Family Law, Trusts, Estate Planning' },
        { name: 'education', label: 'Education' },
        { name: 'barAdmission', label: 'Bar admission' },
        { name: 'languages', label: 'Languages' },
        { name: 'focusAreas', label: 'Focus areas' },
        { name: 'email', label: 'Contact email', type: 'email' },
        { name: 'sortOrder', label: 'Display order', type: 'number', hint: 'Lower numbers appear first.' },
        { name: 'status', label: 'Visibility', type: 'select', options: [{ value: 'published', label: 'Published (visible on site)' }, { value: 'hidden', label: 'Hidden' }] },
      ]}
      columns={[
        {
          label: 'Team member',
          render: (item) => (
            <div className="client-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.photoUrl ? <img src={item.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="avatar avatar-blue">{initials(item.name)}</div>}
              <div><strong>{item.name}</strong>{item.slug === MANAGER_SLUG && <span className="block text-[10px] text-gold mt-0.5">Featured on About page</span>}</div>
            </div>
          ),
        },
        { label: 'Role', render: (item) => <span className="muted-cell">{item.role}</span> },
        { label: 'Order', render: (item) => <span className="muted-cell">{item.sortOrder}</span> },
        { label: 'Status', render: (item) => <StatusBadge value={item.status} /> },
      ]}
      filters={[
        { label: 'All', match: () => true },
        { label: 'Published', match: (item) => item.status === 'published' },
        { label: 'Hidden', match: (item) => item.status !== 'published' },
      ]}
      toggle={{ field: 'status', on: 'published', off: 'hidden', onLabel: 'Publish', offLabel: 'Hide from site' }}
      searchText={(item) => `${item.name} ${item.role} ${item.tags.join(' ')}`}
      viewHref={(item) => (item.status !== 'published' ? null : item.slug === MANAGER_SLUG ? '/about#manager' : `/team/${item.slug}`)}
    />
  )
}
