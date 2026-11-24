import type { GroupOrderSummary } from '@/components/group-order/GroupOrderListItem'
import mcdonalds from '@/assets/logo-mcdonalds.png'
import ddukzzim from '@/assets/logo-ddukzzim.png'
import cat from '@/assets/character-cat-face.png'
import rabbit from '@/assets/character-rabbit-face.png'

export const sampleGroupOrders: GroupOrderSummary[] = [
  {
    id: 'sample-1',
    name: '맥도날드 안산고잔DT점',
    image: mcdonalds,
    method: '각자 담기',
    orderTime: '16:00',
    pickupSpot: '한양대학교 ERICA 행복관 1층',
    participants: 2,
    capacity: 4,
    avatars: [cat, rabbit],
  },
  {
    id: 'sample-2',
    name: '두찜 - 까만찜닭',
    image: ddukzzim,
    method: '내 몫 담기',
    orderTime: '16:30',
    pickupSpot: '한양대학교 ERICA 정문',
    participants: 3,
    capacity: 4,
    avatars: [rabbit, cat, rabbit],
  },
]
