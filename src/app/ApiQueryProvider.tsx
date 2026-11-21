import { useEffect, useState, type PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useToast } from '@/components/toast/useToast'
import { createQueryClient, NETWORK_ERROR_MESSAGE } from './query-client'

export function ApiQueryProvider({ children }: PropsWithChildren) {
  const showToast = useToast()
  const [client] = useState(() =>
    createQueryClient((message) => showToast(message, 'error')),
  )

  useEffect(() => {
    // 오프라인에서 일시 정지된 요청은 QueryCache의 onError를 호출하지 않는다.
    const notifyOffline = () => showToast(NETWORK_ERROR_MESSAGE, 'error')
    window.addEventListener('offline', notifyOffline)
    if (!navigator.onLine) notifyOffline()
    return () => window.removeEventListener('offline', notifyOffline)
  }, [showToast])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
