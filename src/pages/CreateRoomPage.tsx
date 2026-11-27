import { useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRoom,
  refreshRoomsAndOrders,
  spotListQuery,
} from '@/features/rooms/api'
import { ApiError } from '@/api/client'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { PortionUnavailableDialog } from './PortionUnavailableDialog'
import chevron from '@/assets/recruitment/chevron.svg'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { orderMethodLabels } from '@/components/group-order/orderMethod'
import { AppHeader } from '@/components/layout/AppHeader'
import { ChoiceCard } from '@/components/recruitment/ChoiceCard'
import { RecruitmentConditionsCard } from '@/components/order/RecruitmentConditionsCard'
import type { PaymentMethod } from '@/components/order/paymentMethods'
import { PaymentMethodsCard } from '@/components/order/PaymentMethodsCard'
import { RecruitmentProgress } from '@/components/recruitment/RecruitmentProgress'
import styles from './CreateRoomPage.module.css'
import { SearchPage } from './SearchPage'
import { RoomPaymentSummary } from './RoomPaymentSummary'
import { CreateRoomMenu } from './CreateRoomMenu'
import { canShareMenus, type RoomMenuSelection } from './roomMenuSelection'

const methods = [
  { value: '내 몫 담기', description: '같은 메뉴를 나눠 담아 내 몫만 받아요.' },
  { value: '각자 담기', description: '각자 고른 메뉴를 담고 배달비를 나눠요.' },
] as const

function focusHeading(element: HTMLHeadingElement | null) {
  element?.focus()
}

type RoomMenuDraft = {
  menus: RoomMenuSelection[]
  individualMenus: RoomMenuSelection[]
  method?: keyof typeof orderMethodLabels
}

