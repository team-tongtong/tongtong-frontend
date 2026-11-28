import { queryOptions, type QueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/api/client'
import type { OrderStatusFilterValue } from '@/components/filter/orderStatuses'
import type { RoomDetail } from '@/features/rooms/api'
import type { paymentMethodLabels } from '@/components/order/paymentMethods'

export const statusByTab = {
  전체: undefined,
  모집중: 'RECRUITING',
  '모집 완료': 'RECRUIT_COMPLETED',
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
      return '모집 완료'
    case 'ARRIVED':
      return '배달 완료'
    case 'CANCELED':
      return '취소'
  }
}

export function orderListQuery(tab: OrderStatusFilterValue) {
  const status = statusByTab[tab]
  return queryOptions({
    queryKey: ['orders', 'list', status ?? '전체'],
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
    refetchInterval: 20_000,
  })
}

export function cancelOrder(orderId: number) {
  return apiRequest<unknown>(`/api/v1/orders/${orderId}/cancel`, {
    method: 'PATCH',
  })
}

type PickupResult = { orderId: number; orderStatus: 'PICKED_UP' }

export function pickupOrder({
  orderId,
  code,
}: {
  orderId: number
  code: string
}) {
  return apiRequest<PickupResult>(`/api/v1/orders/${orderId}/pickup`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}

export function applyPickupResult(client: QueryClient, result: PickupResult) {
  client.setQueriesData<{ orders: OrderSummary[] }>(
    { queryKey: ['orders', 'list'] },
    (previous) =>
      previous && {
        orders: previous.orders.map((order) =>
          order.orderId === result.orderId ? { ...order, ...result } : order,
        ),
      },
  )
  const detail = orderDetailQuery(String(result.orderId))
  client.setQueryData(
    detail.queryKey,
    (order) => order && { ...order, ...result },
  )
}
