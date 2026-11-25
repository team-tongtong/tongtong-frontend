import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { StoreDetail } from './StoreDetail'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchTermChip } from '@/components/search/SearchTermChip'
import { RestaurantListItem } from '@/components/search/RestaurantListItem'
import { sampleGroupOrdersQuery } from './sampleGroupOrders'
import type { RoomMenuSelection } from './roomMenuSelection'
import styles from './SearchPage.module.css'

function normalize(term: string) {
  return term.normalize('NFC').toLowerCase().replace(/\s+/g, '')
}

export function SearchPage({
  onSelectMenu,
  initialMenus,
}: {
  onSelectMenu?: (menus: RoomMenuSelection[]) => void
  initialMenus?: RoomMenuSelection[]
}) {
  const { state } = useLocation()
  const [value, setValue] = useState<string>(state?.searchTerm ?? '')
  const [terms, setTerms] = useState<string[]>(state?.searchTerms ?? [])
  const [submitted, setSubmitted] = useState<string>(state?.searchTerm ?? '')
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const storeId = params.get('store')
  const query = useQuery({
    ...sampleGroupOrdersQuery,
    enabled: !!submitted || !!storeId,
  })
  const keyword = normalize(submitted)
  const stores = query.data ?? []
  const restaurants = stores.filter(
    (store) =>
      normalize(store.name).includes(keyword) ||
      normalize(store.storeDetails?.name ?? '').includes(keyword) ||
      store.menus.some((menu) => normalize(menu.name).includes(keyword)),
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

  function selectMenus(menus: RoomMenuSelection[]) {
    setParams(params, {
      replace: true,
      state: { ...state, selectedMenus: menus },
    })
    if (onSelectMenu) onSelectMenu(menus)
    else navigate('/rooms/new', { state: { selectedMenus: menus } })
  }

  const detail = stores.find((store) => store.id === storeId)
  if (detail)
    return (
      <StoreDetail
        key={detail.id}
        store={detail}
        action={onSelectMenu ? '메뉴 담기' : '모집방 만들기'}
        initialMenus={initialMenus ?? state?.selectedMenus}
        onConfirm={selectMenus}
        onBack={() => {
          if (state?.openedStore || state?.fromRoomForm) navigate(-1)
          else {
            const next = new URLSearchParams(params)
            next.delete('store')
            setParams(next, { replace: true, state })
          }
        }}
      />
    )
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
                      name={store.storeDetails?.name ?? store.name}
                      minimumOrder={store.minimumOrderAmount}
                      onSelect={() => {
                        const searchState = {
                          ...state,
                          searchTerm: submitted,
                          searchTerms: terms,
                        }
                        setParams(params, { replace: true, state: searchState })
                        const next = new URLSearchParams(params)
                        next.set('store', store.id)
                        setParams(next, {
                          state: { ...searchState, openedStore: true },
                        })
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!restaurants.length && (
            <p role="status">‘{submitted}’ 검색 결과가 없어요.</p>
          )}
        </>
      )}
    </main>
  )
}
