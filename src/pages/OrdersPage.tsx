import { useState } from 'react'
import {
  OrderStatusFilter,
  type OrderStatusFilterValue,
} from '@/components/filter/OrderStatusFilter'
import {
  OrderHistoryCard,
  type OrderHistoryItem,
} from '@/components/order/OrderHistoryCard'
import { PickupCodeDialog } from '@/components/pickup/PickupDialog'
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
  const [status, setStatus] = useState<OrderStatusFilterValue>('전체')
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
            setStatus(next)
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
                onView={onViewOrder && (() => onViewOrder(order))}
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
