import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'
import { seed } from '@/data/seed'
import { useQuoteStore } from '@/stores'

beforeEach(() => {
  useQuoteStore.getState().clear()
})

test('shows the quote basket count', () => {
  useQuoteStore.getState().add(seed.products[0].id, 2)
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: /quote basket, 2 items/i })).toBeInTheDocument()
})

test('mobile menu button toggles aria-expanded and the nav panel', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
  const toggle = screen.getByRole('button', { name: /open menu/i })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await user.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument()
  await user.keyboard('{Escape}')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})
