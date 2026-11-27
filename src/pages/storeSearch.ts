import { useQueries, useQuery } from '@tanstack/react-query'
import {
  storeDetailQuery,
  storeListQuery,
  type StoreSummary,
} from '@/features/stores/api'

export const sortOptions = [
  '기본순',
  '주문 많은 순',
  '별점 높은 순',
  '가까운 순',
] as const
type SearchSort = (typeof sortOptions)[number]

function normalize(term: string) {
  return term.normalize('NFC').toLowerCase().replace(/\s+/g, '')
}

export function useStoreSearch(term: string, sort: SearchSort) {
  const list = useQuery({ ...storeListQuery, enabled: !!term })
  const stores = term ? (list.data?.stores ?? []) : []
  const keyword = normalize(term)
  const matches = (value: string) => normalize(value).includes(keyword)
  const storeIds = new Set(
    stores
      .filter((store) => matches(store.name) || matches(store.category))
      .map((store) => store.storeId),
  )
  // The list omits menus. Only unmatched stores need a detail lookup.
  const details = useQueries({
    queries: stores
      .filter((store) => !storeIds.has(store.storeId))
      .map((store) => storeDetailQuery(String(store.storeId))),
  })
  for (const { data } of details) {
    if (data?.menus.some((menu) => matches(menu.name)))
      storeIds.add(data.storeId)
  }
  const results = stores.filter((store) => storeIds.has(store.storeId))
  const failures = details.filter((query) => query.isError && !query.data)
  return {
    results: sortStores(results, sort),
    isLoading: list.isPending || details.some((query) => query.isPending),
    isListError: list.isError && !list.data,
    isMenuError: failures.length > 0,
    retry: () => {
      if (list.isError) void list.refetch()
      for (const query of failures) void query.refetch()
    },
  }
}

export function sortStores(stores: StoreSummary[], sort: SearchSort) {
  if (sort === '기본순') return stores
  return [...stores].sort((a, b) => {
    if (sort === '가까운 순') return a.distanceMeters - b.distanceMeters
    if (sort === '별점 높은 순') return b.rating - a.rating
    return b.orderCount - a.orderCount
  })
}

export function formatDistance(meters: number) {
  return meters < 1000 ? meters + 'm' : (meters / 1000).toFixed(1) + 'km'
}
