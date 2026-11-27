export const paymentMethodLabels = {
  CARD: '신용, 체크카드',
  TOSS_PAY: '토스페이',
  KAKAO_PAY: '카카오페이',
  NAVER_PAY: '네이버페이',
} as const

export type PaymentMethod = keyof typeof paymentMethodLabels
export const paymentMethods = Object.keys(
  paymentMethodLabels,
) as PaymentMethod[]
