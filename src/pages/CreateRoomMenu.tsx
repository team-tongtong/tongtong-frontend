import addMenu from '@/assets/recruitment/add-menu.svg'
import { SelectedMenuCard } from '@/components/order/SelectedMenuCard'
import type { RoomMenuSelection } from './roomMenuSelection'
import styles from './CreateRoomPage.module.css'

type Props = {
  onOpenSearch: () => void
  selected?: RoomMenuSelection
  onChange: (menu?: RoomMenuSelection) => void
}

export function CreateRoomMenu({ selected, onChange, onOpenSearch }: Props) {
  const picker = (
    <button
      type="button"
      className={selected ? styles.changeMenu : styles.addMenu}
      aria-label={selected ? '메뉴 변경' : '메뉴 담기'}
      onClick={onOpenSearch}
    >
      {!selected && <img src={addMenu} alt="" />}
      {selected ? '변경' : '메뉴 담기'}
    </button>
  )
  return selected ? (
    <SelectedMenuCard
      name={selected.name}
      storeName={selected.storeName}
      unitPrice={selected.price}
      quantity={selected.quantity}
      subtotal={selected.price * selected.quantity}
      changeControl={picker}
      onQuantityChange={(quantity) =>
        onChange(quantity > 0 ? { ...selected, quantity } : undefined)
      }
    />
  ) : (
    <section aria-label="메뉴 선택" className={styles.emptyMenu}>
      <p>원하는 메뉴를 담아주세요</p>
      {picker}
    </section>
  )
}
