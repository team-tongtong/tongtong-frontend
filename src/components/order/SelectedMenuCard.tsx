import type { ReactNode } from 'react'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import styles from './OrderCards.module.css'

type SelectedMenuCardProps = {
  name: string
  storeName: string
  unitPrice: number
  quantity: number
  subtotal: number
  changeControl: ReactNode
  onQuantityChange: (quantity: number) => void
}

export function SelectedMenuCard({
  name,
  storeName,
  unitPrice,
  quantity,
  subtotal,
  changeControl,
  onQuantityChange,
}: SelectedMenuCardProps) {
  return (
    <section aria-label="선택한 메뉴" className={styles.card}>
      <div className={styles.heading}>
        <h2>선택한 메뉴</h2>
        {changeControl}
      </div>
      <div className={styles.row}>
        <div className={styles.menu}>
          <small>{storeName}</small>
          <strong>{name}</strong>
          <span>{unitPrice.toLocaleString('ko-KR')}원</span>
        </div>
        <QuantityCounter
          label={name + ' 수량'}
          value={quantity}
          unit="개"
          onChange={onQuantityChange}
        />
      </div>
      <div className={styles.subtotal}>
        <span>총 금액</span>
        <strong>{subtotal.toLocaleString('ko-KR')}원</strong>
      </div>
    </section>
  )
}
