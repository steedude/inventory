export const inventoryQueryStaleTime = 2 * 60 * 1000
export const inventoryQueryGcTime = 10 * 60 * 1000

export const inventoryQueryKey = {
  categories: (userId: string | null) => ['inventory', userId, 'categories'] as const,
  groups: (userId: string | null) => ['inventory', userId, 'groups'] as const,
  item: (userId: string | null, id: string) => ['inventory', userId, 'items', id] as const,
  items: (userId: string | null) => ['inventory', userId, 'items'] as const,
  locations: (userId: string | null) => ['inventory', userId, 'locations'] as const,
  logs: (userId: string | null) => ['inventory', userId, 'logs'] as const,
}
