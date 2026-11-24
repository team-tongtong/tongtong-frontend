import { orderMethodLabels } from '@/components/group-order/orderMethod'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import blackJjimdak from '@/assets/order/black-jjimdak.png'
import pickupMap from '@/assets/order/pickup-map.png'
import participantIcon from '@/assets/order/participant.svg'
import {
  sampleGroupOrdersQuery,
  type GroupOrderDetail,
} from './sampleGroupOrders'
import styles from './GroupOrderDetailPage.module.css'

const won = (amount: number) => amount.toLocaleString('ko-KR') + '원'

export function GroupOrderDetailPage() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery(sampleGroupOrdersQuery)
  const room = query.data?.find((item) => item.id === roomId)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          aria-label="홈으로 돌아가기"
          onClick={() =>
            location.state?.fromHome
              ? navigate(-1)
              : navigate('/', { replace: true })
          }
        >
          <span aria-hidden="true">‹</span>
        </button>
        <h1>공동 주문 상세</h1>
      </header>
      {query.isPending ? (
        <LoadingSpinner label="모집방을 불러오는 중" />
      ) : query.isError ? (
        <section className={styles.feedback}>
          <p role="alert">모집방 정보를 불러오지 못했어요.</p>
          <button type="button" onClick={() => void query.refetch()}>
            다시 시도
          </button>
        </section>
      ) : room ? (
        <RoomDetails key={room.id} room={room} />
      ) : (
        <section className={styles.feedback}>
          <p>모집방을 찾을 수 없어요.</p>
          <Link to="/" replace>
            홈으로 돌아가기
          </Link>
        </section>
      )}
    </main>
  )
}

function Recruitment({ room }: { room: GroupOrderDetail }) {
  return (
    <section className={styles.card}>
      <div className={styles.store}>
        <img src={room.image} alt="" />
        <div>
          <h2>{room.name}</h2>
          <p>
            <time dateTime={room.orderTime}>{room.orderTime}</time> 주문 예정
          </p>
        </div>
        <span className={styles.tag}>{orderMethodLabels[room.method]}</span>
      </div>
      <div className={styles.recruitment}>
        <h2>모집 현황</h2>
        <div
          className={styles.track}
          role="img"
          aria-label={`정원 ${room.capacity}명 중 ${room.participants}명 참여`}
        >
          {Array.from({ length: room.capacity }, (_, i) => (
            <span
              key={i}
              className={styles.step}
              data-filled={i < room.participants}
              aria-hidden="true"
            >
              {i + 1 === room.participants && (
                <>
                  <img src={participantIcon} alt="" />
                  <b>{room.participants}명 참여</b>
                </>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoomDetails({ room }: { room: GroupOrderDetail }) {
  const shared = room.method === '내 몫 담기'
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const menus = room.menus.map((menu) => ({
    ...menu,
    quantity: quantities[menu.name] ?? 0,
  }))
  const selected = menus.filter((menu) => menu.quantity > 0)
  const total = selected.reduce(
    (sum, menu) => sum + menu.price * menu.quantity,
    0,
  )

  return (
    <div className={styles.content}>
      <Recruitment room={room} />
      {shared && room.sharedMenu && (
        <section className={styles.shared}>
          <div>
            <h2>함께 나눌 메뉴</h2>
            <strong>{room.sharedMenu.name}</strong>
            <p>
              {won(room.sharedMenu.pricePerPerson)} <small>/ 1명</small>
            </p>
          </div>
          {room.sharedMenu.image && <img src={blackJjimdak} alt="" />}
        </section>
      )}
      <section className={styles.menu} aria-label="개인 메뉴">
        {editing ? (
          <>
            <h2>{shared ? '개별 주문 메뉴' : '내 메뉴'}</h2>
            {menus.map((menu) => (
              <div key={menu.name} className={styles.row}>
                <div>
                  <strong>{menu.name}</strong>
                  <p>{won(menu.price)}</p>
                </div>
                <div className={styles.counter}>
                  <button
                    type="button"
                    aria-label={menu.name + ' 수량 줄이기'}
                    disabled={!menu.quantity}
                    onClick={() =>
                      setQuantities((q) => ({
                        ...q,
                        [menu.name]: Math.max(0, (q[menu.name] ?? 0) - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <span>{menu.quantity}개</span>
                  <button
                    type="button"
                    aria-label={menu.name + ' 수량 늘리기'}
                    onClick={() =>
                      setQuantities((q) => ({
                        ...q,
                        [menu.name]: (q[menu.name] || 0) + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setEditing(false)}
            >
              완료
            </button>
          </>
        ) : selected.length ? (
          <>
            <div className={styles.row}>
              <h2>{shared ? '개별 주문 메뉴' : '내 메뉴'}</h2>
              <button
                className={styles.menuButton}
                onClick={() => setEditing(true)}
              >
                변경
              </button>
            </div>
            {selected.map((menu) => (
              <div key={menu.name} className={styles.row}>
                <span>
                  {menu.name} · {menu.quantity}개
                </span>
                <span>{won(menu.price * menu.quantity)}</span>
              </div>
            ))}
            <div className={styles.row}>
              <strong>개인 메뉴 합계</strong>
              <strong>{won(total)}</strong>
            </div>
          </>
        ) : (
          <div className={styles.emptyMenu}>
            <p>
              {shared
                ? '개별 주문할 메뉴를 담아주세요'
                : '원하는 메뉴를 담아주세요'}
            </p>
            <button
              className={styles.menuButton}
              type="button"
              onClick={() => {
                setNotice('')
                setEditing(true)
              }}
            >
              <span aria-hidden="true">＋</span> 메뉴 담기
            </button>
          </div>
        )}
      </section>
      <section className={styles.pickup}>
        <h2>통통 스팟 안내</h2>
        <img src={pickupMap} alt="통통 스팟 예시 지도" />
        <strong>{room.pickupSpot}</strong>
        <p>
          지정 수령 구역에서 픽업 코드 입력 필수
          <br />
          주문 도착 후 15분 내 수령 필수 · 미수령 시 페널티 발생
        </p>
      </section>
      <footer className={styles.footer}>
        <button
          type="button"
          className="tt-button-primary"
          disabled={editing || room.participants >= room.capacity}
          onClick={() => {
            setNotice(
              !shared && !selected.length
                ? '참여하려면 먼저 개인 메뉴를 담아주세요.'
                : '참여 확정 기능은 준비 중이에요.',
            )
          }}
        >
          참여하기
        </button>
        <p role="status">{notice}</p>
      </footer>
    </div>
  )
}
