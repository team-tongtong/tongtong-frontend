import ddukzzim from '@/assets/logo-ddukzzim.png'
import mcdonalds from '@/assets/logo-mcdonalds.png'
import yeopgi from '@/assets/home/logo-yeopgi.png'
import type { OrderHistoryItem } from '@/components/order/OrderHistoryCard'

export const sampleOrderHistory: OrderHistoryItem[] = [
  {
    id: 'sample-history-ddukzzim',
    storeName: '두찜 - 까만찜닭',
    storeImage: ddukzzim,
    timeLabel: '16:00 예정',
    pickupSpot: '한양대학교 ERICA 정문',
    status: '모집완료',
    canEnterPickupCode: true,
  },
  {
    id: 'sample-history-mcdonalds',
    storeName: '맥도날드 안산고잔DT점',
    storeImage: mcdonalds,
    timeLabel: '16:30 예정',
    pickupSpot: '한양대학교 ERICA 행복관 1층',
    status: '모집중',
    canEnterPickupCode: false,
  },
  {
    id: 'sample-history-yeopgi',
    storeName: '동대문엽기떡볶이 - 엽기떡볶이',
    storeImage: yeopgi,
    timeLabel: '11/18',
    pickupSpot: '한양대학교 ERICA 정문',
    status: '배달 완료',
    canEnterPickupCode: false,
  },
]
