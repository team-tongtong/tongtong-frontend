import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './client'

function mockResponse(body: unknown, status = 200) {
  return vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('백엔드 응답 처리', () => {
  it('성공 응답에서 data를 반환하고 JSON 헤더를 전달한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080/')
    mockResponse({ code: 'SUCCESS', message: '성공', data: { id: 1 } }, 201)
    await expect(
      apiRequest('/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({ name: '통통' }),
      }),
    ).resolves.toEqual({ id: 1 })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/users',
      expect.objectContaining({ method: 'POST' }),
    )
    const options = vi.mocked(fetch).mock.calls[0]?.[1]
    expect(new Headers(options?.headers).get('Content-Type')).toBe(
      'application/json',
    )
  })

  it('모집방 목록 조회에 성공하면 빈 목록도 그대로 반환한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    mockResponse({
      code: 'SUCCESS',
      message: '요청에 성공했습니다.',
      data: { rooms: [] },
    })
    await expect(apiRequest('/api/v1/rooms')).resolves.toEqual({ rooms: [] })
  })

  it('없는 모집방의 오류 코드와 메시지를 보존한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    mockResponse(
      {
        code: 'ROOM_NOT_FOUND',
        message: '모집방을 찾을 수 없어요.',
        data: null,
      },
      404,
    )
    await expect(apiRequest('/api/v1/rooms/0')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'ROOM_NOT_FOUND',
      message: '모집방을 찾을 수 없어요.',
    })
  })

  it('성공 응답에 data가 빠지면 형식 오류를 전달한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    mockResponse({ code: 'SUCCESS', message: '성공' })
    await expect(apiRequest('/api/v1/rooms')).rejects.toThrow(
      '서버 응답 형식을 확인할 수 없습니다.',
    )
  })

  it('프록시의 HTML 오류 응답도 ApiError로 전달한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('<html>Bad gateway</html>', { status: 502 }),
        ),
    )
    await expect(apiRequest('/api/v1/users')).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
    })
  })

  it('FormData의 Content-Type은 브라우저가 설정하도록 둔다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    mockResponse({ code: 'SUCCESS', message: '성공', data: null })
    await apiRequest('/api/v1/users', { method: 'POST', body: new FormData() })
    const options = vi.mocked(fetch).mock.calls[0]?.[1]
    expect(new Headers(options?.headers).has('Content-Type')).toBe(false)
  })

  it('설정이 없으면 요청 전에 오류를 반환한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await expect(apiRequest('/api/v1/users')).rejects.toThrow(
      'VITE_API_BASE_URL',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('요청 취소 신호와 네트워크 오류를 호출자에게 전달한다', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    const controller = new AbortController()
    const error = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))
    await expect(
      apiRequest('/api/v1/users', { signal: controller.signal }),
    ).rejects.toBe(error)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    )
  })
})
