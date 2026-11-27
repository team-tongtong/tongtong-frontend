import type { RoomSummary } from '@/features/rooms/api'
import { RecruitDeadline } from './RecruitDeadline'
import rabbit from '@/assets/character-rabbit-face.png'
import paw from '@/assets/character-paw.png'
import { trackLabels } from '@/components/group-order/orderMethod'
import { Link } from 'react-router'
import styles from './GroupOrderListItem.module.css'

const participantIcons = [rabbit, paw, rabbit]

export function GroupOrderListItem({ room }: { room: RoomSummary }) {
  return (
    <Link
      className={styles.item}
      to={`/rooms/${room.roomId}`}
      state={{ fromHome: true }}
    >
      {room.storeImageUrl && (
        <img className={styles.logo} src={room.storeImageUrl} alt="" />
      )}
      <span className={styles.info}>
        <span className={styles.tags}>
          <span>{trackLabels[room.track]}</span>
          <RecruitDeadline value={room.recruitDeadline} />
        </span>
        <strong className={styles.name}>{room.storeName}</strong>
        <span className={styles.spot}>{room.spotName}</span>
      </span>
      <span className={styles.members}>
        <span className={styles.avatars} aria-hidden="true">
          {participantIcons
            .slice(0, room.currentParticipants)
            .map((src, index) => (
              <img key={index} src={src} alt="" />
            ))}
        </span>
        <span
          aria-label={`정원 ${room.maxParticipants}명 중 ${room.currentParticipants}명 참여`}
        >
          {room.currentParticipants}/{room.maxParticipants}
        </span>
      </span>
    </Link>
  )
}
