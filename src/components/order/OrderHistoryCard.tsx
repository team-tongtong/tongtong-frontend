import type { OrderStatusFilterValue } from '@/components/filter/OrderStatusFilter'
import styles from './OrderHistoryCard.module.css'

export type OrderHistoryItem = {
  id: string
  storeName: string
  storeImage?: string
  timeLabel: string
  pickupSpot: string
  status: Exclude<OrderStatusFilterValue, '전체'> | '모집완료'
  canEnterPickupCode: boolean
}

type Props = {
  order: OrderHistoryItem
  onEnterCode: () => void
  onViewDetail?: () => void
  onView?: () => void
}

export function OrderHistoryCard({
  order,
  onEnterCode,
  onView,
  onViewDetail,
}: Props) {
  const showDelivery = order.status === '모집완료' || order.status === '조리중'
  const viewAction = showDelivery ? onView : (onViewDetail ?? onView)
  const pickupEnabled = order.canEnterPickupCode && order.status !== '취소'
  return (
    <article className={styles.card}>
      <div className={styles.summary}>
        {order.storeImage && (
          <img className={styles.logo} src={order.storeImage} alt="" />
        )}
        <div className={styles.info}>
          <div className={styles.meta}>
            <span className={styles.time}>{order.timeLabel}</span>
            <span>{order.status}</span>
          </div>
          <h2 title={order.storeName}>{order.storeName}</h2>
          <p>{order.pickupSpot}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" disabled={!viewAction} onClick={viewAction}>
          {showDelivery ? '배달 현황 보기' : '주문 상세 보기'}
        </button>
        {order.status !== '취소' && (
          <button
            className={styles.pickup}
            type="button"
            disabled={!pickupEnabled}
            onClick={onEnterCode}
          >
            {order.status === '배달 완료' && !pickupEnabled
              ? 'QR 코드 스캔하기'
              : '코드 입력하기'}
          </button>
        )}
      </div>
    </article>
  )
}
