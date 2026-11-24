import { Link, NavLink } from 'react-router'
import catFace from '@/assets/character-cat-face.png'
import styles from './BottomNavigation.module.css'

const tabs = [
  {
    path: '/',
    label: '홈',
    icon: 'M2 10 12 2l10 8v11a1 1 0 0 1-1 1h-6v-7H9v7H3a1 1 0 0 1-1-1Z',
  },
  {
    path: '/search',
    label: '검색',
    icon: 'M10 2a8 8 0 1 0 4.6 14.55L21 23l2-2-6.45-6.4A8 8 0 0 0 10 2Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z',
  },
  {
    path: '/orders',
    label: '주문 내역',
    icon: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 5v2h2V7Zm4 0v2h8V7Zm-4 5v2h2v-2Zm4 0v2h8v-2Z',
  },
  {
    path: '/mypage',
    label: '마이페이지',
    icon: 'M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 12c-5 0-10 2.4-10 6v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.6-5-6-10-6Z',
  },
]

function TabLink({ path, label, icon }: (typeof tabs)[number]) {
  return (
    <NavLink to={path} end aria-label={label} className={styles.item}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32">
        <path fill="currentColor" fillRule="evenodd" d={icon} />
      </svg>
    </NavLink>
  )
}

export function BottomNavigation() {
  return (
    <nav className={styles.bar} aria-label="주요 메뉴">
      {tabs.slice(0, 2).map((tab) => (
        <TabLink key={tab.path} {...tab} />
      ))}
      <Link to="/rooms/new" aria-label="모집방 만들기" className={styles.item}>
        <span className={styles.create}>
          <img src={catFace} alt="" />
          <span aria-hidden="true" className={styles.badge}>
            +
          </span>
        </span>
      </Link>
      {tabs.slice(2).map((tab) => (
        <TabLink key={tab.path} {...tab} />
      ))}
    </nav>
  )
}
