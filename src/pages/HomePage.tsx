import { useState } from 'react'
import { GroupOrderListItem } from '@/components/group-order/GroupOrderListItem'
import { sampleGroupOrders } from './sampleGroupOrders'
import styles from './HomePage.module.css'

export function HomePage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  return (
    <main aria-label="홈">
      <ul className={styles.rooms} aria-label="모집방 목록">
        {sampleGroupOrders.map((room) => (
          <li key={room.id}>
            <GroupOrderListItem
              room={room}
              selected={selectedRoomId === room.id}
              onSelect={setSelectedRoomId}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
