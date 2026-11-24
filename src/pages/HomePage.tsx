import { useState } from 'react'
import { GroupOrderListItem } from '@/components/group-order/GroupOrderListItem'
import { sampleGroupOrders } from './sampleGroupOrders'
import styles from './HomePage.module.css'

export function HomePage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  return (
    <main className={styles.container}>
      <p className={styles.brand}>tong:tong</p>
      <h1>
        함께 주문하고,
        <br />
        필요한 만큼.
      </h1>
      <p>가까운 이웃과 함께 주문하는 새로운 식사 방식.</p>
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
