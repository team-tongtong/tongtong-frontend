import { useRef, useState } from 'react'
import { GroupOrderListItem } from '@/components/group-order/GroupOrderListItem'
import areaIcon from '@/assets/home/area.svg'
import pickupCat from '@/assets/home/pickup-cat.png'
import {
  pickupSpots,
  sampleGroupOrders,
  type PickupSpot,
} from './sampleGroupOrders'
import styles from './HomePage.module.css'

export function HomePage() {
  const [expanded, setExpanded] = useState(false)
  const [spot, setSpot] = useState<PickupSpot | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const list = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number; atTop: boolean } | null>(null)
  const wheel = useRef({
    time: -Infinity,
    distance: 0,
    atTop: true,
    handled: false,
  })
  const suppressClick = useRef(false)
  const filtered = sampleGroupOrders.filter(
    (room) => !spot || room.spot === spot,
  )
  const rooms = expanded ? filtered : filtered.slice(0, 2)

  function startSwipe(x: number, y: number) {
    suppressClick.current = false
    swipe.current = { x, y, atTop: (list.current?.scrollTop ?? 0) <= 0 }
  }

  function moveSwipe(x: number, y: number) {
    const start = swipe.current
    if (!start) return
    const dy = start.y - y
    if (Math.max(Math.abs(dy), Math.abs(x - start.x)) < 16) return
    swipe.current = null
    if (Math.abs(x - start.x) >= Math.abs(dy)) return
    suppressClick.current = true
    if (dy > 0 || start.atTop) setExpanded(dy > 0)
  }

  function selectSpot(next: PickupSpot | null) {
    setSpot(next)
    setSelectedRoomId(null)
  }

  return (
    <main className={styles.home} aria-label="홈" data-expanded={expanded}>
      <section className={styles.map} aria-label="샘플 픽업 위치 지도">
        <span
          className={styles.location}
          role="img"
          aria-label="샘플 현재 위치"
        />
        {pickupSpots.map((point) => (
          <button
            key={point}
            type="button"
            className={styles.marker}
            data-spot={point}
            aria-label={point + ' 픽업 위치'}
            aria-pressed={spot === point}
            onClick={() => selectSpot(spot === point ? null : point)}
          >
            <img src={pickupCat} alt="" />
          </button>
        ))}
      </section>
      <section
        className={styles.panel}
        aria-label="주변 모집방"
        onTouchStart={(event) => {
          const touch = event.touches[0]
          if (touch && event.touches.length === 1)
            startSwipe(touch.clientX, touch.clientY)
          else swipe.current = null
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0]
          if (touch && event.touches.length === 1)
            moveSwipe(touch.clientX, touch.clientY)
        }}
        onTouchEnd={() => {
          swipe.current = null
        }}
        onTouchCancel={() => {
          swipe.current = null
        }}
        onWheel={(event) => {
          if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
            return
          const gesture = wheel.current
          if (event.timeStamp - gesture.time > 160) {
            gesture.distance = 0
            gesture.handled = false
            gesture.atTop = (list.current?.scrollTop ?? 0) <= 0
          }
          gesture.time = event.timeStamp
          if (gesture.handled) return
          // Wheel deltas can be in pixels, lines or pages.
          const unit =
            event.deltaMode === 1
              ? 16
              : event.deltaMode === 2
                ? event.currentTarget.clientHeight
                : 1
          gesture.distance += event.deltaY * unit
          if (Math.abs(gesture.distance) < 16) return
          gesture.handled = true
          if (gesture.distance > 0 || gesture.atTop)
            setExpanded(gesture.distance > 0)
        }}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail > 0) {
            event.preventDefault()
            event.stopPropagation()
          }
          suppressClick.current = false
        }}
        onPointerDownCapture={(event) => {
          if (event.pointerType === 'mouse') suppressClick.current = false
        }}
      >
        <button
          type="button"
          className={styles.handle}
          aria-label={expanded ? '모집방 목록 접기' : '모집방 목록 펼치기'}
          aria-controls="nearby-rooms"
          aria-expanded={expanded}
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse' || event.button !== 0) return
            startSwipe(event.clientX, event.clientY)
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (event.pointerType === 'mouse' && event.buttons === 1)
              moveSwipe(event.clientX, event.clientY)
          }}
          onLostPointerCapture={(event) => {
            if (event.pointerType === 'mouse') swipe.current = null
          }}
          onClick={(event) => {
            // Keyboard and assistive activation have no pointer click count.
            if (event.detail === 0) setExpanded((open) => !open)
          }}
        >
          <span className={styles.grip} />
          <span className={styles.region}>
            <img src={areaIcon} alt="" draggable={false} />
            안산 사동
          </span>
        </button>
        <div
          className={styles.filters}
          role="group"
          aria-label="픽업 위치 필터"
        >
          <button
            type="button"
            aria-pressed={spot === null}
            onClick={() => selectSpot(null)}
          >
            전체
          </button>
          {pickupSpots.map((point) => (
            <button
              key={point}
              type="button"
              aria-pressed={spot === point}
              onClick={() => selectSpot(point)}
            >
              {point}
            </button>
          ))}
        </div>
        <div
          id="nearby-rooms"
          ref={list}
          key={spot ?? '전체'}
          className={styles.scrollArea}
        >
          {rooms.length > 0 ? (
            <ul className={styles.rooms} aria-label="모집방 목록">
              {rooms.map((room) => (
                <li key={room.id}>
                  <GroupOrderListItem
                    room={room}
                    selected={selectedRoomId === room.id}
                    onSelect={setSelectedRoomId}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>
              이 픽업 위치에는 모집 중인 방이 없어요.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
