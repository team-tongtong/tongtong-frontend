import { BackButton } from '@/components/layout/BackButton'
import { useLocation, useNavigate, useParams } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader'
import type { OrderHistoryItem } from '@/components/order/OrderHistoryCard'
import cat from '@/assets/order/recruitment-cat.png'
import styles from './OrderDetailPage.module.css'

export type OrderDetail = OrderHistoryItem & {
  menus: { name: string; quantity: number }[]
  menuAmount: number | null
  deliveryFee: number | null
  portionFee?: number
  paymentAmount: number | null
  method?: string
  recruitment?: string
  paymentMethod?: string
}

function won(value: number | null) {
  return value == null ? '확인 전' : value.toLocaleString('ko-KR') + '원'
}

export function OrderDetailPage({
  orders,
}: {
  orders: readonly OrderDetail[]
}) {
  const { orderId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = orders.find((item) => item.id === orderId)
  const back = () =>
    state?.fromOrders ? navigate(-1) : navigate('/orders', { replace: true })
  if (!order)
    return (
      <main>
        <AppHeader title="주문 상세" onBack={back} />
        <p>주문을 찾을 수 없어요.</p>
      </main>
    )

  const steps = [
    '모집중',
    order.status === '조리중' ? '조리중' : '모집 완료',
    '배달 완료',
  ]
  const current = order.status === '모집완료' ? '모집 완료' : order.status
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BackButton label="주문 내역으로 돌아가기" onClick={back} />
        <span className={styles.time}>{order.timeLabel}</span>
        <h1>{order.storeName}</h1>
        {current === '취소' ? (
          <p>취소</p>
        ) : (
          <ol className={styles.progress} aria-label="주문 상태">
            {steps.map((step) => (
              <li
                key={step}
                aria-current={step === current ? 'step' : undefined}
              >
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
      </header>
      <div className={styles.body}>
        <img className={styles.cat} src={cat} alt="" />
        <section className={styles.card} aria-label="주문 내역">
          <h2>주문 내역</h2>
          <div className={styles.row}>
            <span>매장명</span>
            <span>{order.storeName}</span>
          </div>
          <div className={styles.row}>
            <span>통통 스팟</span>
            <span>{order.pickupSpot}</span>
          </div>
          {order.method && (
            <div className={styles.row}>
              <span>모집 방식</span>
              <span>{order.method}</span>
            </div>
          )}
          {order.recruitment && (
            <div className={styles.row}>
              <span>모집 현황</span>
              <span>{order.recruitment}</span>
            </div>
          )}
          <div className={styles.row}>
            <span>주문 메뉴</span>
            <ul>
              {order.menus.map((m, i) => (
                <li key={i}>
                  {m.name} · {m.quantity}개
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.row}>
            <span>결제 금액</span>
            <span>{won(order.paymentAmount)}</span>
          </div>
          {order.paymentMethod && (
            <div className={styles.row}>
              <span>결제 방식</span>
              <span>{order.paymentMethod}</span>
            </div>
          )}
          {current === '모집중' && (
            <button type="button" className={styles.cancel} disabled>
              취소하기
            </button>
          )}
        </section>
      </div>
    </main>
  )
}
