import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { OrderStatusFilter } from '@/components/filter/OrderStatusFilter'
import {
  OrderHistoryCard,
  type OrderHistoryItem,
} from '@/components/order/OrderHistoryCard'
import { PickupCodeDialog } from '@/components/pickup/PickupDialog'
import { readOrderStatus } from '@/components/filter/orderStatuses'
import styles from './OrdersPage.module.css'

type OrdersPageProps = {
  orders?: readonly OrderHistoryItem[]
  onSubmitPickupCode?: (orderId: string, code: string) => void
  onViewOrder?: (order: OrderHistoryItem) => void
}

export function OrdersPage({
  orders = [],
  onSubmitPickupCode,
  onViewOrder,
}: OrdersPageProps) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const status = readOrderStatus(params.get('status'))
  const [pickupOrderId, setPickupOrderId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const visibleOrders =
    status === '전체'
      ? orders
      : orders.filter((order) => order.status === status)
  const pickupOrder = visibleOrders.find(
    (order) =>
      order.id === pickupOrderId &&
      order.canEnterPickupCode &&
      order.status !== '취소',
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
      {visibleOrders.length ? (
        <ul className={styles.list} aria-label="주문 목록">
          {visibleOrders.map((order) => (
            <li key={order.id}>
              <OrderHistoryCard
                order={order}
                onView={onViewOrder ? () => onViewOrder(order) : undefined}
                onViewDetail={() => {
                  if (onViewOrder) onViewOrder(order)
                  else
                    navigate('/orders/' + encodeURIComponent(order.id), {
                      state: { fromOrders: true },
                    })
                }}
                onEnterCode={() => {
                  setPickupOrderId(order.id)
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
          onSubmit={(code) => {
            setPickupOrderId(null)
            if (onSubmitPickupCode) onSubmitPickupCode(pickupOrder.id, code)
            else setNotice('픽업 코드 확인 기능은 준비 중이에요.')
          }}
        />
      )}
    </main>
  )
}
