import { createBrowserRouter } from 'react-router-dom'
import { AdminShell } from '@/components/layout/AdminShell'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { CategoriesAdminPage } from '@/pages/admin/CategoriesAdminPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { DataAdminPage } from '@/pages/admin/DataAdminPage'
import { EnquiriesAdminPage } from '@/pages/admin/EnquiriesAdminPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { ProductEditPage } from '@/pages/admin/ProductEditPage'
import { ProductsAdminPage } from '@/pages/admin/ProductsAdminPage'
import { SettingsAdminPage } from '@/pages/admin/SettingsAdminPage'
import { SlidesAdminPage } from '@/pages/admin/SlidesAdminPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { ProductsPage } from '@/pages/public/ProductsPage'
import { ProtectedRoute } from './ProtectedRoute'

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
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'products', element: <ProductsAdminPage /> },
          { path: 'products/new', element: <ProductEditPage /> },
          { path: 'products/:id', element: <ProductEditPage /> },
          { path: 'categories', element: <CategoriesAdminPage /> },
          { path: 'slides', element: <SlidesAdminPage /> },
          { path: 'settings', element: <SettingsAdminPage /> },
          { path: 'enquiries', element: <EnquiriesAdminPage /> },
          { path: 'data', element: <DataAdminPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
