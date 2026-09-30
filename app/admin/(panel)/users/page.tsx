'use client'

import { ResourceManager } from '@/components/admin/ResourceManager'
import { StatusBadge } from '@/components/admin/PageHeader'
import { formatDate, initials } from '@/lib/admin-client'

type AdminUserRow = { id: string; name: string; email: string; role: string; owner: boolean; createdAt: string | null }

const emptyForm = { name: '', email: '', role: 'editor', password: '' }

export default function UsersAdminPage() {
  return (
    <ResourceManager<AdminUserRow>
      endpoint="/api/admin/users"
      eyebrow="SYSTEM"
      title="Team & permissions"
      description="Who can sign in to this admin area. Administrators can do everything; editors manage content, enquiries and matters but not users or site settings."
      singular="user"
      addLabel="Add user"
      emptyForm={emptyForm}
      toForm={(item) => ({ name: item.name, email: item.email, role: item.role, password: '' })}
      // A blank password on edit means "keep the current password".
      toPayload={(form, isNew) => (isNew || form.password ? form : { name: form.name, email: form.email, role: form.role })}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email (used to sign in)', type: 'email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: [{ value: 'editor', label: 'Editor — content, enquiries and matters' }, { value: 'admin', label: 'Administrator — full access' }] },
        { name: 'password', label: 'Password', type: 'password', hint: 'At least 8 characters. When editing, leave blank to keep the current password.' },
      ]}
      columns={[
        { label: 'User', render: (item) => <div className="client-cell"><div className="avatar avatar-gold">{initials(item.name)}</div><div><strong>{item.name}</strong><span className="block muted-cell">{item.email}</span></div></div> },
        { label: 'Role', render: (item) => <StatusBadge value={item.role} label={item.owner ? 'Owner' : item.role === 'admin' ? 'Administrator' : 'Editor'} /> },
        { label: 'Added', render: (item) => <span className="muted-cell">{item.owner ? 'Server settings' : formatDate(item.createdAt)}</span> },
      ]}
      canEdit={(item) => !item.owner}
      searchText={(item) => `${item.name} ${item.email} ${item.role}`}
    />
  )
}
