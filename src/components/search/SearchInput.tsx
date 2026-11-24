import type { Ref } from 'react'
import searchIcon from '@/assets/search/search.svg'
import styles from './SearchControls.module.css'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (term: string) => void
  inputRef?: Ref<HTMLInputElement>
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  inputRef,
}: SearchInputProps) {
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
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" aria-label="검색하기">
        <img src={searchIcon} alt="" />
      </button>
    </form>
  )
}
