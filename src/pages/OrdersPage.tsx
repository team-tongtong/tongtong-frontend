import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { OrderStatusFilter } from '@/components/filter/OrderStatusFilter'
import { OrderHistoryCard } from '@/components/order/OrderHistoryCard'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  applyPickupResult,
  orderListQuery,
  pickupOrder,
} from '@/features/orders/api'
import { ApiError } from '@/api/client'
import { useToast } from '@/components/toast/useToast'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import {
  PickupCodeDialog,
  PickupSuccessDialog,
} from '@/components/pickup/PickupDialog'
import { readOrderStatus } from '@/components/filter/orderStatuses'
import styles from './OrdersPage.module.css'

export function OrdersPage() {
  const [params, setParams] = useSearchParams()
  const status = readOrderStatus(params.get('status'))
  const [pickupOrderId, setPickupOrderId] = useState<number | null>(null)
  const client = useQueryClient()
  const showToast = useToast()
  const pickupKey = ['orders', 'pickup', pickupOrderId]
  const pickup = useMutation({
    mutationKey: pickupKey,
    mutationFn: pickupOrder,
    networkMode: 'always',
    onSuccess: (result) => applyPickupResult(client, result),
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        showToast(error.message, 'error')
      }
    },
    onSettled: (_result, error, { orderId }) => {
      if (error instanceof ApiError && error.code === 'INVALID_PICKUP_CODE')
        return
      void client.invalidateQueries({ queryKey: ['orders', 'list'] })
      void client.invalidateQueries({
        queryKey: ['orders', 'detail', String(orderId)],
      })
    },
  })
  const query = useQuery(orderListQuery(status))
  const visibleOrders = query.data ?? []
  const selectedOrder = visibleOrders.find(
    (order) =>
      order.orderId === pickupOrderId &&
      order.status === 'ARRIVED' &&
      order.orderStatus === 'JOINED',
  )

  return (
    <main>
      <header className={styles.header}>
        <h1>주문 내역</h1>
        <OrderStatusFilter
          value={status}
          onChange={(next) => {
            setParams(
              (previous) => {
                const updated = new URLSearchParams(previous)
                if (next === '전체') updated.delete('status')
                else updated.set('status', next)
                return updated
              },
              { replace: true },
            )
            setPickupOrderId(null)
            pickup.reset()
          }}
        />
      </header>
      {query.isPending ? (
        <div className={styles.empty}>
          <LoadingSpinner label="주문 내역을 불러오는 중" />
        </div>
      ) : query.isError && !query.data ? (
        <div className={styles.empty}>
          <p role="alert">주문 내역을 불러오지 못했어요.</p>
          <button type="button" onClick={() => void query.refetch()}>
            다시 시도
          </button>
        </div>
      ) : visibleOrders.length ? (
        <ul className={styles.list} aria-label="주문 목록">
          {visibleOrders.map((order) => (
            <li key={order.orderId}>
              <OrderHistoryCard
                order={order}
                onEnterCode={() => {
                  setPickupOrderId(order.orderId)
                  pickup.reset()
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty} role="status">
          {status === '전체'
            ? '아직 주문 내역이 없어요.'
            : '해당 상태의 주문이 없어요.'}
        </p>
      )}
      {pickup.isSuccess ? (
        <PickupSuccessDialog
          onDismiss={() => {
            setPickupOrderId(null)
            pickup.reset()
          }}
        />
      ) : (
        selectedOrder && (
          <PickupCodeDialog
            pending={pickup.isPending}
            error={
              pickup.error &&
              (pickup.error instanceof ApiError
                ? pickup.error.message
                : '픽업 코드를 확인하지 못했어요. 다시 시도해 주세요.')
            }
            onDismiss={() => setPickupOrderId(null)}
            onSubmit={(code) => {
              if (client.isMutating({ mutationKey: pickupKey })) return
              pickup.mutate({ orderId: selectedOrder.orderId, code })
            }}
          />
        )
      )}
    </main>
  )
}
