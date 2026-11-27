import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError, NetworkError } from '@/api/client'

export const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인해 주세요.'

export function createQueryClient(notify: (message: string) => void) {
  function handleError(error: unknown) {
    if (error instanceof NetworkError) {
      notify(NETWORK_ERROR_MESSAGE)
    } else if (
      error instanceof ApiError &&
      error.status >= 500 &&
      error.status < 600
    ) {
      notify('잠시 후 다시 시도해 주세요.')
    }
  }

  return new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}
