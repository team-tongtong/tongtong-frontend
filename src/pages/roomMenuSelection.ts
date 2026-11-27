import type { StoreDetailResponse } from '@/features/stores/api'

type StoreMenu = {
  id: number
  name: string
  price: number
  portionable?: boolean
  description?: string
  photo?: string
  imageUrl?: string
}

export type MenuStore = {
  id: number
  name: string
  image: string
  minimumOrderAmount?: number | null
  deliveryFeeTotal?: number
  menus: StoreMenu[]
  storeDetails?: {
    name: string
    hero?: string
    rating: number
    reviewCount: number
    lastOrder: string
    deliveryMinutes: number
    reviews: { stars: number; text: string }[]
  }
}

export function toMenuStore(store: StoreDetailResponse): MenuStore {
  return {
    id: store.storeId,
    name: store.name,
    image: store.imageUrl,
    minimumOrderAmount: store.minOrderAmount,
    deliveryFeeTotal: store.deliveryFee,
    storeDetails: {
      name: store.name,
      rating: store.rating,
      reviewCount: store.reviewCount,
      lastOrder: store.lastOrderTime,
      deliveryMinutes: store.deliveryMinutes,
      reviews: store.reviews.map((review) => ({
        stars: review.rating,
        text: review.content,
      })),
    },
    menus: store.menus.map(({ menuId, ...menu }) => ({ id: menuId, ...menu })),
  }
}

export function selectRoomMenu(room: MenuStore, menu: StoreMenu) {
  return {
    menuId: menu.id,
    storeId: room.id,
    storeName: room.storeDetails?.name ?? room.name,
    name: menu.name,
    price: menu.price,
    portionable: menu.portionable === true,
    minimumOrderAmount: room.minimumOrderAmount,
    deliveryFeeTotal: room.deliveryFeeTotal,
    quantity: 1,
  }
}

export type RoomMenuSelection = ReturnType<typeof selectRoomMenu>

export function canShareMenus(menus: readonly RoomMenuSelection[]) {
  const menu = menus[0]
  return menus.length === 1 && menu?.quantity === 1 && menu.portionable === true
}
