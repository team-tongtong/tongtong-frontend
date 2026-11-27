import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import back from '@/assets/search/back.svg'
import { FilterChip } from '@/components/filter/FilterChip'
import { StoreDetail } from './StoreDetail'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchTermChip } from '@/components/search/SearchTermChip'
import { RestaurantListItem } from '@/components/search/RestaurantListItem'
import { sampleGroupOrdersQuery } from './sampleGroupOrders'
import type { RoomMenuSelection } from './roomMenuSelection'
import {
  formatDistance,
  popularTerms,
  searchStores,
  sortOptions,
} from './storeSearch'
import styles from './SearchPage.module.css'

const historyKey = 'tongtong.recentSearchTerms'

function readTerms(fallback: string[]): string[] {
  try {
    const saved: unknown = JSON.parse(
      sessionStorage.getItem(historyKey) ?? 'null',
    )
    if (Array.isArray(saved))
      return saved.filter((term): term is string => typeof term === 'string')
  } catch {
    /* Search remains available when storage is unavailable. */
  }
  return fallback
}

export function SearchPage({
  onBack,
  onSelectMenu,
  initialMenus,
  menuMode,
}: {
  onBack?: () => void
  onSelectMenu?: (menus: RoomMenuSelection[]) => void
  initialMenus?: RoomMenuSelection[]
  menuMode?: 'shared' | 'individual'
}) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const submitted: string = params.get('q') ?? state?.searchTerm ?? ''
  const [terms, setTerms] = useState<string[]>(() =>
    readTerms(state?.searchTerms ?? []),
  )
  const input = useRef<HTMLInputElement>(null)
  const storeId = params.get('store')
  const sort =
    sortOptions.find((option) => option === state?.searchSort) ?? '기본순'
  const query = useQuery({
    ...sampleGroupOrdersQuery,
    enabled: !!submitted || !!storeId,
  })
  const stores = query.data ?? []

  function saveTerms(next: string[]) {
    setTerms(next)
    try {
      sessionStorage.setItem(historyKey, JSON.stringify(next))
    } catch {
      /* Keep the in-memory history. */
    }
  }

  function submit(term: string) {
    saveTerms([term, ...terms.filter((item) => item !== term)])
    const next = new URLSearchParams(params)
    next.set('q', term)
    setParams(next, {
      replace: !!submitted,
      state: {
        ...state,
        searchTerm: undefined,
        searchSort: undefined,
        fromSearch: !submitted || state?.fromSearch,
      },
    })
    input.current?.blur()
  }

  function backToSearch() {
    if (state?.fromSearch) navigate(-1)
    else {
      const next = new URLSearchParams(params)
      next.delete('q')
      setParams(next, {
        replace: true,
        state: { ...state, searchTerm: undefined, searchSort: undefined },
      })
    }
  }

  function selectMenus(menus: RoomMenuSelection[]) {
    if (onSelectMenu) {
      onSelectMenu(menus)
      return
    }
    setParams(params, {
      replace: true,
      state: { ...state, selectedMenus: menus },
    })
    navigate('/rooms/new', { state: { selectedMenus: menus } })
  }

  const detail = stores.find((store) => store.id === storeId)
  if (detail)
    return (
      <StoreDetail
        key={detail.id}
        store={detail}
        action={onSelectMenu ? '메뉴 담기' : '모집방 만들기'}
        menuMode={menuMode}
        allowEmpty={menuMode === 'individual'}
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

  const restaurants = searchStores(stores, submitted, sort)
  const handleBack = submitted ? backToSearch : onBack
  return (
    <main className={styles.page} aria-label="검색" data-standalone={!onBack}>
      <div
        className={handleBack ? styles.searchHeader : undefined}
        data-results={!!submitted}
      >
        {handleBack && (
          <button
            className={styles.back}
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
          >
            <img src={back} alt="" />
          </button>
        )}
        <SearchInput
          key={submitted}
          initialValue={submitted}
          inputRef={input}
          onSubmit={submit}
          onClear={submitted ? backToSearch : undefined}
        />
      </div>
      {!submitted ? (
        <>
          <section aria-labelledby="recent-terms">
            <h2 id="recent-terms">최근 검색어</h2>
            {terms.length ? (
              <ul className={styles.chips}>
                {terms.map((term) => (
                  <li key={term}>
                    <SearchTermChip
                      term={term}
                      onSelect={submit}
                      onRemove={() => {
                        saveTerms(terms.filter((item) => item !== term))
                        input.current?.focus()
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>최근 검색어가 없어요.</p>
            )}
          </section>
          <section className={styles.popular} aria-labelledby="popular-terms">
            <h2 id="popular-terms">인기 검색어</h2>
            <ol>
              {popularTerms.map((term, index) => (
                <li key={term}>
                  <button onClick={() => submit(term)}>
                    <strong>{index + 1}</strong>
                    {term}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <>
          <div
            className={styles.filters}
            role="group"
            aria-label="검색 결과 정렬"
          >
            {sortOptions.map((option) => (
              <FilterChip
                key={option}
                selected={sort === option}
                onClick={() =>
                  setParams(params, {
                    replace: true,
                    state: { ...state, searchSort: option },
                  })
                }
              >
                {option}
              </FilterChip>
            ))}
          </div>
          {query.isPending ? (
            <p role="status">검색 결과를 불러오는 중이에요.</p>
          ) : query.isError ? (
            <section>
              <p role="alert">검색 결과를 불러오지 못했어요.</p>
              <button onClick={() => void query.refetch()}>다시 시도</button>
            </section>
          ) : restaurants.length ? (
            <ul className={styles.results} aria-label="매장 검색 결과">
              {restaurants.map(({ store, info }) => (
                <li key={store.id}>
                  <RestaurantListItem
                    image={store.image}
                    name={store.storeDetails?.name ?? store.name}
                    rating={info?.rating ?? store.storeDetails?.rating}
                    reviewCount={
                      info?.reviewCount ?? store.storeDetails?.reviewCount
                    }
                    minimumOrder={info?.minimum ?? store.minimumOrderAmount}
                    deliveryInfo={
                      info &&
                      [
                        '약 ' + info.minutes + '분',
                        '배달비 ' + info.fee.toLocaleString('ko-KR') + '원',
                        formatDistance(info.distance),
                      ].join(' | ')
                    }
                    onSelect={() => {
                      const next = new URLSearchParams(params)
                      next.set('store', store.id)
                      setParams(next, {
                        state: { ...state, openedStore: true },
                      })
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p role="status">‘{submitted}’ 검색 결과가 없어요.</p>
          )}
        </>
      )}
    </main>
  )
}
