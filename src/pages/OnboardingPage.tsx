import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PrimaryButton } from '@/components/button/PrimaryButton'
import cart from '@/assets/onboarding/cart.webp'
import community from '@/assets/onboarding/community.webp'
import communityBack from '@/assets/onboarding/community-back.webp'
import communityMembers from '@/assets/onboarding/community-members.webp'
import delivery from '@/assets/onboarding/delivery.webp'
import pickup from '@/assets/onboarding/pickup.webp'
import mascot from '@/assets/onboarding/mascot.webp'
import people from '@/assets/onboarding/people.webp'
import payment from '@/assets/onboarding/payment.webp'
import rider from '@/assets/onboarding/rider.webp'
import styles from './OnboardingPage.module.css'

const slides = [
  { image: cart, height: 448, title: '혼자 먹는 한 끼,\n가격이 부담됐나요?' },
  {
    image: community,
    imageClass: styles.communityCard,
    background: communityBack,
    members: communityMembers,
    title: 'TONG TONG에서 찾은\n가까운 이웃과 주문만 함께',
  },
  { image: delivery, title: '먹고 싶은 메뉴를 원하는 만큼\n배달비는 나눠서' },
  { image: pickup, title: '픽업 코드 입력하고\n내 음식만 쏙!' },
]

const features = [
  {
    icon: people,
    title: '동네 이웃과 함께 주문해요',
    detail: '한 메뉴를 나눠 받거나, 각자 메뉴를 골라요.',
  },
  {
    icon: payment,
    title: '내 몫만 간편하게 결제해요',
    detail: '음식값은 각자, 배달비는 함께 나눠요.',
  },
  {
    icon: rider,
    title: '통통 스팟에서 내 음식을 받아요',
    detail: '영수증의 픽업 코드를 입력해 수령을 확인해요.',
  },
]

export function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const slide = slides[step]

  return (
    <main className={styles.page} data-step={step + 1}>
      {slide ? (
        <>
          <div className={styles.art}>
            {slide.background && (
              <img
                className={styles.communityBack}
                src={slide.background}
                width={390}
                height={580}
                alt=""
              />
            )}
            <img
              className={slide.imageClass}
              src={slide.image}
              width={390}
              height={slide.height ?? 580}
              alt=""
            />
            {slide.members && (
              <img src={slide.members} width={390} height={580} alt="" />
            )}
          </div>
          <h1 className={styles.caption} aria-live="polite">
            {slide.title}
          </h1>
          <div
            className={styles.progress}
            role="progressbar"
            aria-label="온보딩 진행 단계"
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-valuenow={step + 1}
          >
            {slides.map((item, index) => (
              <span key={item.image} data-current={step === index} />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.ready}>
          <h1>TONG TONG 할 준비됐나요?</h1>
          <p>
            혼자 주문하기 부담될 땐,
            <br />
            통통에서 함께해요
          </p>
          <img className={styles.mascot} src={mascot} alt="" />
          <ul>
            {features.map((feature) => (
              <li key={feature.title}>
                <img src={feature.icon} alt="" />
                <div>
                  <strong>{feature.title}</strong>
                  <small>{feature.detail}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.action}>
        <PrimaryButton
          onClick={() => {
            if (slide) {
              setStep(step + 1)
              window.scrollTo(0, 0)
            } else {
              onComplete()
              navigate('/', { replace: true })
            }
          }}
        >
          {slide ? 'Next' : '시작하기'}
        </PrimaryButton>
      </div>
    </main>
  )
}
