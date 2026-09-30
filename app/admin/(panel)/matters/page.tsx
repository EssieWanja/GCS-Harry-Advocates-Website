'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import { formatDate } from '@/lib/admin-client'
import type { Matter } from '@/lib/schema'

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', clientName: '', practiceArea: '', responsible: '', status: 'open', openedAt: '', notes: '' }

export default function MattersAdminPage() {
  return (
    <ResourceManager<Matter>
      endpoint="/api/admin/matters"
      eyebrow="WORKSPACE"
      title="Matters"
      description="Track the firm's active client matters. This list is private to the admin and never shown on the website."
      singular="matter"
      addLabel="Open a matter"
      emptyForm={emptyForm}
      toForm={(item) => ({ title: item.title, clientName: item.clientName, practiceArea: item.practiceArea ?? '', responsible: item.responsible ?? '', status: item.status, openedAt: new Date(item.openedAt).toISOString().slice(0, 10), notes: item.notes ?? '' })}
      toPayload={(form) => ({ ...form, openedAt: form.openedAt || today() })}
      fields={[
        { name: 'title', label: 'Matter title', required: true, full: true, placeholder: 'e.g. Sale of LR No. 209/1234' },
        { name: 'clientName', label: 'Client', required: true },
        { name: 'practiceArea', label: 'Practice area' },
        { name: 'responsible', label: 'Responsible advocate' },
        { name: 'openedAt', label: 'Date opened', type: 'date', hint: 'Defaults to today.' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'open', label: 'Open' }, { value: 'on-hold', label: 'On hold' }, { value: 'closed', label: 'Closed' }] },
        { name: 'notes', label: 'Notes', type: 'textarea', rows: 6 },
      ]}
      columns={[
        { label: 'Matter', render: (item) => <div className="max-w-sm"><strong className="text-navy text-[13px]">{item.title}</strong><span className="block muted-cell mt-0.5">{item.clientName}</span></div> },
        { label: 'Practice area', render: (item) => <span className="muted-cell">{item.practiceArea ?? '—'}</span> },
        { label: 'Responsible', render: (item) => <span className="muted-cell">{item.responsible ?? '—'}</span> },
        { label: 'Opened', render: (item) => <span className="muted-cell">{formatDate(item.openedAt)}</span> },
        { label: 'Status', render: (item) => <StatusBadge value={item.status} /> },
      ]}
      filters={[
        { label: 'Open', match: (item) => item.status === 'open' },
        { label: 'On hold', match: (item) => item.status === 'on-hold' },
        { label: 'Closed', match: (item) => item.status === 'closed' },
        { label: 'All', match: () => true },
      ]}
      searchText={(item) => `${item.title} ${item.clientName} ${item.practiceArea ?? ''} ${item.responsible ?? ''} ${item.notes ?? ''}`}
    />
  )
}
