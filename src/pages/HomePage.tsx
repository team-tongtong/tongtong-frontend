import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <main className={styles.container}>
      <p className={styles.brand}>tong:tong</p>
      <h1>
        함께 주문하고,
        <br />
        필요한 만큼.
      </h1>
      <p>가까운 이웃과 함께 주문하는 새로운 식사 방식.</p>
      <div className={styles.card}>
        <h2>통통을 준비하고 있어요</h2>
        <p>쪼개 받기와 따로 묶기로 만나요.</p>
      </div>
    </main>
  )
}
