import type { ApiResponse } from '@/types/api'

export class ApiError extends Error {
  readonly status: number
  readonly code: number

  constructor(message: string, status: number, code = status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof value.success === 'boolean' &&
    'code' in value &&
    typeof value.code === 'number' &&
    'message' in value &&
    typeof value.message === 'string' &&
    'data' in value
  )
}

/** path includes /api/v1; authentication will follow the backend contract. */
export async function apiRequest<T>(
  path: `/api/v1/${string}`,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!baseUrl) throw new Error('VITE_API_BASE_URL 환경변수를 설정해 주세요.')
  const headers = new Headers(options.headers)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}${path}`, {
    ...options,
    headers,
  })
  const payload: unknown = await response.json().catch(() => null)
  if (!isApiResponse(payload)) {
    throw new ApiError('서버 응답 형식을 확인할 수 없습니다.', response.status)
  }
  if (!response.ok || !payload.success) {
    throw new ApiError(payload.message, response.status, payload.code)
  }
  return payload.data as T
}
