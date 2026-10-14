import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { resetAll, useSettingsStore } from '@/stores'

beforeEach(() => resetAll())

test('never displays the stored credentials', () => {
  const { unmount } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
  expect(screen.getByLabelText('Username')).toBeInTheDocument()
  expect(screen.queryByText(/123/)).not.toBeInTheDocument()
  unmount()
  useSettingsStore.getState().update({ admin: { email: 'owner', password: 'S3cret!!' } })
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
  expect(screen.queryByText(/S3cret/)).not.toBeInTheDocument()
  expect(screen.queryByText(/owner/)).not.toBeInTheDocument()
})
