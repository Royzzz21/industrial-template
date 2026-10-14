import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { resetAll, useSettingsStore } from '@/stores'

beforeEach(() => resetAll())

test('shows the demo credentials only while they are still the seed defaults', () => {
  const { unmount } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
  expect(screen.getByText(/northline2026/)).toBeInTheDocument()
  unmount()
  useSettingsStore.getState().update({ admin: { email: 'owner@client.com', password: 'S3cret!!' } })
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
  expect(screen.queryByText(/S3cret/)).not.toBeInTheDocument()
  expect(screen.queryByText(/owner@client.com/)).not.toBeInTheDocument()
})
