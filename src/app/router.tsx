import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
