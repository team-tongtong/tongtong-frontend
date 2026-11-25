import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchTermChip } from '@/components/search/SearchTermChip'
import { RestaurantListItem } from '@/components/search/RestaurantListItem'
import { MenuListItem } from '@/components/search/MenuListItem'
import { sampleGroupOrdersQuery } from './sampleGroupOrders'
import { selectRoomMenu, type RoomMenuSelection } from './roomMenuSelection'
import styles from './SearchPage.module.css'

function normalize(term: string) {
  return term.normalize('NFC').toLowerCase().replace(/\s+/g, '')
}

export function SearchPage({
  onSelectMenu,
}: {
  onSelectMenu?: (menu: RoomMenuSelection) => void
}) {
  const [value, setValue] = useState('')
  const [terms, setTerms] = useState<string[]>([])
  const [submitted, setSubmitted] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const query = useQuery({ ...sampleGroupOrdersQuery, enabled: !!submitted })
  const keyword = normalize(submitted)
  const stores = query.data ?? []
  const restaurants = stores.filter((store) =>
    normalize(store.name).includes(keyword),
  )
  const menus = stores.flatMap((store) =>
    store.menus
      .filter((menu) => normalize(menu.name).includes(keyword))
      .map((menu) => ({ store, menu })),
  )

  function submit(term: string) {
    setValue(term)
    setSubmitted(term)
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
        onChange={(text) => {
          setValue(text)
          setSubmitted('')
        }}
        onSubmit={submit}
      />
      {!submitted ? (
        <section aria-labelledby="recent-terms">
          <h2 id="recent-terms">최근 검색어</h2>
          {terms.length ? (
            <ul className={styles.chips}>
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
      ) : query.isPending ? (
        <p role="status">검색 결과를 불러오는 중이에요.</p>
      ) : query.isError ? (
        <section>
          <p role="alert">검색 결과를 불러오지 못했어요.</p>
          <button type="button" onClick={() => void query.refetch()}>
            다시 시도
          </button>
        </section>
      ) : (
        <>
          {restaurants.length > 0 && (
            <section aria-label="매장 검색 결과">
              <h2>매장</h2>
              <ul>
                {restaurants.map((store) => (
                  <li key={store.id}>
                    <RestaurantListItem
                      image={store.image}
                      name={store.name}
                      minimumOrder={store.minimumOrderAmount}
                      onSelect={() => submit(store.name)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {menus.length > 0 && (
            <section aria-label="메뉴 검색 결과">
              <h2>메뉴</h2>
              <ul>
                {menus.map(({ store, menu }) => (
                  <li key={JSON.stringify([store.id, menu.id])}>
                    <MenuListItem
                      image={store.image}
                      name={menu.name}
                      description={store.name}
                      price={menu.price}
                      onAdd={() => {
                        const selectedMenu = selectRoomMenu(store, menu)
                        if (onSelectMenu) onSelectMenu(selectedMenu)
                        else navigate('/rooms/new', { state: { selectedMenu } })
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!restaurants.length && !menus.length && (
            <p role="status">‘{submitted}’ 검색 결과가 없어요.</p>
          )}
        </>
      )}
    </main>
  )
}
