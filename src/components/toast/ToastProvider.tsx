import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import { ToastContext, type ToastType } from './useToast'
import styles from './Toast.module.css'

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
  } | null>(null)
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => {
      setToast((current) => (current === toast ? null : current))
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={styles.viewport} role="status" aria-atomic="true">
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
