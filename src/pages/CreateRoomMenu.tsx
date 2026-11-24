import { useQuery } from '@tanstack/react-query'
import addMenu from '@/assets/recruitment/add-menu.svg'
import { SelectedMenuCard } from '@/components/order/SelectedMenuCard'
import { sampleGroupOrdersQuery } from './sampleGroupOrders'
import styles from './CreateRoomPage.module.css'

export type RoomMenuSelection = {
  storeId: string
  storeName: string
  name: string
  price: number
  minimumOrderAmount?: number | null
  quantity: number
}

type Props = {
  selected?: RoomMenuSelection
  onChange: (menu?: RoomMenuSelection) => void
}

export function CreateRoomMenu({ selected, onChange }: Props) {
  const query = useQuery(sampleGroupOrdersQuery)
  const options = (query.data ?? []).map((room) => ({
    id: room.id,
    name: room.name,
    menus: room.menus.map((menu) => ({
      ...menu,
      storeId: room.id,
      storeName: room.name,
      minimumOrderAmount: room.minimumOrderAmount,
      quantity: 1,
    })),
  }))
  const keyOf = (item: RoomMenuSelection) =>
    JSON.stringify([item.storeId, item.name])
  const picker = (
    <label className={selected ? styles.changeMenu : styles.addMenu}>
      {!selected && <img src={addMenu} alt="" />}
      {selected ? '변경' : '메뉴 담기'}
      <select
        aria-label={selected ? '메뉴 변경' : '메뉴 담기'}
        value={selected ? keyOf(selected) : ''}
        disabled={!options.some((store) => store.menus.length > 0)}
        onChange={(event) => {
          const item = options
            .flatMap((store) => store.menus)
            .find((menu) => keyOf(menu) === event.target.value)
          if (item) onChange(item)
        }}
      >
        <option disabled value="">
          메뉴를 선택해주세요
        </option>
        {options.map((store) => (
          <optgroup key={store.id} label={store.name}>
            {store.menus.map((menu) => (
              <option key={menu.name} value={keyOf(menu)}>
                {menu.name} · {menu.price.toLocaleString('ko-KR')}원
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
  return (
    <>
      {selected ? (
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
      )}
      {query.isError && (
        <button type="button" onClick={() => void query.refetch()}>
          메뉴 다시 불러오기
        </button>
      )}
    </>
  )
}
