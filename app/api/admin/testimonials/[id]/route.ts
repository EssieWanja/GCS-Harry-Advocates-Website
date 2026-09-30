import { itemRoutes } from '@/lib/admin-api'
import { testimonialResource } from '@/lib/admin-resources'

export const { PATCH, DELETE } = itemRoutes(testimonialResource)
