import { Outlet, Route, Routes } from 'react-router'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { GroupOrderDetailPage } from '@/pages/GroupOrderDetailPage'
import { HomePage } from '@/pages/HomePage'
import { CreateRoomPage } from '@/pages/CreateRoomPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { sampleOrderHistory } from '@/pages/sampleOrderHistory'
import { SearchPage } from '@/pages/SearchPage'

const orders = import.meta.env.DEV ? sampleOrderHistory : []

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
          <Route path="/search" element={<SearchPage />} />
          <Route path="/orders" element={<OrdersPage orders={orders} />} />
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
          path="/orders/:orderId"
          element={<OrderDetailPage orders={orders} />}
        />
        <Route path="/rooms/new" element={<CreateRoomPage />} />
        <Route path="/rooms/:roomId" element={<GroupOrderDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MobileLayout>
  )
}
