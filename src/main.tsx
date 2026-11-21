import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ApiQueryProvider } from '@/app/ApiQueryProvider'
import { App } from '@/app/App'
import { ToastProvider } from '@/components/toast/ToastProvider'
import '@/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ApiQueryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiQueryProvider>
    </ToastProvider>
  </StrictMode>,
)
