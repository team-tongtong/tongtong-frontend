import { describe, expect, it } from 'vitest'
import { displayStatus, orderListQuery, type OrderSummary } from './api'

describe('주문 내역 상태 필터', () => {
  const canceledOrder: OrderSummary = {
    orderId: 1,
    roomId: 2,
    storeName: '가게',
    storeImageUrl: null,
    spotName: '스팟',
    track: 'INDIVIDUAL',
    status: 'RECRUITING',
    orderStatus: 'CANCELED',
    orderedAt: '2026-11-27T12:00:00',
    recruitDeadline: '2026-11-27T12:30:00',
  }

  it('방이 모집 중이어도 내가 취소한 주문은 전체와 취소 탭에만 표시한다', () => {
    const data = { orders: [canceledOrder] }
    for (const tab of ['전체', '취소'] as const) {
      expect(orderListQuery(tab).select?.(data)).toEqual([canceledOrder])
    }
    for (const tab of ['모집중', '조리중', '배달 완료'] as const) {
      expect(orderListQuery(tab).select?.(data)).toEqual([])
    }
  })

  it('방 전체가 취소된 경우에도 취소로 표시한다', () => {
    expect(displayStatus({ status: 'CANCELED', orderStatus: 'JOINED' })).toBe(
      '취소',
    )
  })
})
