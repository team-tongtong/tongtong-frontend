import type { GroupOrderDetail } from './sampleGroupOrders'

export const popularTerms = [
  '교촌치킨',
  'BBQ',
  'bhc',
  '엽기떡볶이',
  '지코바 숯불치킨',
  '족발',
  '맥도날드',
  '신전 떡볶이',
  '두찜',
  '버거킹',
]

export const sortOptions = [
  '기본순',
  '주문 많은 순',
  '별점 높은 순',
  '가까운 순',
  '찜 많은 순',
] as const
export type SearchSort = (typeof sortOptions)[number]

type SearchInfo = {
  category: string
  distance: number
  orders: number
  favorites: number
  rating: number
  reviewCount: number
  minutes: number
  minimum: number
  fee: number
}

// Search fixtures stay separate from recruitment-room and payment data.
const sampleStoreInfo: Record<string, SearchInfo | undefined> = {
  'sample-1': {
    category: '햄버거',
    distance: 1600,
    orders: 320,
    favorites: 82,
    rating: 4.2,
    reviewCount: 504,
    minutes: 20,
    minimum: 14000,
    fee: 2700,
  },
  'sample-2': {
    category: '찜닭',
    distance: 1300,
    orders: 260,
    favorites: 95,
    rating: 4.9,
    reviewCount: 749,
    minutes: 32,
    minimum: 25000,
    fee: 2000,
  },
  'sample-3': {
    category: '분식',
    distance: 650,
    orders: 180,
    favorites: 75,
    rating: 4.8,
    reviewCount: 184,
    minutes: 25,
    minimum: 12000,
    fee: 1500,
  },
  'sample-4': {
    category: '분식',
    distance: 950,
    orders: 240,
    favorites: 68,
    rating: 4.9,
    reviewCount: 259,
    minutes: 30,
    minimum: 14000,
    fee: 2000,
  },
}

function normalize(term: string) {
  return term.normalize('NFC').toLowerCase().replace(/\s+/g, '')
}

export function searchStores(
  stores: GroupOrderDetail[],
  term: string,
  sort: SearchSort,
) {
  const keyword = normalize(term)
  const results = stores
    .map((store) => ({ store, info: sampleStoreInfo[store.id] }))
    .filter(({ store, info }) =>
      [
        store.name,
        store.storeDetails?.name,
        info?.category,
        ...store.menus.map((menu) => menu.name),
      ].some((value) => value && normalize(value).includes(keyword)),
    )
  if (sort === '기본순') return results

  const field = {
    '주문 많은 순': 'orders',
    '별점 높은 순': 'rating',
    '가까운 순': 'distance',
    '찜 많은 순': 'favorites',
  } as const
  const key = field[sort]
  return results.sort((a, b) => {
    if (!a.info || !b.info) return Number(!!b.info) - Number(!!a.info)
    return sort === '가까운 순'
      ? a.info[key] - b.info[key]
      : b.info[key] - a.info[key]
  })
}

export function formatDistance(meters: number) {
  return meters < 1000 ? meters + 'm' : (meters / 1000).toFixed(1) + 'km'
}
