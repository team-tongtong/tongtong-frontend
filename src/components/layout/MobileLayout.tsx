import type { PropsWithChildren } from 'react'
import styles from './MobileLayout.module.css'

export function MobileLayout({ children }: PropsWithChildren) {
  return <div className={styles.container}>{children}</div>
}
