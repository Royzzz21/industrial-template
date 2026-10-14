import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { PublicLayout } from './PublicLayout'
import { resetAll } from '@/stores'

beforeEach(() => resetAll())

test('sets the document title from the company settings', () => {
  const router = createMemoryRouter([{ path: '/', element: <PublicLayout />, children: [{ index: true, element: <p>home</p> }] }])
  render(<RouterProvider router={router} />)
  expect(document.title).toBe('Northline Industrial Supply')
})
