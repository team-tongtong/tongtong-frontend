import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cancelOrder,
  displayStatus,
  orderListQuery,
  type OrderSummary,
} from './api'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

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

  it('취소 탭은 방 상태로 서버 목록을 제한하지 않고 내 취소 주문을 찾는다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        code: 'SUCCESS',
        message: '성공',
        data: {
          orders: [
            canceledOrder,
            { ...canceledOrder, orderId: 3, orderStatus: 'JOINED' },
          ],
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const options = orderListQuery('취소')
    const data = await new QueryClient().fetchQuery(options)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/orders',
      expect.anything(),
    )
    expect(options.select?.(data)).toEqual([canceledOrder])
  })

  it('취소는 내 주문 번호로 PATCH하고 서버의 거절 메시지를 전달한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json(
        {
          code: 'TEST_ERROR',
          message: '이미 모집이 마감됐어요.',
          data: null,
        },
        { status: 409 },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)
    await expect(cancelOrder(8)).rejects.toMatchObject({
      status: 409,
      message: '이미 모집이 마감됐어요.',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/orders/8/cancel',
      expect.objectContaining({ method: 'PATCH' }),
    )
  })
})
