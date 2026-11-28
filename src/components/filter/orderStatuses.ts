export const statuses = [
  '전체',
  '모집중',
  '모집 완료',
  '배달 완료',
  '취소',
] as const
export type OrderStatusFilterValue = (typeof statuses)[number]

export function readOrderStatus(value: string | null): OrderStatusFilterValue {
  if (value === '조리중') return '모집 완료'
  return statuses.find((status) => status === value) ?? '전체'
}
