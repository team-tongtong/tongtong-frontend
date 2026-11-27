import { describe, expect, it } from 'vitest'
import { splitRoomCost } from './roomShare'

describe('나눠통 분담금', () => {
  it('메뉴와 배달비 합계가 나누어떨어지면 통통 부담은 0원이다', () => {
    expect(splitRoomCost(10000, 3500, 3)).toEqual({
      perPerson: 4500,
      coveredByTongtong: 0,
    })
  })
  it('참여자의 분담금을 원 단위로 내리고 방 전체의 잔액을 통통이 부담한다', () => {
    expect(splitRoomCost(10000, 3000, 3)).toEqual({
      perPerson: 4333,
      coveredByTongtong: 1,
    })
  })
})
