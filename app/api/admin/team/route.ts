import { collectionRoutes } from '@/lib/admin-api'
import { teamResource } from '@/lib/admin-resources'

export const dynamic = 'force-dynamic'
export const { GET, POST } = collectionRoutes(teamResource)
