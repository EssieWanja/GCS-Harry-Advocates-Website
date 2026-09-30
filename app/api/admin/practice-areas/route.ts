import { collectionRoutes } from '@/lib/admin-api'
import { practiceAreaResource } from '@/lib/admin-resources'

export const dynamic = 'force-dynamic'
export const { GET, POST } = collectionRoutes(practiceAreaResource)
