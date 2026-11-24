import { useState } from 'react'
import {
  OrderStatusFilter,
  type OrderStatusFilterValue,
} from '@/components/filter/OrderStatusFilter'
import styles from './OrdersPage.module.css'

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatusFilterValue>('전체')
  return (
    <main>
      <header className={styles.header}>
        <h1>주문 내역</h1>
        <OrderStatusFilter value={status} onChange={setStatus} />
      </header>
    </main>
  )
}
