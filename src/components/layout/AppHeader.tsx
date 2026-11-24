import styles from './AppHeader.module.css'

type AppHeaderProps = {
  title: string
  onBack: () => void
  backLabel?: string
}

export function AppHeader({
  title,
  onBack,
  backLabel = '뒤로가기',
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <button type="button" aria-label={backLabel} onClick={onBack}>
        <span aria-hidden="true">‹</span>
      </button>
      <h1>{title}</h1>
    </header>
  )
}
