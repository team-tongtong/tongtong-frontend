import { apiRequest } from '@/api/client'

interface PopularKeywordsResponse {
  keywords: { rank: number; keyword: string }[]
}

export function getPopularKeywords(signal: AbortSignal) {
  return apiRequest<PopularKeywordsResponse>(
    '/api/v1/search/popular-keywords',
    {
      signal,
    },
  )
}
