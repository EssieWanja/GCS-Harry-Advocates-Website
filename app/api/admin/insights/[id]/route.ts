import { itemRoutes } from '@/lib/admin-api'
import { insightResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(insightResource)
