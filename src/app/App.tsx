import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { GroupOrderDetailPage } from '@/pages/GroupOrderDetailPage'
import { MyPage } from '@/pages/MyPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { HomePage } from '@/pages/HomePage'
import { CreateRoomPage } from '@/pages/CreateRoomPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { SearchPage } from '@/pages/SearchPage'

const onboardingKey = 'tongtong.onboardingCompleted'

export function App() {
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(onboardingKey) === 'true'
    } catch {
      return false
    }
  })
  function finishOnboarding() {
    setOnboarded(true)
    try {
      localStorage.setItem(onboardingKey, 'true')
    } catch {
      // Keep the completion state for this visit if storage is unavailable.
    }
  }
  const { pathname, search } = useLocation()
  const showingSearchResults =
    pathname === '/search' && new URLSearchParams(search).has('q')
  return (
    <MobileLayout>
      <Routes>
        <Route
          path="/onboarding"
          element={<OnboardingPage onComplete={finishOnboarding} />}
        />
        <Route
          element={
            <>
              <Outlet />
              {!showingSearchResults && <BottomNavigation />}
            </>
          }
        >
          <Route
            path="/"
            element={
              onboarded ? <HomePage /> : <Navigate to="/onboarding" replace />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/rooms/new" element={<CreateRoomPage />} />
        <Route path="/rooms/:roomId" element={<GroupOrderDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MobileLayout>
  )
}
