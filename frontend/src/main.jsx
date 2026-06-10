import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The public site is a state-routed SPA, but the admin portal lives on real
// URLs (/login and /admin) so it can be bookmarked and never appears in the
// public navigation. Lazy-loaded so admin code never ships to visitors.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

const path = window.location.pathname
const isAdminRoute = path === '/login' || path === '/admin' || path.startsWith('/admin/')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
