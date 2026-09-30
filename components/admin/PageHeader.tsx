export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="subheading">{description}</p>}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}

const tones: Record<string, string> = {
  published: 'status-green', approved: 'status-green', confirmed: 'status-green', open: 'status-green', admin: 'status-navy',
  draft: 'status-gold', pending: 'status-gold', new: 'status-gold', 'on-hold': 'status-gold', editor: 'status-blue',
  hidden: 'status-muted', closed: 'status-muted', completed: 'status-blue', cancelled: 'status-red',
}

export function StatusBadge({ value, label }: { value: string; label?: string }) {
  return <span className={`status ${tones[value] ?? 'status-blue'}`}><i />{label ?? value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}</span>
}
