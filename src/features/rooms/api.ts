import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/client'

interface Spot {
  spotId: number
  name: string
  description: string
  mapImageUrl: string | null
}

interface Room {
  roomId: number
  storeName: string
  track: 'INDIVIDUAL' | 'PORTION'
  spotName: string
  currentParticipants: number
  maxParticipants: number
  recruitDeadline: string
}

export interface RoomSummary extends Room {
  storeImageUrl: string | null
  representativeMenuName: string | null
}

export interface RoomDetail extends Room {
  storeId: number
  status: 'RECRUITING' | 'RECRUIT_COMPLETED' | 'ARRIVED' | 'CANCELED'
  minOrderAmount: number
  currentFoodTotal: number
  deliveryFeeShare: number
  portionFee: number
  joinedByMe: boolean
  sharedMenu: {
    menuId: number
    name: string
    price: number
    portionPrice: number
  } | null
}

export const spotListQuery = queryOptions({
  queryKey: ['spots'],
  queryFn: ({ signal }) =>
    apiRequest<{ spots: Spot[] }>('/api/v1/spots', { signal }),
  staleTime: 5 * 60_000,
})

export const roomListQuery = queryOptions({
  queryKey: ['rooms', 'list'],
  queryFn: ({ signal }) =>
    apiRequest<{ rooms: RoomSummary[] }>('/api/v1/rooms', { signal }),
  refetchInterval: 60_000,
})

export function roomDetailQuery(roomId: string) {
  return queryOptions({
    queryKey: ['rooms', 'detail', roomId],
    queryFn: ({ signal }) =>
      apiRequest<RoomDetail>(`/api/v1/rooms/${encodeURIComponent(roomId)}`, {
        signal,
      }),
    refetchInterval: 60_000,
  })
}
