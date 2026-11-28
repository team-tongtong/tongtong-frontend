import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readOrderStatus } from '@/components/filter/orderStatuses'
import {
  applyPickupResult,
  cancelOrder,
  displayStatus,
  orderDetailQuery,
  orderListQuery,
  pickupOrder,
  type OrderDetail,
  type OrderSummary,
} from './api'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('픽업 코드 입력', () => {
  it('잘못된 코드의 오류를 전달하고 앞자리 0을 유지한 코드로 다시 요청한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    const result = { orderId: 31, orderStatus: 'PICKED_UP' }
    const error = {
      code: 'INVALID_PICKUP_CODE',
      message: '픽업 코드가 맞지 않아요.',
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json(error, { status: 400 }))
      .mockResolvedValueOnce(
        Response.json({ code: 'SUCCESS', message: '성공', data: result }),
      )
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      pickupOrder({ orderId: 31, code: '00000' }),
    ).rejects.toMatchObject(error)
    await expect(pickupOrder({ orderId: 31, code: '04821' })).resolves.toEqual(
      result,
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:8080/api/v1/orders/31/pickup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: '04821' }),
      }),
    )
  })

  it('같은 방의 주문 중 수령한 주문만 목록과 상세에서 갱신한다', () => {
    const client = new QueryClient()
    const order: OrderSummary = {
      orderId: 31,
      roomId: 12,
      storeName: '가게',
      storeImageUrl: null,
      spotName: '스팟',
      track: 'INDIVIDUAL',
      status: 'ARRIVED',
      orderStatus: 'JOINED',
      orderedAt: '2026-11-27T12:00:00',
      recruitDeadline: '2026-11-27T12:30:00',
    }
    const other = { ...order, orderId: 32 }
    const detail: OrderDetail = {
      ...order,
      currentParticipants: 2,
      maxParticipants: 2,
      items: [],
      totalAmount: 5000,
      paymentMethod: 'CARD',
      cancelable: false,
    }
    const tabs = [orderListQuery('전체'), orderListQuery('배달 완료')]
    for (const tab of tabs)
      client.setQueryData(tab.queryKey, { orders: [order, other] })
    const detailKey = orderDetailQuery('31').queryKey
    client.setQueryData(detailKey, detail)
    const result = { orderId: 31, orderStatus: 'PICKED_UP' } as const
    applyPickupResult(client, result)
    for (const tab of tabs) {
      expect(client.getQueryData(tab.queryKey)?.orders).toEqual([
        { ...order, ...result },
        other,
      ])
    }
    expect(client.getQueryData(detailKey)).toEqual({ ...detail, ...result })
  })
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
    for (const tab of ['모집중', '모집 완료', '배달 완료'] as const) {
      expect(orderListQuery(tab).select?.(data)).toEqual([])
    }
  })

  it('기존 조리중 링크와 모집 완료 링크는 같은 모집 완료 주문을 표시한다', () => {
    const order: OrderSummary = {
      ...canceledOrder,
      orderStatus: 'JOINED',
      status: 'RECRUIT_COMPLETED',
    }
    for (const value of ['조리중', '모집 완료']) {
      const tab = readOrderStatus(value)
      expect(tab).toBe('모집 완료')
      const query = orderListQuery(tab)
      expect(query.queryKey).toEqual(['orders', 'list', 'RECRUIT_COMPLETED'])
      expect(query.select?.({ orders: [order, canceledOrder] })).toEqual([
        order,
      ])
    }
  })

  it('방 전체가 취소된 경우에도 취소로 표시한다', () => {
    expect(displayStatus({ status: 'CANCELED', orderStatus: 'JOINED' })).toBe(
      '취소',
    )
  })

  it('취소 탭은 status=CANCELED로 조회하고 개인 취소와 방 전체 취소를 모두 표시한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    const orderInCanceledRoom: OrderSummary = {
      ...canceledOrder,
      orderId: 3,
      roomId: 4,
      status: 'CANCELED',
      orderStatus: 'JOINED',
    }
    const orders = [canceledOrder, orderInCanceledRoom]
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        code: 'SUCCESS',
        message: '성공',
        data: { orders },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const options = orderListQuery('취소')
    const data = await new QueryClient().fetchQuery(options)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/orders?status=CANCELED',
      expect.anything(),
    )
    expect(options.select?.(data)).toEqual(orders)
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
