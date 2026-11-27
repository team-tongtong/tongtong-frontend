import arrow from '@/assets/search/back.svg'
import styles from './BackButton.module.css'

type BackButtonProps = {
  onClick: () => void
  label?: string
  onPhoto?: boolean
}

export function BackButton({
  onClick,
  label = '뒤로가기',
  onPhoto = false,
}: BackButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-on-photo={onPhoto || undefined}
      aria-label={label}
      onClick={onClick}
    >
      {!onPhoto && <img src={arrow} alt="" width={28} height={28} />}
    </button>
  )
}
