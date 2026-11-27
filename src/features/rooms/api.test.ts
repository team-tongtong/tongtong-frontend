import { QueryClient } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { createRoom, joinRoom, refreshRoomsAndOrders } from './api'

const base = 'https://api.example.test'
function mockApi(status: number, data: unknown, message = '성공') {
  vi.stubEnv('VITE_API_BASE_URL', base)
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        code: status === 201 ? 'SUCCESS' : 'ROOM_CLOSED',
        message,
        data,
      }),
      { status },
    ),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

it.each([
  { track: 'PORTION', sharedMenu: { menuId: 10 }, items: [] },
  {
    track: 'INDIVIDUAL',
    sharedMenu: null,
    items: [{ menuId: 20, quantity: 2 }],
  },
] as const)(
  '모집방 생성 시 $track 요청과 서버의 방·주문 ID를 보존한다',
  async (menus) => {
    const fetchMock = mockApi(201, { roomId: 23, orderId: 32 })
    const request = {
      ...menus,
      storeId: 3,
      spotId: 4,
      maxParticipants: 2,
      recruitMinutes: 10,
      paymentMethod: 'CARD',
    } as const
    await expect(createRoom(request)).resolves.toEqual({
      roomId: 23,
      orderId: 32,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      base + '/api/v1/rooms',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request),
      }),
    )
  },
)

it('나눠통 참여에서 개별 메뉴가 없어도 선택한 결제 수단을 전송한다', async () => {
  const fetchMock = mockApi(201, { orderId: 32 })
  const request = { items: [], paymentMethod: 'TOSS_PAY' as const }
  await expect(joinRoom(23, request)).resolves.toEqual({ orderId: 32 })
  expect(fetchMock).toHaveBeenCalledWith(
    base + '/api/v1/rooms/23/orders',
    expect.objectContaining({ method: 'POST', body: JSON.stringify(request) }),
  )
})

it('마감 직후 참여하면 409와 서버의 안내 문구를 보존한다', async () => {
  mockApi(409, null, '모집이 마감되었어요.')
  await expect(
    joinRoom(23, {
      items: [{ menuId: 2, quantity: 1 }],
      paymentMethod: 'CARD',
    }),
  ).rejects.toMatchObject({ status: 409, message: '모집이 마감되었어요.' })
})

it('홈 목록·모집방 상세·모든 주문 탭을 다시 조회할 수 있게 한다', () => {
  const client = new QueryClient()
  const keys = [
    ['rooms', 'list'],
    ['rooms', 'detail', '23'],
    ['orders', 'list', '전체'],
    ['orders', 'list', '모집중'],
  ]
  keys.forEach((key) => client.setQueryData(key, {}))
  refreshRoomsAndOrders(client)
  keys.forEach((key) =>
    expect(client.getQueryState(key)?.isInvalidated).toBe(true),
  )
  client.clear()
})
