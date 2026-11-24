import styles from './FilterChip.module.css'

type FilterChipProps = {
  children: string
  selected: boolean
  onClick: () => void
}

export function FilterChip({ children, selected, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      className={styles.chip}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
