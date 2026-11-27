import { describe, expect, it } from 'vitest'
import { splitRoomCost } from './roomShare'

describe('나눠통 분담금', () => {
  it('메뉴값과 배달비가 각각 나누어떨어지면 통통 부담은 0원이다', () => {
    expect(splitRoomCost(10500, 3000, 3)).toEqual({
      perPerson: 4500,
      coveredByTongtong: 0,
    })
  })
  it('합계가 나누어떨어져도 두 항목을 각각 내리고 나머지를 합산한다', () => {
    expect(splitRoomCost(10000, 3500, 3)).toEqual({
      perPerson: 4499,
      coveredByTongtong: 3,
    })
  })
  it('참여자의 분담금을 원 단위로 내리고 방 전체의 잔액을 통통이 부담한다', () => {
    expect(splitRoomCost(10000, 3000, 3)).toEqual({
      perPerson: 4333,
      coveredByTongtong: 1,
    })
  })
})
