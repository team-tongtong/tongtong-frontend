import type { RoomMenuSelection } from '@/pages/roomMenuSelection'
import type { ReactNode } from 'react'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import styles from './OrderCards.module.css'

type SelectedMenuCardProps = {
  menus: readonly RoomMenuSelection[]
  title?: string
  maxQuantity?: number
  changeControl: ReactNode
  onQuantityChange: (menuId: string, quantity: number) => void
}

export function SelectedMenuCard({
  menus,
  title = '선택한 메뉴',
  maxQuantity,
  changeControl,
  onQuantityChange,
}: SelectedMenuCardProps) {
  return (
    <section aria-label={title} className={styles.card}>
      <div className={styles.heading}>
        <h2>{title}</h2>
        {changeControl}
      </div>
      <p className={styles.storeName}>{menus[0]?.storeName}</p>
      {menus.map(({ name, price, quantity, menuId }) => (
        <div key={menuId} className={styles.row}>
          <strong className={styles.menuName}>{name}</strong>
          <QuantityCounter
            label={name + ' 수량'}
            value={quantity}
            unit="개"
            max={maxQuantity}
            onChange={(value) => onQuantityChange(menuId, value)}
          />
          <span className={styles.price}>
            {price.toLocaleString('ko-KR')}원
          </span>
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
