import styles from './QuantityCounter.module.css'

type QuantityCounterProps = {
  label: string
  value: number
  unit?: string
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantityCounter({
  label,
  value,
  unit,
  min = 0,
  max,
  onChange,
}: QuantityCounterProps) {
  return (
    <div className={styles.counter} role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`${label} 줄이기`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
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
        +
      </button>
    </div>
  )
}
