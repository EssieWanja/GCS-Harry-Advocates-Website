import { itemRoutes } from '@/lib/admin-api'
import { matterResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(matterResource)
