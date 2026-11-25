import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
import type { RoomMenuSelection } from './roomMenuSelection'

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

export function CreateRoomPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [method, setMethod] = useState<keyof typeof orderMethodLabels>()
  const { state, search } = useLocation()
  const [menus, setMenus] = useState<RoomMenuSelection[]>(
    () =>
      state?.selectedMenus ?? (state?.selectedMenu ? [state.selectedMenu] : []),
  )
  const menu = menus[0]
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

  if (new URLSearchParams(search).get('menu') === 'search') {
    function returnToRoom() {
      if (state?.fromRoomForm) navigate(state.openedStore ? -2 : -1)
      else navigate('/rooms/new', { replace: true })
    }
    return (
      <>
        {!new URLSearchParams(search).has('q') && (
          <AppHeader title="메뉴 검색" onBack={returnToRoom} />
        )}
        <SearchPage
          initialMenus={menus}
          onSelectMenu={(selection) => {
            setMenus(selection)
            navigate('/rooms/new', { state: { selectedMenus: selection } })
          }}
        />
      </>
    )
  }

  return (
    <main>
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
              onOpenSearch={() => {
                const params = new URLSearchParams({ menu: 'search' })
                if (menu) params.set('store', menu.storeId)
                navigate('?' + params, {
                  state: { selectedMenus: menus, fromRoomForm: true },
                })
              }}
              selected={menus}
              onChange={(selection) => {
                setMenus(selection)
                if (!selection.length) setMethod(undefined)
              }}
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
                      onChange={() => setMethod(value)}
                    />
                  ))}
                </div>
              </section>
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
                픽업 장소 선택
              </h2>
              <button
                type="button"
                className={styles.pickup}
                onClick={() => {
                  setDraftSpot(spot)
                  setChoosingSpot(true)
                }}
              >
                <span>
                  {spot || '어디에서 받을까요?'}
                  <small>등록된 통통 스팟에서 함께 받아요.</small>
                </span>
                <img src={chevron} alt="" />
              </button>
            </section>
            {menu && (
              <RoomPaymentSummary
                menus={menus}
                people={people}
                shared={method === '내 몫 담기'}
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
    </main>
  )
}
