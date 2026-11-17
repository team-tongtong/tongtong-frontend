import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="message-page">
      <h1>페이지를 찾을 수 없어요</h1>
      <p>주소를 확인하거나 홈으로 돌아가 주세요.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </main>
  )
}
