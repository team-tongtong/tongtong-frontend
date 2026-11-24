import styles from './QuantityCounter.module.css'
import minus from '@/assets/recruitment/minus.svg'
import plus from '@/assets/recruitment/plus.svg'

type QuantityCounterProps = {
  variant?: 'menu' | 'recruitment'
  label: string
  value: number
  unit?: string
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantityCounter({
  variant = 'menu',
  label,
  value,
  unit,
  min = 0,
  max,
  onChange,
}: QuantityCounterProps) {
  return (
    <div
      className={styles.counter}
      data-variant={variant}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label={`${label} 줄이기`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        {variant === 'recruitment' ? <img src={minus} alt="" /> : '−'}
      </button>
      <span aria-live="polite" aria-atomic="true">
        {value}
        {unit}
      </span>
      <button
        type="button"
        aria-label={`${label} 늘리기`}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(value + 1)}
      >
        {variant === 'recruitment' ? <img src={plus} alt="" /> : '+'}
      </button>
    </div>
  )
}
