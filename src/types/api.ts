/** Backend: global/common/ApiResponse.java */
export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

/** Backend offset pagination. page starts at 0. */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
