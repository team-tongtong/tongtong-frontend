import { BackButton } from '@/components/layout/BackButton'
import { useLocation, useNavigate, useParams } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader'
import { useQuery } from '@tanstack/react-query'
import { displayStatus, orderDetailQuery } from '@/features/orders/api'
import { ApiError } from '@/api/client'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { RecruitDeadline } from '@/components/group-order/RecruitDeadline'
import { trackLabels } from '@/components/group-order/orderMethod'
import { paymentMethodLabels } from '@/components/order/paymentMethods'
import cat from '@/assets/order/recruitment-cat.png'
import styles from './OrderDetailPage.module.css'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const query = useQuery(orderDetailQuery(orderId ?? ''))
  const missing = query.error instanceof ApiError && query.error.status === 404
  const order = missing ? undefined : query.data
  const back = () =>
    state?.fromOrders ? navigate(-1) : navigate('/orders', { replace: true })
  if (!order)
    return (
      <main>
        <AppHeader title="주문 상세" onBack={back} />
        {query.isPending ? (
          <LoadingSpinner label="주문 상세를 불러오는 중" />
        ) : missing ? (
          <p>주문을 찾을 수 없어요.</p>
        ) : (
          <section>
            <p role="alert">주문 상세를 불러오지 못했어요.</p>
            <button type="button" onClick={() => void query.refetch()}>
              다시 시도
            </button>
          </section>
        )}
      </main>
    )

  const current = displayStatus(order)
  const steps = [
    '모집중',
    current === '조리중' ? '조리중' : '모집 완료',
    '배달 완료',
  ]
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BackButton label="주문 내역으로 돌아가기" onClick={back} />
        <span className={styles.time}>
          <RecruitDeadline value={order.recruitDeadline} />
        </span>
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
            <span>{order.spotName}</span>
          </div>

          <div className={styles.row}>
            <span>모집 방식</span>
            <span>{trackLabels[order.track]}</span>
          </div>

          <div className={styles.row}>
            <span>모집 현황</span>
            <span>
              {order.currentParticipants}/{order.maxParticipants}명
            </span>
          </div>
          <div className={styles.row}>
            <span>주문 메뉴</span>
            <ul>
              {order.items.map((m, i) => (
                <li key={i}>
                  {m.name}
                  {m.shared && ' (1인분)'} · {m.quantity}개
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.row}>
            <span>결제 금액</span>
            <span>{order.totalAmount.toLocaleString('ko-KR')}원</span>
          </div>

          <div className={styles.row}>
            <span>결제 방식</span>
            <span>{paymentMethodLabels[order.paymentMethod]}</span>
          </div>
          {order.cancelable && (
            <button type="button" className={styles.cancel} disabled>
              취소하기
            </button>
          )}
        </section>
      </div>
    </main>
  )
}
