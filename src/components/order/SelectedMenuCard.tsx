import type { RoomMenuSelection } from '@/pages/roomMenuSelection'
import type { ReactNode } from 'react'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import styles from './OrderCards.module.css'

type SelectedMenuCardProps = {
  menus: readonly RoomMenuSelection[]
  changeControl: ReactNode
  onQuantityChange: (menuId: string, quantity: number) => void
}

export function SelectedMenuCard({
  menus,
  changeControl,
  onQuantityChange,
}: SelectedMenuCardProps) {
  return (
    <section aria-label="선택한 메뉴" className={styles.card}>
      <div className={styles.heading}>
        <h2>선택한 메뉴</h2>
        {changeControl}
      </div>
      {menus.map(({ name, storeName, price, quantity, menuId }) => (
        <div key={menuId} className={styles.row}>
          <div className={styles.menu}>
            <small>{storeName}</small>
            <strong>{name}</strong>
            <span>{price.toLocaleString('ko-KR')}원</span>
          </div>
          <QuantityCounter
            label={name + ' 수량'}
            value={quantity}
            unit="개"
            onChange={(value) => onQuantityChange(menuId, value)}
          />
        </div>
      ))}
      <div className={styles.subtotal}>
        <span>총 금액</span>
        <strong>
          {menus
            .reduce((sum, menu) => sum + menu.price * menu.quantity, 0)
            .toLocaleString('ko-KR')}
          원
        </strong>
      </div>
    </section>
  )
}
