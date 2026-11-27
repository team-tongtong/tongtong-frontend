import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { OrderStatusFilter } from '@/components/filter/OrderStatusFilter'
import { OrderHistoryCard } from '@/components/order/OrderHistoryCard'
import { useQuery } from '@tanstack/react-query'
import { orderListQuery } from '@/features/orders/api'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { PickupCodeDialog } from '@/components/pickup/PickupDialog'
import { readOrderStatus } from '@/components/filter/orderStatuses'
import styles from './OrdersPage.module.css'

export function OrdersPage() {
  const [params, setParams] = useSearchParams()
  const status = readOrderStatus(params.get('status'))
  const [pickupOrderId, setPickupOrderId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const query = useQuery(orderListQuery(status))
  const visibleOrders = query.data ?? []
  const pickupOrder = visibleOrders.find(
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
            setNotice('')
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
                  setNotice('')
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
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}
      {pickupOrder && (
        <PickupCodeDialog
          onDismiss={() => setPickupOrderId(null)}
          onSubmit={() => {
            setPickupOrderId(null)
            setNotice('픽업 코드 확인 기능은 준비 중이에요.')
          }}
        />
      )}
    </main>
  )
}
