export const statuses = [
  '전체',
  '모집중',
  '조리중',
  '배달 완료',
  '취소',
] as const
export type OrderStatusFilterValue = (typeof statuses)[number]

export function readOrderStatus(value: string | null): OrderStatusFilterValue {
  return statuses.find((status) => status === value) ?? '전체'
}
