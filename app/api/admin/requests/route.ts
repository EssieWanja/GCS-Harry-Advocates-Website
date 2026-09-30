import { collectionRoutes } from '@/lib/admin-api'
import { requestResource } from '@/lib/admin-resources'

export const dynamic = 'force-dynamic'
export const { GET } = collectionRoutes(requestResource)
