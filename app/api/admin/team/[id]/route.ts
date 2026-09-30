import { itemRoutes } from '@/lib/admin-api'
import { teamResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(teamResource)
