import type { GroupOrderSummary } from '@/components/group-order/GroupOrderListItem'
import mcdonalds from '@/assets/logo-mcdonalds.png'
import ddukzzim from '@/assets/logo-ddukzzim.png'
import paw from '@/assets/character-paw.png'
import rabbit from '@/assets/character-rabbit-face.png'
import sinjeon from '@/assets/home/logo-sinjeon.png'
import yeopgi from '@/assets/home/logo-yeopgi.png'

export const pickupSpots = ['ERICA 정문', '기숙사', '셔틀콕'] as const
export type PickupSpot = (typeof pickupSpots)[number]

export const sampleGroupOrders: (GroupOrderSummary & { spot: PickupSpot })[] = [
  {
    id: 'sample-1',
    name: '맥도날드 안산고잔DT점',
    image: mcdonalds,
    method: '각자 담기',
    orderTime: '16:00',
    pickupSpot: '한양대학교 ERICA 행복관 1층',
    spot: '기숙사',
    participants: 2,
    capacity: 4,
    avatars: [rabbit, paw],
  },
  {
    id: 'sample-2',
    name: '두찜 - 까만찜닭',
    image: ddukzzim,
    method: '내 몫 담기',
    orderTime: '16:30',
    pickupSpot: '한양대학교 ERICA 정문',
    spot: 'ERICA 정문',
    participants: 3,
    capacity: 4,
    avatars: [rabbit, paw, rabbit],
  },
  {
    id: 'sample-3',
    name: '신전 떡볶이',
    image: sinjeon,
    method: '각자 담기',
    orderTime: '17:00',
    pickupSpot: '한양대학교 ERICA 정문',
    spot: 'ERICA 정문',
    participants: 3,
    capacity: 4,
    avatars: [rabbit, paw, rabbit],
  },
  {
    id: 'sample-4',
    name: '엽기떡볶이 - 로제떡볶이',
    image: yeopgi,
    method: '내 몫 담기',
    orderTime: '17:30',
    pickupSpot: '한양대학교 ERICA 정문',
    spot: 'ERICA 정문',
    participants: 3,
    capacity: 4,
    avatars: [rabbit, paw, rabbit],
  },
]
