import styles from './Loading.module.css'

interface LoadingSpinnerProps {
  label?: string
  size?: number
}

export function LoadingSpinner({
  label = '불러오는 중',
  size = 24,
}: LoadingSpinnerProps) {
  return (
    <span role="status" className={styles.spinnerWrapper}>
      <span
        aria-hidden="true"
        className={styles.spinner}
        style={{ width: size, height: size }}
      />
      <span className={styles.srOnly}>{label}</span>
    </span>
  )
}
