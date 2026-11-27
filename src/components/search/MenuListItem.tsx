import add from '@/assets/search/add.svg'
import styles from './SearchList.module.css'

type MenuListItemProps = {
  image: string
  name: string
  description: string
  price: number
  disabled?: boolean
  selected?: boolean
  onAdd: () => void
}

export function MenuListItem({
  image,
  name,
  description,
  price,
  onAdd,
  disabled,
  selected,
}: MenuListItemProps) {
  return (
    <div className={styles.menu}>
      <div className={styles.copy}>
        <strong className={styles.menuName}>{name}</strong>
        <span className={styles.description}>{description}</span>
        <span className={styles.price}>{price.toLocaleString('ko-KR')}원</span>
      </div>
      <div className={styles.photo}>
        <img className={styles.food} src={image} alt="" />
        <button
          type="button"
          disabled={disabled}
          aria-pressed={selected}
          aria-label={`${name} ${selected ? '선택 해제' : '추가'}`}
          onClick={onAdd}
        >
          {selected ? '✓' : <img src={add} alt="" />}
        </button>
      </div>
    </div>
  )
}
