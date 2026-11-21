import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '@/api/client'
import { createQueryClient } from './query-client'

describe('전역 API 에러 처리', () => {
  const notify = vi.fn<(message: string) => void>()
  let client: ReturnType<typeof createQueryClient>

  beforeEach(() => {
    notify.mockClear()
    client = createQueryClient(notify)
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
  })
  afterEach(() => {
    client.clear()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('조회 중 연결에 실패하면 네트워크 토스트를 한 번 표시한다', async () => {
    const cause = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(cause))

    await expect(
      client.fetchQuery({
        queryKey: ['orders'],
        queryFn: () => apiRequest('/api/v1/orders'),
      }),
    ).rejects.toMatchObject({ name: 'NetworkError', cause })
    expect(notify.mock.calls).toEqual([['네트워크 연결을 확인해 주세요.']])
  })

  it.each([
    [502, '<html>Bad gateway</html>'],
    [
      200,
      JSON.stringify({
        success: false,
        code: 500,
        message: '서버 오류',
        data: null,
      }),
    ],
  ])(
    '변경 요청의 서버 오류를 공통 처리한다 (HTTP %s)',
    async (status, body) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response(body, { status })),
      )
      const mutation = client.getMutationCache().build(client, {
        mutationFn: () => apiRequest('/api/v1/orders', { method: 'POST' }),
      })

      await expect(mutation.execute(undefined)).rejects.toMatchObject({
        name: 'ApiError',
      })
      expect(notify.mock.calls).toEqual([['잠시 후 다시 시도해 주세요.']])
    },
  )

  it.each([401, 409])(
    'HTTP %i는 화면에서 처리할 수 있도록 오류를 전달한다',
    async (status) => {
      const body = {
        success: false,
        code: status,
        message: '요청 실패',
        data: null,
      }
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(Response.json(body, { status })),
      )

      await expect(
        client.fetchQuery({
          queryKey: ['rooms'],
          queryFn: () => apiRequest('/api/v1/rooms'),
        }),
      ).rejects.toMatchObject({ status, message: '요청 실패' })
      expect(notify).not.toHaveBeenCalled()
    },
  )

  it('본문을 읽다가 취소된 요청에는 토스트를 표시하지 않는다', async () => {
    const abort = new DOMException('Aborted', 'AbortError')
    const response = new Response()
    vi.spyOn(response, 'json').mockRejectedValue(abort)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    await expect(
      client.fetchQuery({
        queryKey: ['rooms'],
        queryFn: () => apiRequest('/api/v1/rooms'),
      }),
    ).rejects.toBe(abort)
    expect(notify).not.toHaveBeenCalled()
  })

  it('화면 코드의 TypeError는 네트워크 오류로 표시하지 않는다', async () => {
    const error = new TypeError('invalid data')
    await expect(
      client.fetchQuery({
        queryKey: ['rooms'],
        queryFn: () => {
          throw error
        },
      }),
    ).rejects.toBe(error)
    expect(notify).not.toHaveBeenCalled()
  })
})
