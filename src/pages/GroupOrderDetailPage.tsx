import { trackLabels } from '@/components/group-order/orderMethod'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { QuantityCounter } from '@/components/quantity/QuantityCounter'
import { StoreDetail } from './StoreDetail'
import { toMenuStore, selectRoomMenu } from './roomMenuSelection'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import participantIcon from '@/assets/order/participant.svg'
import {
  joinRoom,
  refreshRoomsAndOrders,
  roomDetailQuery,
  spotListQuery,
  type RoomDetail,
} from '@/features/rooms/api'
import { storeDetailQuery } from '@/features/stores/api'
import type { PaymentMethod } from '@/components/order/paymentMethods'
import { useToast } from '@/components/toast/useToast'
import { ApiError } from '@/api/client'
import { RecruitDeadline } from '@/components/group-order/RecruitDeadline'
import { ParticipationConfirmation } from './ParticipationConfirmation'
import styles from './GroupOrderDetailPage.module.css'

const won = (amount: number) => amount.toLocaleString('ko-KR') + '원'

export function GroupOrderDetailPage() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const query = useQuery(roomDetailQuery(roomId ?? ''))
  const missing = query.error instanceof ApiError && query.error.status === 404
  const room = missing ? undefined : query.data

  const confirming =
    new URLSearchParams(location.search).get('step') === 'confirm' &&
    location.state?.confirmRoom === roomId &&
    !!room

  return (
    <main className={styles.page}>
      <AppHeader
        title="공동 주문 상세"
        backLabel={confirming ? '공동 주문 상세로 돌아가기' : '홈으로 돌아가기'}
        onBack={() =>
          confirming || location.state?.fromHome
            ? navigate(-1)
            : navigate('/', { replace: true })
        }
      />
      <div className={styles.body}>
        {query.isPending ? (
          <LoadingSpinner label="모집방을 불러오는 중" />
        ) : query.isError && !room && !missing ? (
          <section className={styles.feedback}>
            <p role="alert">모집방 정보를 불러오지 못했어요.</p>
            <button type="button" onClick={() => void query.refetch()}>
              다시 시도
            </button>
          </section>
        ) : room ? (
          <RoomDetails key={room.roomId} room={room} confirming={confirming} />
        ) : (
          <section className={styles.feedback}>
            <p>모집방을 찾을 수 없어요.</p>
            <Link to="/" replace>
              홈으로 돌아가기
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}

function Recruitment({ room, image }: { room: RoomDetail; image?: string }) {
  return (
    <section className={styles.card}>
      <div className={styles.store}>
        {image && <img src={image} alt="" />}
        <div>
          <h2>{room.storeName}</h2>
          <p>
            <RecruitDeadline value={room.recruitDeadline} />
          </p>
        </div>
        <span className={styles.tag}>{trackLabels[room.track]}</span>
      </div>
      <div className={styles.recruitment}>
        <h2>모집 현황</h2>
        <div
          className={styles.track}
          role="img"
          aria-label={`정원 ${room.maxParticipants}명 중 ${room.currentParticipants}명 참여`}
        >
          {Array.from({ length: room.maxParticipants }, (_, i) => (
            <span
              key={i}
              className={styles.step}
              data-filled={i < room.currentParticipants}
              aria-hidden="true"
            >
              {i + 1 === room.currentParticipants && (
                <>
                  <img src={participantIcon} alt="" />
                  <b>{room.currentParticipants}명 참여</b>
                </>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoomDetails({
  room,
  confirming,
}: {
  room: RoomDetail
  confirming: boolean
}) {
  const navigate = useNavigate()
  const { state, search } = useLocation()
  const storeQuery = useQuery(storeDetailQuery(String(room.storeId)))
  const store = storeQuery.data && toMenuStore(storeQuery.data)
  const spots = useQuery(spotListQuery)
  const spot = spots.data?.spots.find((point) => point.name === room.spotName)
  const delivery = room.deliveryFeeShare
  const unavailable =
    room.status !== 'RECRUITING' ||
    room.joinedByMe ||
    room.currentParticipants >= room.maxParticipants
  const shared = room.track === 'PORTION'
  const [quantities, setQuantities] = useState<Record<string, number>>(
    state?.confirmRoom === String(room.roomId) ? (state.quantities ?? {}) : {},
  )
  const editing = new URLSearchParams(search).get('step') === 'menus'
  function openStore() {
    setNotice('')
    navigate('?step=menus', { state: { ...state, fromRoom: true } })
  }
  function closeStore() {
    if (state?.fromRoom) navigate(-1)
    else navigate({ search: '' }, { replace: true, state })
  }
  const [notice, setNotice] = useState('')
  const menus = (store?.menus ?? []).map((menu) => ({
    ...menu,
    quantity: quantities[menu.id] ?? 0,
  }))
  const selected = menus.filter((menu) => menu.quantity > 0)
  const total = selected.reduce(
    (sum, menu) => sum + menu.price * menu.quantity,
    0,
  )

  const client = useQueryClient()
  const showToast = useToast()
  const joinKey = ['rooms', 'join', room.roomId]
  const participation = useMutation({
    mutationKey: joinKey,
    networkMode: 'always',
    mutationFn: (paymentMethod: PaymentMethod) =>
      joinRoom(room.roomId, {
        paymentMethod,
        items: selected.map(({ id, quantity }) => ({ menuId: id, quantity })),
      }),
    onSuccess: () => refreshRoomsAndOrders(client),
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        showToast(error.message, 'error')
        refreshRoomsAndOrders(client)
      }
    },
  })

  function confirmParticipation(payment: PaymentMethod) {
    if (
      unavailable ||
      (!shared && !selected.length) ||
      client.isMutating({ mutationKey: joinKey })
    )
      return
    participation.mutate(payment, {
      onSuccess: ({ orderId }) =>
        navigate('/orders/' + orderId, { replace: true }),
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) navigate(-1)
      },
    })
  }

  const sharedImage = store?.menus.find(
    (menu) => menu.id === room.sharedMenu?.menuId,
  )?.imageUrl

  if (editing && store)
    return (
      <StoreDetail
        store={store}
        action="메뉴 담기"
        initialMenus={selected.map((menu) => ({
          ...selectRoomMenu(store, menu),
          quantity: menu.quantity,
        }))}
        allowEmpty={selected.length > 0}
        onBack={closeStore}
        onConfirm={(items) => {
          setQuantities(
            Object.fromEntries(
              items.map((item) => [item.menuId, item.quantity]),
            ),
          )
          closeStore()
        }}
      />
    )

  if (
    confirming &&
    !unavailable &&
    (store || !Object.values(quantities).some(Boolean))
  ) {
    return (
      <ParticipationConfirmation
        room={room}
        selected={selected}
        personalSubtotal={total}
        delivery={delivery}
        submitting={participation.isPending}
        disabled={!shared && !selected.length}
        error={
          participation.error instanceof ApiError
            ? participation.error.message
            : participation.isError
              ? '참여 결과를 확인하지 못했어요. 주문 내역을 확인해 주세요.'
              : undefined
        }
        onConfirm={confirmParticipation}
      />
    )
  }

  return (
    <div className={styles.content}>
      <Recruitment room={room} image={store?.image} />
      {shared && room.sharedMenu && (
        <section className={styles.shared}>
          <div>
            <h2>함께 나눌 메뉴</h2>
            <strong>{room.sharedMenu.name}</strong>
            <p>
              {won(room.sharedMenu.portionPrice)} <small>/ 1명</small>
            </p>
          </div>
          {sharedImage && <img src={sharedImage} alt="" />}
        </section>
      )}
      <section
        className={styles.menu}
        data-individual={shared && selected.length > 0}
        aria-label="개인 메뉴"
      >
        {selected.length ? (
          <>
            <div className={styles.row}>
              <h2>{shared ? '개별 주문 메뉴' : '내 메뉴'}</h2>
              <button className={styles.menuButton} onClick={openStore}>
                변경
              </button>
            </div>
            {selected.map((menu) =>
              shared ? (
                <div key={menu.id} className={styles.row}>
                  <div className={styles.menuInfo}>
                    <strong>{menu.name}</strong>
                    <span>{won(menu.price)}</span>
                  </div>
                  <QuantityCounter
                    variant="individual"
                    label={menu.name + ' 수량'}
                    value={menu.quantity}
                    unit="개"
                    onChange={(quantity) =>
                      setQuantities((current) => ({
                        ...current,
                        [menu.id]: quantity,
                      }))
                    }
                  />
                </div>
              ) : (
                <div key={menu.id} className={styles.row}>
                  <span>
                    {menu.name} · {menu.quantity}개
                  </span>
                  <span>{won(menu.price * menu.quantity)}</span>
                </div>
              ),
            )}
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
              disabled={!store}
              onClick={openStore}
            >
              <span aria-hidden="true">＋</span> 메뉴 담기
            </button>
          </div>
        )}
        {storeQuery.isError && !store && (
          <div role="alert">
            가게 메뉴를 불러오지 못했어요.{' '}
            <button type="button" onClick={() => void storeQuery.refetch()}>
              다시 시도
            </button>
          </div>
        )}
        {!shared && selected.length > 0 && (
          <>
            <div className={styles.deliveryFee}>
              <strong>배달비</strong>
              <span>{delivery == null ? '확인 전' : won(delivery)}</span>
            </div>
            <div className={styles.total}>
              <span>총 금액</span>
              <strong>
                {delivery == null
                  ? '배달비 확인 후 안내'
                  : won(total + delivery)}
              </strong>
            </div>
          </>
        )}
      </section>
      <section className={styles.pickup}>
        <h2>통통 스팟 안내</h2>
        {spot?.mapImageUrl && (
          <img src={spot.mapImageUrl} alt={spot.name + ' 픽업 위치'} />
        )}
        <strong>{room.spotName}</strong>
        {spot?.description && <p>{spot.description}</p>}
        <p>
          지정 수령 구역에서 픽업 코드 입력 필수
          <br />
          주문 도착 후 15분 내 수령 필수 · 미수령 시 페널티 발생
        </p>
      </section>
      <footer className={styles.footer}>
        <PrimaryButton
          disabled={unavailable}
          onClick={() => {
            if (!shared && !selected.length) {
              setNotice('참여하려면 먼저 개인 메뉴를 담아주세요.')
              return
            }
            participation.reset()
            navigate('?step=confirm', {
              state: { ...state, confirmRoom: String(room.roomId), quantities },
            })
          }}
        >
          {room.status !== 'RECRUITING'
            ? '모집 종료'
            : room.joinedByMe
              ? '이미 참여한 방'
              : room.currentParticipants >= room.maxParticipants
                ? '정원 마감'
                : '참여하기'}
        </PrimaryButton>
        <p role="status">{notice}</p>
      </footer>
    </div>
  )
}
