import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'
import { seed } from '@/data/seed'
import { resetAll, useQuoteStore } from '@/stores'

beforeEach(() => resetAll())

test('basket count ignores lines for products that no longer exist', () => {
  useQuoteStore.getState().add('ghost', 5)
  useQuoteStore.getState().add(seed.products[0].id, 2)
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: /quote basket, 2 items/i })).toBeInTheDocument()
})
