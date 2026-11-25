import { queryOptions } from '@tanstack/react-query'
import sampleUrl from './sampleGroupOrders.json?url&no-inline'
import type { GroupOrderSummary } from '@/components/group-order/GroupOrderListItem'
import mcdonalds from '@/assets/logo-mcdonalds.png'
import ddukzzim from '@/assets/logo-ddukzzim.png'
import paw from '@/assets/character-paw.png'
import rabbit from '@/assets/character-rabbit-face.png'
import sinjeon from '@/assets/home/logo-sinjeon.png'
import yeopgi from '@/assets/home/logo-yeopgi.png'

export const pickupSpots = ['ERICA 정문', '기숙사', '셔틀콕'] as const
export type PickupSpot = (typeof pickupSpots)[number]

const logos = { mcdonalds, ddukzzim, sinjeon, yeopgi }
const avatars = { rabbit, paw }

type OrderMenu = { id: string; name: string; price: number }

type SampleGroupOrder = Omit<GroupOrderSummary, 'image' | 'avatars'> & {
  menus: OrderMenu[]
  minimumOrderAmount?: number | null
  deliveryFeePerPerson?: number | null
  sharedMenu?: { name: string; pricePerPerson: number; image?: 'blackJjimdak' }
  spot: PickupSpot
  image: keyof typeof logos
  avatars: (keyof typeof avatars)[]
}

async function loadSampleGroupOrders(signal: AbortSignal) {
  const response = await fetch(sampleUrl, { signal })
  if (!response.ok) throw new Error('모집방 목록을 불러오지 못했어요.')
  const rows: SampleGroupOrder[] = await response.json()
  return rows.map((room) => ({
    ...room,
    image: logos[room.image],
    avatars: room.avatars.map((avatar) => avatars[avatar]),
  }))
}

export type GroupOrderDetail = Awaited<
  ReturnType<typeof loadSampleGroupOrders>
>[number]

export const sampleGroupOrdersQuery = queryOptions({
  queryKey: ['group-orders', 'sample', sampleUrl],
  queryFn: ({ signal }) => loadSampleGroupOrders(signal),
  staleTime: Infinity,
  networkMode: 'always',
})
