import { useState, type Ref } from 'react'
import clearIcon from '@/assets/search/clear.svg'
import searchIcon from '@/assets/search/search.svg'
import styles from './SearchControls.module.css'

type SearchInputProps = {
  initialValue: string
  onClear?: () => void
  onSubmit: (term: string) => void
  inputRef?: Ref<HTMLInputElement>
}

export function SearchInput({
  initialValue,
  onClear,
  onSubmit,
  inputRef,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue)
  return (
    <form
      className={styles.form}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        const term = value.trim()
        if (term) onSubmit(term)
      }}
    >
      <input
        ref={inputRef}
        type="search"
        className="tt-search-input"
        aria-label="검색어"
        enterKeyHint="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {onClear ? (
        <button
          type="button"
          className={styles.clear}
          aria-label="검색어 지우기"
          onClick={onClear}
        >
          <img src={clearIcon} alt="" />
        </button>
      ) : (
        <button type="submit" aria-label="검색하기">
          <img src={searchIcon} alt="" />
        </button>
      )}
    </form>
  )
}
