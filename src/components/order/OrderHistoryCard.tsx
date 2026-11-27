import { Link } from 'react-router'
import { displayStatus, type OrderSummary } from '@/features/orders/api'
import styles from './OrderHistoryCard.module.css'

export function OrderHistoryCard({
  order,
  onEnterCode,
}: {
  order: OrderSummary
  onEnterCode: () => void
}) {
  const status = displayStatus(order)
  const pickupEnabled = status === '배달 완료' && order.orderStatus === 'JOINED'
  return (
    <article className={styles.card}>
      <div className={styles.summary}>
        {order.storeImageUrl && (
          <img className={styles.logo} src={order.storeImageUrl} alt="" />
        )}
        <div className={styles.info}>
          <div className={styles.meta}>
            <time className={styles.time} dateTime={order.orderedAt}>
              {order.orderedAt.slice(0, 10).replaceAll('-', '.')} 주문
            </time>
            <span>{status}</span>
          </div>
          <h2 title={order.storeName}>{order.storeName}</h2>
          <p>{order.spotName}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link
          to={`/orders/${order.orderId}`}
          state={{ fromOrders: true }}
          aria-label={`${order.storeName} 주문 상세 보기`}
        >
          {status === '조리중' ? '배달 현황 보기' : '주문 상세 보기'}
        </Link>
        {status !== '취소' && (
          <button
            className={styles.pickup}
            type="button"
            disabled={!pickupEnabled}
            onClick={onEnterCode}
          >
            {order.orderStatus === 'PICKED_UP' ? '픽업 완료' : '코드 입력하기'}
          </button>
        )}
      </div>
    </article>
  )
}
