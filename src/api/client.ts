import type { ApiResponse } from '@/types/api'

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export class NetworkError extends TypeError {
  constructor(cause: TypeError) {
    super(cause.message, { cause })
    this.name = 'NetworkError'
  }
}

function isResponseObject(
  value: unknown,
): value is Partial<Record<keyof ApiResponse<unknown>, unknown>> {
  return typeof value === 'object' && value !== null
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
  let response: Response
  let payload: unknown
  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, '')}${path}`, {
      ...options,
      headers,
    })
    payload = await response.json().catch((error: unknown) => {
      if (error instanceof SyntaxError) return null
      throw error
    })
  } catch (error) {
    if (options.signal?.aborted) throw options.signal.reason
    if (error instanceof TypeError) throw new NetworkError(error)
    throw error
  }
  const body = isResponseObject(payload) ? payload : {}
  const code = typeof body.code === 'string' ? body.code : undefined
  const message = typeof body.message === 'string' ? body.message : undefined

  if (!response.ok) {
    throw new ApiError(message ?? '요청에 실패했습니다.', response.status, code)
  }
  if (code === undefined || message === undefined || !('data' in body)) {
    throw new ApiError('서버 응답 형식을 확인할 수 없습니다.', response.status)
  }
  return body.data as T
}
