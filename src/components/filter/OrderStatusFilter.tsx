import { FilterChip } from './FilterChip'
import styles from './FilterChip.module.css'

import { statuses, type OrderStatusFilterValue } from './orderStatuses'
export type { OrderStatusFilterValue } from './orderStatuses'

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
