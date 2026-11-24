import { orderMethodLabels } from '@/components/group-order/orderMethod'
import { Link } from 'react-router'
import styles from './GroupOrderListItem.module.css'

export interface GroupOrderSummary {
  id: string
  name: string
  image: string
  method: keyof typeof orderMethodLabels
  orderTime: string
  pickupSpot: string
  participants: number
  capacity: number
  avatars: string[]
}

export function GroupOrderListItem({ room }: { room: GroupOrderSummary }) {
  return (
    <Link
      className={styles.item}
      to={`/rooms/${encodeURIComponent(room.id)}`}
      state={{ fromHome: true }}
    >
      <img className={styles.logo} src={room.image} alt="" />
      <span className={styles.info}>
        <span className={styles.tags}>
          <span>{orderMethodLabels[room.method]}</span>
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
    </Link>
  )
}