export function CreateRoomPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const { state, search, key } = useLocation()
  const [menuDraft, setMenuDraft] = useState<RoomMenuDraft>(
    () =>
      window.history.state?.roomMenuDraft ??
      state?.roomMenuDraft ?? {
        menus:
          state?.selectedMenus ??
          (state?.selectedMenu ? [state.selectedMenu] : []),
        individualMenus: [],
      },
  )
  const { menus, individualMenus, method } = menuDraft
  // 돌아온 폼의 기록에 확정값을 저장해 새로고침과 새 모집방 진입을 구분한다.
  useLayoutEffect(() => {
    window.history.replaceState(
      { ...window.history.state, roomMenuDraft: menuDraft },
      '',
    )
  }, [key, menuDraft])
  const [showPortionNotice, setShowPortionNotice] = useState(false)
  const menu = menus[0]
  const shared = method === '내 몫 담기'
  const [people, setPeople] = useState(4)
  const [minutes, setMinutes] = useState(10)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()
  const [spotId, setSpotId] = useState<number>()
  const [choosingSpot, setChoosingSpot] = useState(false)
  const [draftSpotId, setDraftSpotId] = useState<number>()
  const spotQuery = useQuery({ ...spotListQuery, enabled: step === 2 })
  const spots = spotQuery.data?.spots ?? []
  const spot = spots.find((point) => point.spotId === spotId)
  const client = useQueryClient()
  const createKey = ['rooms', 'create']
  const creation = useMutation({
    mutationKey: createKey,
    mutationFn: createRoom,
    networkMode: 'always',
    onSuccess: () => refreshRoomsAndOrders(client),
  })

  const [notice, setNotice] = useState('')

  function submitRoom() {
    if (
      !menu ||
      !method ||
      !spot ||
      !paymentMethod ||
      client.isMutating({ mutationKey: createKey })
    )
      return
    const personalMenus = shared ? individualMenus : menus
    if (
      !Number.isSafeInteger(menu.storeId) ||
      !Number.isSafeInteger(menu.menuId) ||
      personalMenus.some(
        (item) =>
          item.storeId !== menu.storeId || !Number.isSafeInteger(item.menuId),
      )
    ) {
      setNotice('같은 가게의 메뉴를 다시 선택해 주세요.')
      return
    }
    setNotice('')
    creation.mutate(
      {
        storeId: menu.storeId,
        track: shared ? 'PORTION' : 'INDIVIDUAL',
        sharedMenu: shared ? { menuId: menu.menuId } : null,
        items: personalMenus.map(({ menuId, quantity }) => ({
          menuId,
          quantity,
        })),
        spotId: spot.spotId,
        maxParticipants: people,
        recruitMinutes: minutes,
        paymentMethod,
      },
      {
        onSuccess: ({ roomId }) =>
          navigate('/rooms/' + roomId, { replace: true }),
        onError: (error) =>
          setNotice(
            error instanceof ApiError
              ? error.message
              : '모집방 생성 결과를 확인하지 못했어요. 주문 내역을 확인해 주세요.',
          ),
      },
    )
  }

  function goBack() {
    setNotice('')
    if (creation.isPending) return
    if (choosingSpot) setChoosingSpot(false)
    else if (step === 2) setStep(1)
    else if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }

  function updateMenus(selection: RoomMenuSelection[]) {
    setMenuDraft({
      menus: selection,
      individualMenus:
        selection[0]?.storeId === menu?.storeId ? individualMenus : [],
      method:
        !selection.length || (shared && !canShareMenus(selection))
          ? undefined
          : method,
    })
  }

  function setIndividualMenus(selection: RoomMenuSelection[]) {
    setMenuDraft((current) => ({ ...current, individualMenus: selection }))
  }

  function chooseMethod(value: keyof typeof orderMethodLabels) {
    if (value === '내 몫 담기' && !canShareMenus(menus)) {
      setShowPortionNotice(true)
      return
    }
    setMenuDraft((current) => ({ ...current, method: value }))
  }

  function openPicker(mode: 'initial' | 'shared' | 'individual') {
    const params = new URLSearchParams({ menu: 'search', pick: mode })
    if (menu) params.set('store', String(menu.storeId))
    navigate('?' + params, {
      state: {
        roomMenuDraft: menuDraft,
        fromRoomForm: true,
        roomFormIndex: window.history.state?.idx,
      },
    })
  }

  const params = new URLSearchParams(search)
  if (params.get('menu') === 'search') {
    const pick = params.get('pick')
    const menuMode =
      pick === 'shared' || pick === 'individual' ? pick : undefined
    function returnToRoom() {
      const depth = window.history.state?.idx - state?.roomFormIndex
      if (depth > 0) navigate(-depth)
      else navigate('/rooms/new', { replace: true })
    }
    return (
      <SearchPage
        menuMode={menuMode}
        onBack={returnToRoom}
        initialMenus={menuMode === 'individual' ? individualMenus : menus}
        onSelectMenu={(selection) => {
          if (menuMode === 'individual') setIndividualMenus(selection)
          else updateMenus(selection)
          returnToRoom()
        }}
      />
    )
  }

  return (
    <main className={styles.page}>
      <AppHeader title="모집방 만들기" onBack={goBack} />
      <RecruitmentProgress step={step} />
      <div className={styles.body}>
        {!choosingSpot && (
          <div className={styles.intro} key={step}>
            <h2 ref={focusHeading} tabIndex={-1}>
              {step === 1
                ? '메뉴와 주문 방식을 선택해주세요'
                : '통통 스팟과 결제 수단을 선택해주세요'}
            </h2>
            <p>우리 동네에서 가볍게 함께 주문해요.</p>
          </div>
        )}
        {step === 1 ? (
          <>
            <CreateRoomMenu
              maxQuantity={shared ? 1 : undefined}
              onOpenSearch={() => openPicker(shared ? 'shared' : 'initial')}
              selected={menus}
              onChange={updateMenus}
            />
            {menu && (
              <section
                className={styles.methodPanel}
                aria-labelledby="method-title"
              >
                <h2 id="method-title">어떻게 주문할까요?</h2>
                <div
                  className={styles.choices}
                  role="radiogroup"
                  aria-labelledby="method-title"
                >
                  {methods.map(({ value, description }) => (
                    <ChoiceCard
                      key={value}
                      variant="method"
                      name="order-method"
                      value={value}
                      label={orderMethodLabels[value]}
                      description={description}
                      checked={method === value}
                      onChange={() => chooseMethod(value)}
                    />
                  ))}
                </div>
              </section>
            )}
            {shared && menu && (
              <CreateRoomMenu
                title="개별 주문 메뉴"
                emptyLabel="개별 주문할 메뉴를 담아주세요"
                selected={individualMenus}
                onChange={setIndividualMenus}
                onOpenSearch={() => openPicker('individual')}
              />
            )}
            {menu && method && (
              <RecruitmentConditionsCard
                minimumOrderAmount={menu.minimumOrderAmount}
                people={people}
                minutes={minutes}
                onPeopleChange={setPeople}
                onMinutesChange={setMinutes}
              />
            )}
            <div className={styles.next}>
              <PrimaryButton
                disabled={!menu || !method}
                onClick={() => setStep(2)}
              >
                다음
              </PrimaryButton>
            </div>
          </>
        ) : choosingSpot ? (
          <>
            <section aria-labelledby="spots-title">
              <h2 id="spots-title" ref={focusHeading} tabIndex={-1}>
                통통 스팟 리스트
              </h2>
              {spotQuery.isPending && (
                <LoadingSpinner label="스팟을 불러오는 중" />
              )}
              {spotQuery.isError && !spotQuery.data && (
                <p role="alert">
                  스팟을 불러오지 못했어요.{' '}
                  <button
                    type="button"
                    onClick={() => void spotQuery.refetch()}
                  >
                    다시 시도
                  </button>
                </p>
              )}
              {spotQuery.isSuccess && !spots.length && (
                <p>등록된 통통 스팟이 없어요.</p>
              )}
              <div
                className={styles.choices}
                role="radiogroup"
                aria-labelledby="spots-title"
              >
                {spots.map(({ spotId, name, description }) => (
                  <ChoiceCard
                    key={spotId}
                    variant="spot"
                    name="pickup-spot"
                    value={spotId}
                    label={name}
                    description={description}
                    checked={draftSpotId === spotId}
                    onChange={() => setDraftSpotId(spotId)}
                  />
                ))}
              </div>
            </section>
            <PrimaryButton
              disabled={!spots.some((point) => point.spotId === draftSpotId)}
              onClick={() => {
                setSpotId(draftSpotId)
                setChoosingSpot(false)
              }}
            >
              이 스팟에서 받기
            </PrimaryButton>
          </>
        ) : (
          <>
            <section className={styles.panel} aria-labelledby="pickup-title">
              <h2 id="pickup-title">
                {spot ? '선택한 통통 스팟' : '픽업 장소 선택'}
              </h2>
              {spot?.mapImageUrl && (
                <img
                  className={styles.spotMap}
                  src={spot.mapImageUrl}
                  alt={spot.name + ' 픽업 위치'}
                />
              )}
              <button
                type="button"
                disabled={creation.isPending}
                aria-label={
                  spot ? spot.name + ' · 스팟 변경' : '픽업 장소 선택'
                }
                className={styles.pickup}
                onClick={() => {
                  setDraftSpotId(spotId)
                  setChoosingSpot(true)
                }}
              >
                <span>
                  {spot?.name ?? '어디에서 받을까요?'}
                  <small>
                    {spot
                      ? spot.description
                      : '등록된 통통 스팟에서 함께 받아요.'}
                  </small>
                </span>
                <img src={chevron} alt="" />
              </button>
              {spot && (
                <p className={styles.spotInstructions}>
                  지정 수령 구역에서 픽업 코드 입력 필수
                  <br />
                  주문 도착 후 15분 내 수령 필수 · 미수령 시 페널티 발생
                </p>
              )}
            </section>
            {menu && (
              <RoomPaymentSummary
                menus={menus}
                people={people}
                shared={shared}
                individualMenus={individualMenus}
              />
            )}
            <PaymentMethodsCard
              disabled={creation.isPending}
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
            <div className={styles.next}>
              <PrimaryButton
                disabled={
                  !menu ||
                  !method ||
                  !spot ||
                  !paymentMethod ||
                  creation.isPending
                }
                onClick={submitRoom}
              >
                {creation.isPending ? '모집방 만드는 중…' : '모집방 만들기'}
              </PrimaryButton>
              {notice && <p role="status">{notice}</p>}
            </div>
          </>
        )}
      </div>
      {showPortionNotice && (
        <PortionUnavailableDialog
          onDismiss={() => setShowPortionNotice(false)}
        />
      )}
    </main>
  )
}
