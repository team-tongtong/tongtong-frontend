import type { RoomMenuSelection } from './roomMenuSelection'
import styles from './CreateRoomPage.module.css'

function won(value: number) {
  return value.toLocaleString('ko-KR') + '원'
}

// 정수 원으로 나누어지지 않으면 정산 금액을 임의로 반올림하지 않는다.
function share(amount: number | undefined, people: number) {
  return amount != null && amount % people === 0 ? amount / people : undefined
}

function amountForMenu(item: RoomMenuSelection, people: number) {
  const amount = share(item.price * item.quantity, people)
  return amount == null ? '정산 전' : won(amount)
}

export function RoomPaymentSummary({
  menus,
  people,
  shared,
}: {
  menus: RoomMenuSelection[]
  people: number
  shared: boolean
}) {
  const menu = menus[0]
  if (!menu) return null
  const subtotal = menus.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const food = shared ? share(subtotal, people) : subtotal
  const delivery = share(menu.deliveryFeeTotal, people)
  const portion = shared ? menu.portionFeePerPerson : 0
  const total =
    food != null && delivery != null && portion != null
      ? food + delivery + portion
      : undefined
  return (
    <section className={styles.panel} aria-labelledby="payment-summary-title">
      <h2 id="payment-summary-title">내 결제 금액</h2>
      <dl className={styles.amounts}>
        {menus.map((item) => (
          <div key={item.menuId}>
            <dt>
              {item.name}
              {item.quantity > 1 && ` × ${item.quantity}`}
              {shared && ` (${won(item.price * item.quantity)} / ${people}명)`}
            </dt>
            <dd>{amountForMenu(item, shared ? people : 1)}</dd>
          </div>
        ))}
        <div>
          <dt>
            배달비
            {menu.deliveryFeeTotal != null &&
              ` (${won(menu.deliveryFeeTotal)} / ${people}명)`}
          </dt>
          <dd>{delivery == null ? '확인 전' : won(delivery)}</dd>
        </div>
        {shared && (
          <div>
            <dt>소분 수수료</dt>
            <dd>{portion == null ? '확인 전' : won(portion)}</dd>
          </div>
        )}
        <div className={styles.total}>
          <dt>결제 금액</dt>
          <dd>
            {total != null
              ? won(total)
              : menu.deliveryFeeTotal == null
                ? '배달비 확인 후 안내'
                : '정산 금액 확인 후 안내'}
          </dd>
        </div>
      </dl>
    </section>
  )
}
