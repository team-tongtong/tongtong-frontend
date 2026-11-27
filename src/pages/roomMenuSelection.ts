import type { GroupOrderDetail } from './sampleGroupOrders'

export function selectRoomMenu(
  room: GroupOrderDetail,
  menu: GroupOrderDetail['menus'][number],
) {
  return {
    menuId: menu.id,
    storeId: room.id,
    storeName: room.storeDetails?.name ?? room.name,
    name: menu.name,
    price: menu.price,
    portionable: menu.portionable === true,
    minimumOrderAmount: room.minimumOrderAmount,
    deliveryFeeTotal: room.deliveryFeeTotal,
    portionFeePerPerson: room.portionFeePerPerson,
    quantity: 1,
  }
}

export type RoomMenuSelection = ReturnType<typeof selectRoomMenu>

export function canShareMenus(menus: readonly RoomMenuSelection[]) {
  const menu = menus[0]
  return menus.length === 1 && menu?.quantity === 1 && menu.portionable === true
}
