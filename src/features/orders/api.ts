import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/client'
import type { OrderStatusFilterValue } from '@/components/filter/orderStatuses'
import type { RoomDetail } from '@/features/rooms/api'
import type { paymentMethodLabels } from '@/components/order/paymentMethods'

export const statusByTab = {
  전체: undefined,
  모집중: 'RECRUITING',
  조리중: 'RECRUIT_COMPLETED',
  '배달 완료': 'ARRIVED',
  취소: 'CANCELED',
} as const satisfies Record<
  OrderStatusFilterValue,
  RoomDetail['status'] | undefined
>

interface Order {
  orderId: number
  roomId: number
  storeName: string
  spotName: string
  track: RoomDetail['track']
  status: RoomDetail['status']
  orderStatus: 'JOINED' | 'PICKED_UP' | 'CANCELED'
  recruitDeadline: string
}

export interface OrderSummary extends Order {
  storeImageUrl: string | null
  orderedAt: string
}

export interface OrderDetail extends Order {
  currentParticipants: number
  maxParticipants: number
  items: { name: string; quantity: number; shared: boolean }[]
  totalAmount: number
  paymentMethod: keyof typeof paymentMethodLabels
  cancelable: boolean
}

export function displayStatus(order: Pick<Order, 'status' | 'orderStatus'>) {
  if (order.orderStatus === 'CANCELED') return '취소'
  switch (order.status) {
    case 'RECRUITING':
      return '모집중'
    case 'RECRUIT_COMPLETED':
      return '조리중'
    case 'ARRIVED':
      return '배달 완료'
    case 'CANCELED':
      return '취소'
  }
}

export function orderListQuery(tab: OrderStatusFilterValue) {
  const status = statusByTab[tab]
  return queryOptions({
    queryKey: ['orders', 'list', tab],
    queryFn: ({ signal }) =>
      apiRequest<{ orders: OrderSummary[] }>(
        status ? `/api/v1/orders?status=${status}` : '/api/v1/orders',
        { signal },
      ),
    select: ({ orders }) =>
      tab === '전체'
        ? orders
        : orders.filter((order) => displayStatus(order) === tab),
  })
}

export function orderDetailQuery(orderId: string) {
  return queryOptions({
    queryKey: ['orders', 'detail', orderId],
    queryFn: ({ signal }) =>
      apiRequest<OrderDetail>(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
        signal,
      }),
  })
}
