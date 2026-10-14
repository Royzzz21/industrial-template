import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuthStore } from '@/stores'

function App() {
  return (
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<h1>Sign in</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<h1>Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => useAuthStore.getState().logout())

test('redirects to the login page when not authenticated', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
})

test('renders the protected page after login', () => {
  useAuthStore.getState().login('admin@northline.example', 'northline2026')
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
})
