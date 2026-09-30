import Link from 'next/link'
import { BookOpen, BriefcaseBusiness, Gavel, Mail, MessageSquareText, ShieldCheck, Users } from 'lucide-react'
import type { ActivityItem } from '@/components/admin/AdminChrome'
import { timeAgo } from '@/lib/admin-client'

const look: Record<string, { icon: typeof BookOpen; color: string }> = {
  request: { icon: MessageSquareText, color: 'gold' },
  insight: { icon: BookOpen, color: 'navy' },
  team: { icon: Users, color: 'green' },
  testimonial: { icon: ShieldCheck, color: 'purple' },
  practice: { icon: Gavel, color: 'navy' },
  matter: { icon: BriefcaseBusiness, color: 'green' },
  subscriber: { icon: Mail, color: 'gold' },
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (!items.length) return <p className="py-6 text-center text-muted text-[12px]">No activity yet.</p>
  return (
    <div className="activity-list">
      {items.map((item, index) => {
        const { icon: Icon, color } = look[item.kind] ?? look.insight
        return (
          <Link href={item.href} className="activity-item" key={`${item.kind}-${item.at}-${index}`}>
            <div className={`activity-icon activity-${color}`}><Icon size={16} /></div>
            <div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span><small>{timeAgo(item.at)}</small></div>
          </Link>
        )
      })}
    </div>
  )
}
