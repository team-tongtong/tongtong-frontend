import type { GroupOrderDetail } from './sampleGroupOrders'

export function selectRoomMenu(
  room: GroupOrderDetail,
  menu: GroupOrderDetail['menus'][number],
) {
  return {
    menuId: menu.id,
    storeId: room.id,
    storeName: room.name,
    name: menu.name,
    price: menu.price,
    minimumOrderAmount: room.minimumOrderAmount,
    quantity: 1,
  }
}

export type RoomMenuSelection = ReturnType<typeof selectRoomMenu>
