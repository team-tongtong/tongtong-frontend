import styles from './QuantityCounter.module.css'
import minus from '@/assets/recruitment/minus.svg'
import plus from '@/assets/recruitment/plus.svg'

type QuantityCounterProps = {
  variant?: 'menu' | 'recruitment' | 'individual'
  label: string
  value: number
  unit?: string
  min?: number
  step?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantityCounter({
  variant = 'menu',
  label,
  value,
  unit,
  min = 0,
  step = 1,
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
        onClick={() => onChange(Math.max(min, value - step))}
      >
        {variant === 'menu' ? '−' : <img src={minus} alt="" />}
      </button>
      <span aria-live="polite" aria-atomic="true">
        {value}
        {unit}
      </span>
      <button
        type="button"
        aria-label={`${label} 늘리기`}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(Math.min(max ?? Infinity, value + step))}
      >
        {variant === 'menu' ? '+' : <img src={plus} alt="" />}
      </button>
    </div>
  )
}
