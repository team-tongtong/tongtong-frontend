import addMenu from '@/assets/recruitment/add-menu.svg'
import { SelectedMenuCard } from '@/components/order/SelectedMenuCard'
import type { RoomMenuSelection } from './roomMenuSelection'
import styles from './CreateRoomPage.module.css'

type Props = {
  onOpenSearch: () => void
  selected: RoomMenuSelection[]
  onChange: (menus: RoomMenuSelection[]) => void
}

export function CreateRoomMenu({ selected, onChange, onOpenSearch }: Props) {
  const picker = (
    <button
      type="button"
      className={selected.length ? styles.changeMenu : styles.addMenu}
      aria-label={selected.length ? '메뉴 변경' : '메뉴 담기'}
      onClick={onOpenSearch}
    >
      {!selected.length && <img src={addMenu} alt="" />}
      {selected.length ? '변경' : '메뉴 담기'}
    </button>
  )
  return selected.length ? (
    <SelectedMenuCard
      menus={selected}
      changeControl={picker}
      onQuantityChange={(id, quantity) =>
        onChange(
          selected
            .map((menu) => (menu.menuId === id ? { ...menu, quantity } : menu))
            .filter((menu) => menu.quantity > 0),
        )
      }
    />
  ) : (
    <section aria-label="메뉴 선택" className={styles.emptyMenu}>
      <p>원하는 메뉴를 담아주세요</p>
      {picker}
    </section>
  )
}
