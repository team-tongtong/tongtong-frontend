import { useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import spotMap from '@/assets/order/pickup-map.png'
import { PortionUnavailableDialog } from './PortionUnavailableDialog'
import chevron from '@/assets/recruitment/chevron.svg'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import { orderMethodLabels } from '@/components/group-order/orderMethod'
import { AppHeader } from '@/components/layout/AppHeader'
import { ChoiceCard } from '@/components/recruitment/ChoiceCard'
import { RecruitmentConditionsCard } from '@/components/order/RecruitmentConditionsCard'
import { paymentMethods } from '@/components/order/paymentMethods'
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

const spots = [
  { label: '한양대 ERICA 행복관 1층', description: '지정 수령 구역' },
  { label: '학생회관 1층', description: '중앙 출입구 옆 수령 구역' },
  { label: '중앙도서관 앞', description: '정문 오른쪽 수령 구역' },
  { label: '한양대 ERICA 창의관 입구', description: '1층 로비 지정 수령 구역' },
]

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
  const [paymentMethod, setPaymentMethod] = useState<string>()
  const [spot, setSpot] = useState('')
  const [choosingSpot, setChoosingSpot] = useState(false)
  const [draftSpot, setDraftSpot] = useState('')

  const [notice, setNotice] = useState('')

  function goBack() {
    setNotice('')
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
        {step === 1 ? (
          <>
            <div className={styles.intro}>
              <h2 ref={focusHeading} tabIndex={-1}>
                메뉴와 주문 방식을 선택해주세요
              </h2>
              <p>우리 동네에서 가볍게 함께 주문해요.</p>
            </div>
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
              <div
                className={styles.choices}
                role="radiogroup"
                aria-labelledby="spots-title"
              >
                {spots.map(({ label, description }) => (
                  <ChoiceCard
                    key={label}
                    variant="spot"
                    name="pickup-spot"
                    value={label}
                    label={label}
                    description={description}
                    checked={draftSpot === label}
                    onChange={() => setDraftSpot(label)}
                  />
                ))}
              </div>
            </section>
            <PrimaryButton
              disabled={!draftSpot}
              onClick={() => {
                setSpot(draftSpot)
                setChoosingSpot(false)
              }}
            >
              이 스팟에서 받기
            </PrimaryButton>
          </>
        ) : (
          <>
            <section className={styles.panel} aria-labelledby="pickup-title">
              <h2 id="pickup-title" ref={focusHeading} tabIndex={-1}>
                {spot ? '선택한 통통 스팟' : '픽업 장소 선택'}
              </h2>
              {spot && (
                <img
                  className={styles.spotMap}
                  src={spotMap}
                  alt="통통 스팟 예시 지도"
                />
              )}
              <button
                type="button"
                aria-label={spot ? spot + ' · 스팟 변경' : '픽업 장소 선택'}
                className={styles.pickup}
                onClick={() => {
                  setDraftSpot(spot)
                  setChoosingSpot(true)
                }}
              >
                <span>
                  {spot || '어디에서 받을까요?'}
                  <small>
                    {spot
                      ? spots.find((item) => item.label === spot)?.description
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
              methods={paymentMethods}
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
            <div className={styles.next}>
              <PrimaryButton
                disabled={!spot || !paymentMethod}
                onClick={() => setNotice('모집방 생성 기능은 준비 중이에요.')}
              >
                모집방 만들기
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
