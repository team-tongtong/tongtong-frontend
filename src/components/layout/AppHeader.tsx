import { BackButton } from './BackButton'
import styles from './AppHeader.module.css'

type AppHeaderProps = {
  title: string
  onBack?: () => void
  backLabel?: string
}

export function AppHeader({ title, onBack, backLabel }: AppHeaderProps) {
  return (
    <header className={styles.header} data-has-back={!!onBack}>
      {onBack && <BackButton onClick={onBack} label={backLabel} />}
      <h1>{title}</h1>
    </header>
  )
}
