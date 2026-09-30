import { itemRoutes } from '@/lib/admin-api'
import { practiceAreaResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(practiceAreaResource)
