import { useRef, useState } from 'react'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchTermChip } from '@/components/search/SearchTermChip'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const [value, setValue] = useState('')
  const [terms, setTerms] = useState<string[]>([])
  const input = useRef<HTMLInputElement>(null)

  function submit(term: string) {
    setValue(term)
    setTerms((previous) => [term, ...previous.filter((item) => item !== term)])
  }

  function remove(term: string) {
    setTerms((previous) => previous.filter((item) => item !== term))
    input.current?.focus()
  }

  return (
    <main className={styles.page} aria-label="검색">
      <SearchInput
        inputRef={input}
        value={value}
        onChange={setValue}
        onSubmit={submit}
      />
      <section aria-labelledby="recent-terms">
        <h2 id="recent-terms">최근 검색어</h2>
        {terms.length ? (
          <ul>
            {terms.map((term) => (
              <li key={term}>
                <SearchTermChip
                  term={term}
                  onSelect={submit}
                  onRemove={remove}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>최근 검색어가 없어요.</p>
        )}
      </section>
    </main>
  )
}
