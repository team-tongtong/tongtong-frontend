import type { CSSProperties } from 'react'
import styles from './Loading.module.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
}

export function Skeleton({ width = '100%', height = '1em' }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={styles.skeleton}
      style={{ width, height }}
    />
  )
}
