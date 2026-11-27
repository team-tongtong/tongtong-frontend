import arrow from '@/assets/search/back.svg'
import whiteArrow from '@/assets/store/back.svg'
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
      aria-label={label}
      onClick={onClick}
    >
      <img src={onPhoto ? whiteArrow : arrow} alt="" width={28} height={28} />
    </button>
  )
}
