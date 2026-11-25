import ddukzzim from '@/assets/logo-ddukzzim.png'
import mcdonalds from '@/assets/logo-mcdonalds.png'
import yeopgi from '@/assets/home/logo-yeopgi.png'
import type { OrderDetail } from './OrderDetailPage'

export const sampleOrderHistory: OrderDetail[] = [
  {
    id: 'sample-history-ddukzzim',
    menus: [
      { name: '까만찜닭 (1인분)', quantity: 1 },
      { name: '공깃밥', quantity: 1 },
    ],
    menuAmount: 10000,
    deliveryFee: 500,
    portionFee: 500,
    paymentAmount: 11000,
    storeName: '두찜 - 까만찜닭',
    storeImage: ddukzzim,
    timeLabel: '16:00 예정',
    pickupSpot: '한양대학교 ERICA 정문',
    status: '모집완료',
    canEnterPickupCode: true,
  },
  {
    id: 'sample-history-mcdonalds',
    method: '아껴통',
    recruitment: '2/4명',
    paymentMethod: '카카오페이',
    menus: [
      { name: '불고기버거 세트', quantity: 2 },
      { name: '슈비버거 라지 세트', quantity: 1 },
    ],
    menuAmount: 26800,
    deliveryFee: 675,
    paymentAmount: 27475,
    storeName: '맥도날드 안산고잔DT점',
    storeImage: mcdonalds,
    timeLabel: '16:30 예정',
    pickupSpot: '한양대학교 ERICA 행복관 1층',
    status: '모집중',
    canEnterPickupCode: false,
  },
  {
    id: 'sample-history-yeopgi',
    menus: [
      { name: '로제떡볶이 (1인분)', quantity: 1 },
      { name: '주먹김밥', quantity: 1 },
    ],
    menuAmount: 6500,
    deliveryFee: 500,
    portionFee: 500,
    paymentAmount: 7500,
    storeName: '동대문엽기떡볶이 - 엽기떡볶이',
    storeImage: yeopgi,
    timeLabel: '11/18',
    pickupSpot: '한양대학교 ERICA 정문',
    status: '배달 완료',
    canEnterPickupCode: false,
  },
]
