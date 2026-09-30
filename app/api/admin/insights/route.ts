import { collectionRoutes } from '@/lib/admin-api'
import { insightResource } from '@/lib/admin-resources'

export const dynamic = 'force-dynamic'
export const { GET, POST } = collectionRoutes(insightResource)
