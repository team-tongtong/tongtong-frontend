import { Outlet, Route, Routes } from 'react-router'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { GroupOrderDetailPage } from '@/pages/GroupOrderDetailPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <MobileLayout>
      <Routes>
        <Route
          element={
            <>
              <Outlet />
              <BottomNavigation />
            </>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="/search"
            element={
              <main>
                <h1>검색</h1>
              </main>
            }
          />
          <Route
            path="/orders"
            element={
              <main>
                <h1>주문 내역</h1>
              </main>
            }
          />
          <Route
            path="/mypage"
            element={
              <main>
                <h1>마이페이지</h1>
              </main>
            }
          />
        </Route>
        <Route
          path="/rooms/new"
          element={
            <main>
              <h1>모집방 만들기</h1>
            </main>
          }
        />
        <Route path="/rooms/:roomId" element={<GroupOrderDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MobileLayout>
  )
}
