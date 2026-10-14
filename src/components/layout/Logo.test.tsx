import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Logo } from './Logo'

test('logo link accessible name contains its visible text', () => {
  render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>,
  )
  const link = screen.getByRole('link')
  expect(link).toHaveAccessibleName(expect.stringContaining('Northline'))
  expect(link.getAttribute('aria-label')).toBeNull()
})
