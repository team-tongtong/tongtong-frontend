import { expect, it } from 'vitest'
import { sortStores } from './storeSearch'

const common = {
  category: '치킨',
  imageUrl: '',
  reviewCount: 0,
  minOrderAmount: 15000,
  deliveryFee: 2000,
  deliveryMinutes: 30,
}
const stores = [
  {
    ...common,
    storeId: 1,
    name: '두찜',
    rating: 4,
    orderCount: 3,
    distanceMeters: 200,
  },
  {
    ...common,
    storeId: 2,
    name: '가마치',
    rating: 3,
    orderCount: 5,
    distanceMeters: 100,
  },
  {
    ...common,
    storeId: 3,
    name: '동대문',
    rating: 5,
    orderCount: 8,
    distanceMeters: 300,
  },
]

it.each([
  ['기본순', ['가마치', '동대문', '두찜']],
  ['별점 높은 순', ['동대문', '두찜', '가마치']],
  ['주문 많은 순', ['동대문', '가마치', '두찜']],
  ['가까운 순', ['가마치', '두찜', '동대문']],
] as const)('%s으로 가게 검색 결과를 정렬한다', (sort, expected) => {
  expect(sortStores(stores, sort).map((store) => store.name)).toEqual(expected)
  expect(stores.map((store) => store.storeId)).toEqual([1, 2, 3])
})
