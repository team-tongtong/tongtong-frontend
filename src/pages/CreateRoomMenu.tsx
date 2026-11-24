import { useQuery } from '@tanstack/react-query'
import addMenu from '@/assets/recruitment/add-menu.svg'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import { sampleGroupOrdersQuery } from './sampleGroupOrders'
import styles from './CreateRoomPage.module.css'

export type RoomMenuSelection = {
  storeId: string
  storeName: string
  name: string
  price: number
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
    <section
      aria-label="메뉴 선택"
      className={selected ? styles.panel : styles.emptyMenu}
    >
      {selected ? (
        <>
          <div className={styles.menuRow}>
            <h2>선택한 메뉴</h2>
            {picker}
          </div>
          <div className={styles.menuRow}>
            <div className={styles.menuCopy}>
              <small>{selected.storeName}</small>
              <strong>{selected.name}</strong>
              <span>{selected.price.toLocaleString('ko-KR')}원</span>
            </div>
            <QuantityCounter
              label={selected.name + ' 수량'}
              value={selected.quantity}
              unit="개"
              onChange={(quantity) =>
                onChange(quantity > 0 ? { ...selected, quantity } : undefined)
              }
            />
          </div>
          <div className={styles.menuTotal}>
            <span>총 금액</span>
            <strong>
              {(selected.price * selected.quantity).toLocaleString('ko-KR')}원
            </strong>
          </div>
        </>
      ) : (
        <>
          <p>원하는 메뉴를 담아주세요</p>
          {picker}
        </>
      )}
      {query.isError && (
        <button type="button" onClick={() => void query.refetch()}>
          메뉴 다시 불러오기
        </button>
      )}
    </section>
  )
}
