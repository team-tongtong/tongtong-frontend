import styles from './GroupOrderListItem.module.css'

export interface GroupOrderSummary {
  id: string
  name: string
  image: string
  method: '각자 담기' | '내 몫 담기'
  orderTime: string
  pickupSpot: string
  participants: number
  capacity: number
  avatars: string[]
}

interface Props {
  room: GroupOrderSummary
  selected: boolean
  onSelect: (id: string) => void
}

export function GroupOrderListItem({ room, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      className={styles.item}
      aria-pressed={selected}
      onClick={() => onSelect(room.id)}
    >
      <img className={styles.logo} src={room.image} alt="" />
      <span className={styles.info}>
        <span className={styles.tags}>
          <span>{room.method}</span>
          <time
            dateTime={room.orderTime}
            aria-label={`주문 예정 ${room.orderTime}`}
          >
            {room.orderTime}
          </time>
        </span>
        <strong className={styles.name}>{room.name}</strong>
        <span className={styles.spot}>{room.pickupSpot}</span>
      </span>
      <span className={styles.members}>
        <span className={styles.avatars} aria-hidden="true">
          {room.avatars.slice(0, 3).map((src, index) => (
            <img key={index} src={src} alt="" />
          ))}
        </span>
        <span
          aria-label={`정원 ${room.capacity}명 중 ${room.participants}명 참여`}
        >
          {room.participants}/{room.capacity}
        </span>
      </span>
    </button>
  )
}
