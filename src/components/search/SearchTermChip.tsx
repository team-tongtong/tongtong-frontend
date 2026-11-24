import removeIcon from '@/assets/search/remove.svg'
import styles from './SearchControls.module.css'

type SearchTermChipProps = {
  term: string
  onSelect: (term: string) => void
  onRemove: (term: string) => void
}

export function SearchTermChip({
  term,
  onSelect,
  onRemove,
}: SearchTermChipProps) {
  return (
    <span className={styles.chip}>
      <button
        type="button"
        className={styles.term}
        onClick={() => onSelect(term)}
      >
        {term}
      </button>
      <button
        type="button"
        className={styles.remove}
        aria-label={`${term} 삭제`}
        onClick={() => onRemove(term)}
      >
        <img src={removeIcon} alt="" />
      </button>
    </span>
  )
}
