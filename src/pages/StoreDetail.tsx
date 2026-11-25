import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { MenuListItem } from '@/components/search/MenuListItem'
import back from '@/assets/store/back.svg'
import clock from '@/assets/store/clock.svg'
import cart from '@/assets/store/cart.svg'
import pin from '@/assets/store/pin.svg'
import star from '@/assets/store/star.svg'
import emptyStar from '@/assets/store/empty-star.svg'
import { selectRoomMenu, type RoomMenuSelection } from './roomMenuSelection'
import type { GroupOrderDetail } from './sampleGroupOrders'
import styles from './StoreDetail.module.css'

const photos = import.meta.glob<string>('../assets/store/*.png', {
  eager: true,
  import: 'default',
})
const photo = (key: string | undefined) =>
  photos['../assets/store/' + key + '.png']
const won = (amount: number) => amount.toLocaleString('ko-KR') + '원'

type Props = {
  store: GroupOrderDetail
  action: '메뉴 담기' | '모집방 만들기'
  initialMenus?: readonly RoomMenuSelection[]
  onBack: () => void
  onConfirm: (menus: RoomMenuSelection[]) => void
  allowEmpty?: boolean
}

export function StoreDetail({
  store,
  action,
  initialMenus = [],
  onBack,
  onConfirm,
  allowEmpty,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
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
        <button
          type="button"
          className={styles.back}
          aria-label="뒤로가기"
          onClick={onBack}
        >
          <img src={back} alt="" />
        </button>
        <div className={styles.caption}>
          <h1 id="store-name">{details?.name ?? store.name}</h1>
          {details && (
            <span>
              <img src={star} alt="평점" /> {details.rating} (
              {details.reviewCount})
            </span>
          )}
        </div>
      </header>
      {(details ||
        store.minimumOrderAmount != null ||
        store.deliveryFeeTotal != null) && (
        <section className={styles.info} aria-label="매장 정보">
          <div>
            {details && (
              <p>
                <img src={clock} alt="" />
                <strong>영업중</strong> · {details.lastOrder}에 라스트오더
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
                {review.text}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className={styles.section}>
        <h2>메뉴</h2>
        <ul className={styles.menus}>
          {store.menus.map((menu) => (
            <li key={menu.id}>
              <MenuListItem
                name={menu.name}
                price={menu.price}
                description={menu.description ?? ''}
                image={photo(menu.photo) ?? store.image}
                onAdd={() =>
                  setQuantities((current) => ({
                    ...current,
                    [menu.id]: (current[menu.id] ?? 0) + 1,
                  }))
                }
              />
            </li>
          ))}
        </ul>
      </section>
      <footer className={styles.footer}>
        <div aria-live="polite">
          <strong>{won(total)}</strong>
          {action === '메뉴 담기' ? (
            <small>더 먹고 싶은 메뉴를 추가해보세요</small>
          ) : (
            store.minimumOrderAmount != null && (
              <small>
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
