import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/client'

export interface StoreSummary {
  storeId: number
  name: string
  category: string
  imageUrl: string
  rating: number
  reviewCount: number
  orderCount: number
  minOrderAmount: number
  deliveryFee: number
  deliveryMinutes: number
  distanceMeters: number
}

export interface StoreDetailResponse extends Omit<
  StoreSummary,
  'category' | 'orderCount' | 'distanceMeters'
> {
  lastOrderTime: string
  menus: {
    menuId: number
    name: string
    description: string
    price: number
    imageUrl: string
    portionable: boolean
  }[]
  reviews: { nickname: string; rating: number; content: string }[]
}

export const storeListQuery = queryOptions({
  queryKey: ['stores', 'list'],
  queryFn: ({ signal }) =>
    apiRequest<{ stores: StoreSummary[] }>('/api/v1/stores', { signal }),
  staleTime: 5 * 60_000,
})

export function storeDetailQuery(id: string) {
  return queryOptions({
    queryKey: ['stores', 'detail', id],
    queryFn: ({ signal }) =>
      apiRequest<StoreDetailResponse>(
        `/api/v1/stores/${encodeURIComponent(id)}`,
        { signal },
      ),
    staleTime: 5 * 60_000,
  })
}
