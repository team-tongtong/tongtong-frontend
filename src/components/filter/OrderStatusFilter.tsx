import { FilterChip } from './FilterChip'
import styles from './FilterChip.module.css'

const statuses = ['전체', '모집중', '조리중', '배달 완료', '취소'] as const
export type OrderStatusFilterValue = (typeof statuses)[number]

type OrderStatusFilterProps = {
  value: OrderStatusFilterValue
  onChange: (value: OrderStatusFilterValue) => void
}

export function OrderStatusFilter({ value, onChange }: OrderStatusFilterProps) {
  return (
    <div className={styles.group} role="group" aria-label="주문 상태">
      {statuses.map((status) => (
        <FilterChip
          key={status}
          selected={value === status}
          onClick={() => onChange(status)}
        >
          {status}
        </FilterChip>
      ))}
    </div>
  )
}
