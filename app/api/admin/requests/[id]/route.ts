import { itemRoutes } from '@/lib/admin-api'
import { requestResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(requestResource)
