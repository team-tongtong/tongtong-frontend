import { useState } from 'react'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { PaymentMethodsCard } from '@/components/order/PaymentMethodsCard'
import { paymentMethods } from '@/components/order/paymentMethods'
import type { RoomDetail } from '@/features/rooms/api'
import type { MenuStore } from './roomMenuSelection'
import { RecruitDeadline } from '@/components/group-order/RecruitDeadline'
import styles from './GroupOrderDetailPage.module.css'

type Props = {
  room: RoomDetail
  selected: (MenuStore['menus'][number] & { quantity: number })[]
  personalSubtotal: number
  delivery?: number
}

function amount(value: number | undefined | null) {
  return value == null ? '확인 전' : value.toLocaleString('ko-KR') + '원'
}

export function ParticipationConfirmation({
  room,
  selected,
  personalSubtotal,
  delivery,
}: Props) {
  const [payment, setPayment] = useState<string>()
  const [notice, setNotice] = useState('')
  const shared = room.track === 'PORTION'
  const sharedPrice = shared ? room.sharedMenu?.portionPrice : 0
  const portion = shared ? room.portionFee : 0
  const total =
    sharedPrice != null && delivery != null && portion != null
      ? personalSubtotal + sharedPrice + delivery + portion
      : undefined

  return (
    <div className={styles.content}>
      <section className={styles.menu} aria-label="주문 정보">
        <h2 tabIndex={-1} ref={focusTitle}>
          주문 정보
        </h2>
        <div className={styles.row}>
          <span>매장명</span>
          <strong>{room.storeName}</strong>
        </div>
        <div className={styles.row}>
          <span>통통 스팟</span>
          <span>{room.spotName}</span>
        </div>
        <div className={styles.row}>
          <span>최소 주문 금액</span>
          <span>{amount(room.minOrderAmount)}</span>
        </div>
        <div className={styles.row}>
          <span>모집 현황</span>
          <span>
            {room.currentParticipants}/{room.maxParticipants}명
          </span>
        </div>
        <div className={styles.row}>
          <RecruitDeadline value={room.recruitDeadline} />
        </div>
      </section>
      <section className={styles.menu} aria-label="주문 내역">
        <h2>주문 내역</h2>
        {shared && selected.length > 0 && <strong>개별 주문 메뉴</strong>}
        {selected.map((menu) => (
          <div className={styles.row} key={menu.id}>
            <span>
              {menu.name} · {menu.quantity}개
            </span>
            <span>{amount(menu.price * menu.quantity)}</span>
          </div>
        ))}
        {shared && (
          <>
            <strong>함께 나눌 메뉴</strong>
            <div className={styles.row}>
              <span>{room.sharedMenu?.name} · 1인분</span>
              <span>{amount(sharedPrice)}</span>
            </div>
          </>
        )}
        <div className={styles.row}>
          <span>배달비 부담액</span>
          <span>{amount(delivery)}</span>
        </div>
        {shared && (
          <>
            <div className={styles.row}>
              <span>소분 수수료</span>
              <span>{amount(portion)}</span>
            </div>
            {portion != null && (
              <p className={styles.portionNote}>
                *수수료 {amount(portion)}은 개별 용기 제공 및 소분 작업
                비용입니다.
              </p>
            )}
          </>
        )}
        <div className={styles.total}>
          <span>내 결제 금액</span>
          <strong>
            {total != null
              ? amount(total)
              : delivery == null
                ? '배달비 확인 후 안내'
                : '부담 금액 확인 후 안내'}
          </strong>
        </div>
      </section>
      <PaymentMethodsCard
        methods={paymentMethods}
        selected={payment}
        onChange={setPayment}
      />
      <footer className={styles.footer}>
        <PrimaryButton
          disabled={!payment}
          onClick={() => setNotice('참여 확정 기능은 준비 중이에요.')}
        >
          참여 확정하기
        </PrimaryButton>
        <p role="status">{notice}</p>
      </footer>
    </div>
  )
}

function focusTitle(element: HTMLHeadingElement | null) {
  element?.focus()
}
