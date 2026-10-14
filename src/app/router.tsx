import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { ProductsPage } from '@/pages/public/ProductsPage'
import { ProtectedRoute } from './ProtectedRoute'

// Admin pages are loaded on demand so the public site ships a smaller bundle.
const AdminShell = lazy(() => import('@/components/layout/AdminShell').then((m) => ({ default: m.AdminShell })))
const LoginPage = lazy(() => import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ProductsAdminPage = lazy(() => import('@/pages/admin/ProductsAdminPage').then((m) => ({ default: m.ProductsAdminPage })))
const ProductEditPage = lazy(() => import('@/pages/admin/ProductEditPage').then((m) => ({ default: m.ProductEditPage })))
const CategoriesAdminPage = lazy(() => import('@/pages/admin/CategoriesAdminPage').then((m) => ({ default: m.CategoriesAdminPage })))
const SlidesAdminPage = lazy(() => import('@/pages/admin/SlidesAdminPage').then((m) => ({ default: m.SlidesAdminPage })))
const SettingsAdminPage = lazy(() => import('@/pages/admin/SettingsAdminPage').then((m) => ({ default: m.SettingsAdminPage })))
const EnquiriesAdminPage = lazy(() => import('@/pages/admin/EnquiriesAdminPage').then((m) => ({ default: m.EnquiriesAdminPage })))
const DataAdminPage = lazy(() => import('@/pages/admin/DataAdminPage').then((m) => ({ default: m.DataAdminPage })))

const fallback = (
  <div className="grid min-h-screen place-items-center bg-concrete">
    <Spinner label="Loading admin" />
  </div>
)

const withSuspense = (el: React.ReactNode) => <Suspense fallback={fallback}>{el}</Suspense>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: withSuspense(<LoginPage />) },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<AdminShell />),
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },
          { path: 'products', element: withSuspense(<ProductsAdminPage />) },
          { path: 'products/new', element: withSuspense(<ProductEditPage />) },
          { path: 'products/:id', element: withSuspense(<ProductEditPage />) },
          { path: 'categories', element: withSuspense(<CategoriesAdminPage />) },
          { path: 'slides', element: withSuspense(<SlidesAdminPage />) },
          { path: 'settings', element: withSuspense(<SettingsAdminPage />) },
          { path: 'enquiries', element: withSuspense(<EnquiriesAdminPage />) },
          { path: 'data', element: withSuspense(<DataAdminPage />) },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
