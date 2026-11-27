// 공유 메뉴와 배달비를 합한 금액에서 한 번만 원 단위로 내린다.
export function splitRoomCost(food: number, delivery: number, people: number) {
  const amount = food + delivery
  return {
    perPerson: Math.floor(amount / people),
    coveredByTongtong: amount % people,
  }
}
