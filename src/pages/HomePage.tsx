import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { useEffect, useRef, useState } from 'react'
import { FilterChip } from '@/components/filter/FilterChip'
import { GroupOrderListItem } from '@/components/group-order/GroupOrderListItem'
import areaIcon from '@/assets/home/area.svg'
import pickupCat from '@/assets/home/pickup-cat.png'
import {
  pickupSpots,
  sampleGroupOrdersQuery,
  type PickupSpot,
} from './sampleGroupOrders'
import styles from './HomePage.module.css'

export function HomePage() {
  const [expanded, setExpanded] = useState(false)
  const [spot, setSpot] = useState<PickupSpot | null>(null)
  const list = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const handle = useRef<HTMLButtonElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)
  const wheel = useRef({ time: -Infinity, distance: 0, opening: false })

  useEffect(() => {
    const element = panel.current
    if (!element) return

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
        return

      const gesture = wheel.current
      if (event.timeStamp - gesture.time > 160) {
        gesture.distance = 0
        gesture.opening = false
      }
      gesture.time = event.timeStamp
      if (expanded && !gesture.opening) return
      if (!expanded && event.deltaY <= 0) return

      // Consume the opening wheel gesture, including its trackpad momentum.
      event.preventDefault()
      if (expanded) return
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? (event.currentTarget as HTMLElement).clientHeight
            : 1
      gesture.distance += event.deltaY * unit
      if (gesture.distance >= 16) {
        gesture.opening = true
        setExpanded(true)
      }
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [expanded])

  function changePanel(open: boolean) {
    if (!open && list.current) list.current.scrollTop = 0
    setExpanded(open)
  }

  function startSwipe(x: number, y: number) {
    suppressClick.current = false
    swipe.current = { x, y }
  }

  function moveSwipe(x: number, y: number) {
    const start = swipe.current
    if (!start) return
    const dy = start.y - y
    if (Math.max(Math.abs(dy), Math.abs(x - start.x)) < 16) return
    swipe.current = null
    if (Math.abs(x - start.x) >= Math.abs(dy)) return
    suppressClick.current = true
    changePanel(dy > 0)
  }

  function selectSpot(next: PickupSpot | null) {
    if (next !== spot && list.current) list.current.scrollTop = 0
    setSpot(next)
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
        ref={panel}
        className={styles.panel}
        aria-label="주변 모집방"
        onTouchStart={(event) => {
          const touch = event.touches[0]
          suppressClick.current = false
          if (
            touch &&
            event.touches.length === 1 &&
            (!expanded || handle.current?.contains(event.target as Node))
          )
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
          ref={handle}
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
          onClick={() => changePanel(!expanded)}
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
          <FilterChip selected={spot === null} onClick={() => selectSpot(null)}>
            전체
          </FilterChip>
          {pickupSpots.map((point) => (
            <FilterChip
              key={point}
              selected={spot === point}
              onClick={() => selectSpot(point)}
            >
              {point}
            </FilterChip>
          ))}
        </div>
        <div id="nearby-rooms" ref={list} className={styles.scrollArea}>
          <NearbyRoomList spot={spot} expanded={expanded} />
        </div>
      </section>
    </main>
  )
}

function NearbyRoomList({
  spot,
  expanded,
}: {
  spot: PickupSpot | null
  expanded: boolean
}) {
  const query = useQuery(sampleGroupOrdersQuery)

  if (query.isPending) {
    return (
      <div className={styles.feedback}>
        <LoadingSpinner label="모집방 목록을 불러오는 중" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className={styles.feedback}>
        <p role="alert">모집방 목록을 불러오지 못했어요.</p>
        <button type="button" onClick={() => void query.refetch()}>
          다시 시도
        </button>
      </div>
    )
  }

  const filtered = spot
    ? query.data.filter((room) => room.spot === spot)
    : query.data
  if (!filtered.length) {
    return (
      <p className={styles.empty} role="status">
        {spot
          ? '이 픽업 위치에는 모집 중인 방이 없어요.'
          : '현재 모집 중인 방이 없어요.'}
      </p>
    )
  }

  return (
    <ul className={styles.rooms} aria-label="모집방 목록">
      {(expanded ? filtered : filtered.slice(0, 2)).map((room) => (
        <li key={room.id}>
          <GroupOrderListItem room={room} />
        </li>
      ))}
    </ul>
  )
}
