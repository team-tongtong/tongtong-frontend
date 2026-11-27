export function splitRoomCost(food: number, delivery: number, people: number) {
  return {
    perPerson: Math.floor(food / people) + Math.floor(delivery / people),
    coveredByTongtong: (food % people) + (delivery % people),
  }
}
