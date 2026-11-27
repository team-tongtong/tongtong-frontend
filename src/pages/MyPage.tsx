import catFace from '@/assets/character-cat-face.png'
import chevron from '@/assets/profile-chevron.svg'
import { AppHeader } from '@/components/layout/AppHeader'
import styles from './MyPage.module.css'

const previewProfile = import.meta.env.DEV
  ? { nickname: '떡볶이 사냥꾼', name: '김이박', email: 'abcd1234@gmail.com' }
  : undefined

function AccountRow({ label, value }: { label: string; value?: string }) {
  return (
    <button type="button" className={styles.row} disabled>
      <strong>{label}</strong>
      <span>{value}</span>
      <img src={chevron} alt="" width="17" height="17" />
    </button>
  )
}

export function MyPage() {
  return (
    <main className={styles.page}>
      <AppHeader title="My Page" />
      <div className={styles.body}>
        <div className={styles.avatar}>
          <img src={catFace} alt="프로필 캐릭터" width="57" height="57" />
        </div>
        <section aria-label="계정 정보" className={styles.card}>
          <AccountRow label="닉네임" value={previewProfile?.nickname} />
          <AccountRow label="이름" value={previewProfile?.name} />
          <AccountRow label="이메일" value={previewProfile?.email} />
          <AccountRow label="비밀번호 변경" />
          <AccountRow label="휴대폰 번호 변경" />
        </section>
        <div className={styles.card}>
          <AccountRow label="환불 관리" />
        </div>
        <footer className={styles.footer}>
          <button type="button" disabled>
            로그아웃
          </button>
          <button type="button" disabled>
            회원탈퇴
          </button>
        </footer>
      </div>
    </main>
  )
}
