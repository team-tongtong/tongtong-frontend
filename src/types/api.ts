/** Backend: global/common/ApiResponse.java */
export type ApiResponse<T> =
  | { success: true; code: number; message: string; data: T }
  | { success: false; code: number; message: string; data: null }

/** Backend offset pagination. page starts at 0. */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
