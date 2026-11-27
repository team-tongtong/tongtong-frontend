import type { RoomMenuSelection } from './roomMenuSelection'
import { splitRoomCost } from './roomShare'
import styles from './CreateRoomPage.module.css'

const portionFeePerPerson = 500

function won(value: number) {
  return value.toLocaleString('ko-KR') + '원'
}

export function RoomPaymentSummary({
  menus,
  people,
  shared,
  individualMenus,
}: {
  menus: RoomMenuSelection[]
  people: number
  shared: boolean
  individualMenus: RoomMenuSelection[]
}) {
  const menu = menus[0]
  if (!menu) return null
  const personal = shared ? individualMenus : menus
  const personalTotal = personal.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const delivery = menu.deliveryFeeTotal
  const share =
    delivery == null
      ? undefined
      : splitRoomCost(shared ? menu.price : 0, delivery, people)
  const fee = shared ? portionFeePerPerson : 0
  const total = share ? share.perPerson + personalTotal + fee : undefined
  return (
    <section className={styles.panel} aria-labelledby="payment-summary-title">
      <h2 id="payment-summary-title">내 결제 금액</h2>
      <dl className={styles.amounts}>
        {personal.map((item) => (
          <div key={item.menuId}>
            <dt>
              {item.name}
              {item.quantity > 1 && ` × ${item.quantity}`}
            </dt>
            <dd>{won(item.price * item.quantity)}</dd>
          </div>
        ))}
        <div>
          <dt>
            {shared ? '함께 나눌 메뉴 · ' + menu.name + ' + 배달비' : '배달비'}
            {shared && delivery != null && (
              <small className={styles.formula}>
                {won(menu.price)} ÷ {people}명 + {won(delivery)} ÷ {people}명
                (각각 원 단위 내림)
              </small>
            )}
          </dt>
          <dd>{share ? won(share.perPerson) : '배달비 확인 전'}</dd>
        </div>
        {!!share?.coveredByTongtong && (
          <div>
            <dt>통통이 부담하는 잔액 (방 전체)</dt>
            <dd>{won(share.coveredByTongtong)}</dd>
          </div>
        )}
        {shared && (
          <div>
            <dt>소분 수수료</dt>
            <dd>{won(fee)}</dd>
          </div>
        )}
        <div className={styles.total}>
          <dt>결제 금액</dt>
          <dd>{total == null ? '정산 금액 확인 후 안내' : won(total)}</dd>
        </div>
      </dl>
    </section>
  )
}
