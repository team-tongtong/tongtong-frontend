import { BackButton } from '@/components/layout/BackButton'
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import { MenuListItem } from '@/components/search/MenuListItem'
import clock from '@/assets/store/clock.svg'
import cart from '@/assets/store/cart.svg'
import pin from '@/assets/store/pin.svg'
import star from '@/assets/store/star.svg'
import emptyStar from '@/assets/store/empty-star.svg'
import {
  selectRoomMenu,
  type RoomMenuSelection,
  type MenuStore,
} from './roomMenuSelection'
import styles from './StoreDetail.module.css'

const photos = import.meta.glob<string>('../assets/store/*.png', {
  eager: true,
  import: 'default',
})
const photo = (key: string | undefined) =>
  photos['../assets/store/' + key + '.png']
const won = (amount: number) => amount.toLocaleString('ko-KR') + '원'

type Props = {
  store: MenuStore
  action: '메뉴 담기' | '모집방 만들기'
  initialMenus?: readonly RoomMenuSelection[]
  onBack: () => void
  onConfirm: (menus: RoomMenuSelection[]) => void
  menuMode?: 'shared' | 'individual'
  allowEmpty?: boolean
}

export function StoreDetail({
  store,
  action,
  initialMenus = [],
  onBack,
  onConfirm,
  allowEmpty,
  menuMode,
}: Props) {
  const sharedPicker = menuMode === 'shared'
  const dialog = useRef<HTMLDialogElement>(null)
  const storeName = useRef<HTMLHeadingElement>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      initialMenus
        .filter((item) => item.storeId === store.id)
        .map((item) => [item.menuId, item.quantity]),
    ),
  )
  useLayoutEffect(() => {
    const element = dialog.current!
    element.showModal()
    storeName.current?.focus({ preventScroll: true })
    return () => element.close()
  }, [])
  const details = store.storeDetails
  const selected = store.menus
    .filter((menu) => (quantities[menu.id] ?? 0) > 0)
    .map((menu) => ({
      ...selectRoomMenu(store, menu),
      quantity: quantities[menu.id] ?? 0,
    }))
  const total = selected.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const remaining = (store.minimumOrderAmount ?? 0) - total
  return createPortal(
    <dialog
      className={styles.page}
      ref={dialog}
      aria-labelledby="store-name"
      onCancel={(event) => {
        event.preventDefault()
        onBack()
      }}
    >
      <header className={styles.hero}>
        <img
          className={styles.cover}
          src={photo(details?.hero) ?? store.image}
          alt=""
        />
        <div className={styles.caption}>
          <h1 id="store-name" tabIndex={-1} ref={storeName}>
            {details?.name ?? store.name}
          </h1>
          {details && (
            <span>
              <img src={star} alt="평점" /> {details.rating} (
              {details.reviewCount})
            </span>
          )}
        </div>
        <BackButton onClick={onBack} onPhoto />
      </header>
      {(details ||
        store.minimumOrderAmount != null ||
        store.deliveryFeeTotal != null) && (
        <section className={styles.info} aria-label="매장 정보">
          <div>
            {details && (
              <p>
                <img src={clock} alt="" />
                라스트오더 {details.lastOrder}
              </p>
            )}
            {store.minimumOrderAmount != null && (
              <p>
                <img src={cart} alt="" />
                최소주문 {won(store.minimumOrderAmount)}
              </p>
            )}
            {store.deliveryFeeTotal != null && (
              <p>
                <img src={pin} alt="" />
                {details &&
                  '약 ' + details.deliveryMinutes + '분 | '}배달비{' '}
                {won(store.deliveryFeeTotal)}
              </p>
            )}
          </div>
        </section>
      )}
      {details && (
        <section className={styles.section}>
          <h2>리뷰</h2>
          {!details.reviews.length && <p>등록된 리뷰가 없어요.</p>}
          <ul className={styles.reviews}>
            {details.reviews.map((review, i) => (
              <li key={i}>
                <div aria-label={review.stars + '점'}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <img
                      key={index}
                      src={index < review.stars ? star : emptyStar}
                      alt=""
                    />
                  ))}
                </div>
                <span className={styles.reviewText}>{review.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className={styles.section}>
        <h2>{sharedPicker ? '함께 나눌 메뉴' : '메뉴'}</h2>
        {!store.menus.length && <p>등록된 메뉴가 없어요.</p>}
        <ul className={styles.menus}>
          {store.menus.map((menu) => (
            <li key={menu.id}>
              <MenuListItem
                name={menu.name}
                price={menu.price}
                description={menu.description ?? ''}
                image={menu.imageUrl || photo(menu.photo) || store.image}
                selected={sharedPicker ? !!quantities[menu.id] : undefined}
                disabled={
                  sharedPicker &&
                  (!menu.portionable ||
                    (selected.length > 0 && !quantities[menu.id]))
                }
                onAdd={() =>
                  setQuantities((current) => {
                    if (sharedPicker)
                      return current[menu.id] ? {} : { [menu.id]: 1 }
                    return {
                      ...current,
                      [menu.id]: (current[menu.id] ?? 0) + 1,
                    }
                  })
                }
              />
              {menuMode === 'individual' && !!quantities[menu.id] && (
                <QuantityCounter
                  label={menu.name + ' 수량'}
                  value={quantities[menu.id] ?? 0}
                  unit="개"
                  onChange={(quantity) =>
                    setQuantities((current) => ({
                      ...current,
                      [menu.id]: quantity,
                    }))
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </section>
      <footer className={styles.footer}>
        <div aria-live="polite">
          <strong>{won(total)}</strong>
          {action === '메뉴 담기' ? (
            <small>
              {sharedPicker
                ? '함께 나눌 메뉴는 1개만 선택할 수 있어요'
                : '더 먹고 싶은 메뉴를 추가해보세요'}
            </small>
          ) : (
            store.minimumOrderAmount != null && (
              <small className={styles.minimumOrderHint}>
                {remaining > 0
                  ? '부족한 ' + won(remaining) + ', 함께 채워볼까요?'
                  : '최소주문금액을 다 채웠어요!'}
              </small>
            )
          )}
        </div>
        <PrimaryButton
          disabled={!selected.length && !allowEmpty}
          onClick={() => onConfirm(selected)}
        >
          {action}
        </PrimaryButton>
      </footer>
    </dialog>,
    document.body,
  )
}
