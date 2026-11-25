import type { GroupOrderDetail } from './sampleGroupOrders'

export function deliveryShare(room: GroupOrderDetail) {
  if (room.deliveryFeePerPerson != null) return room.deliveryFeePerPerson
  if (
    room.deliveryFeeTotal != null &&
    room.capacity > 0 &&
    room.deliveryFeeTotal % room.capacity === 0
  ) {
    return room.deliveryFeeTotal / room.capacity
  }
}
