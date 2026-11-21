import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'error'
type ShowToast = (message: string, type: ToastType) => void

export const ToastContext = createContext<ShowToast | null>(null)

export function useToast() {
  const showToast = useContext(ToastContext)
  if (!showToast)
    throw new Error('ToastProvider 안에서 useToast를 사용해 주세요.')
  return showToast
}
